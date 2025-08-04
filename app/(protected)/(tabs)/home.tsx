import { useState, useEffect, useRef } from 'react';
import { Alert, Text, View, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { formatDateTime } from '../../../utils/formatDataTime';
import { formatTime } from '../../../utils/formatTime';
import RecordButton from '../../../components/RecordButton/RecordButton';
import * as FileSystem from 'expo-file-system';

export default function Home() {
  const [recording, setRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const maxRecordTime = 3600; // 1시간 제한
  const [recordStartTime, setRecordStartTime] = useState<Date | null>(null); // 녹음 시작 시각
  const [recordEndTime, setRecordEndTime] = useState<Date | null>(null); // 녹음 종료 시각
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [recordingInstance, setRecordingInstance] = useState<Audio.Recording | null>(null);
  const [recordId, setRecordId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const BASE_URL = 'https://speako.site/api';

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (recording) {
      intervalRef.current = setInterval(() => {
        setRecordTime((prev) => (prev < maxRecordTime ? prev + 1 : prev));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setRecordTime(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [recording]);

  // 날짜 형식 'YYYY-MM-DDTHH:MM:SS.000000'
  const toCustomISOString = (date: Date): string => {
    const kstTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return kstTime.toISOString().replace('Z', '').split('.')[0] + '.000000';
  };

  const onStartRecord = async () => {
    try {
      if (recordingInstance) {
        try {
          await recordingInstance.stopAndUnloadAsync();
        } catch (e) {}
        setRecordingInstance(null);
        return;
      }
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      setRecordedUri(null);
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecordingInstance(recording);
      setRecordedUri(recording.getURI());
      setRecordStartTime(new Date()); // 녹음 시작 시간 저장
      setRecording(true);
    } catch (error) {
      setRecording(false);
      setRecordingInstance(null);
      console.error('Failed to start recording', error);
      Alert.alert('오류', '녹음을 시작할 수 없습니다.');
    }
  };

  const onStopRecord = async () => {
    console.log('onStopRecord called');
    try {
      if (recordingInstance) {
        try {
          await recordingInstance.stopAndUnloadAsync();
        } catch (e) {}
        const uri = recordingInstance.getURI();
        setRecordedUri(uri);
        setRecordEndTime(new Date()); // 녹음 끝나는 시간 저장
        console.log('📍 녹음 파일 경로:', uri);

        setRecordingInstance(null);
        console.log('recordingInstance stopped and set to null');
      }
      setRecording(false);
      console.log('setRecording(false) called');
    } catch (error) {
      setRecording(false);
      setRecordingInstance(null);
      console.error('Failed to stop recording', error);
      Alert.alert('오류', '녹음을 중지할 수 없습니다.');
    }
  };

  const getFileNameFromUri = (uri: string) => {
    return uri.split('/').pop() ?? `audio-${Date.now()}.m4a`;
  };

  useEffect(() => {
    if (!recordingInstance) {
      setRecording(false);
    }
  }, [recordingInstance]);

  const onPlayRecordedAudio = async () => {
    if (recordedUri) {
      try {
        if (sound) {
          await sound.unloadAsync();
        }
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: recordedUri },
          { shouldPlay: true }
        );
        setSound(newSound);
      } catch (error) {
        console.error('Failed to play recording', error);
        Alert.alert('오류', '녹음을 재생할 수 없습니다.');
      }
    }
  };

  const getPresignedUrl = async (
    fileName: string
  ): Promise<{ uploadUrl: string; recordId: number } | null> => {
    try {
      const url = `${BASE_URL}/records/presigned-url?fileName=${encodeURIComponent(fileName)}`;
      console.log('😀 Request URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const rawBody = await response.text();
      const data = JSON.parse(rawBody);
      console.log('응답 상태:', response.status);
      console.log('Presigned URL 응답:', data);

      return { uploadUrl: data.result.presignedUrl, recordId: data.result.recordId };
    } catch (error) {
      console.error('Presigned URL 요청 실패:', error);
      Alert.alert('오류', '파일 업로드 URL을 받지 못했습니다.');
      return null;
    }
  };

  const uploadToS3 = async (uri: string, uploadUrl: string): Promise<boolean> => {
    try {
      // console.log('uploadUrl:', uploadUrl);
      const uploadResponse = await FileSystem.uploadAsync(uploadUrl, uri, {
        httpMethod: 'PUT',
        headers: {
          'Content-Type': 'audio/x-m4a',
        },
      });

      if (uploadResponse.status !== 200 && uploadResponse.status !== 201) {
        throw new Error(`S3 업로드 실패: ${uploadResponse.status}`);
      }

      return true;
    } catch (error) {
      console.error('S3 업로드 실패:', error);
      Alert.alert('오류', '녹음 파일 업로드에 실패했습니다.');
      return false;
    }
  };

  const requestTranscription = async (
    recordId: number,
    fileUrl: string,
    startTime: string,
    endTime: string
  ) => {
    try {
      const queryParams = new URLSearchParams({
        recordS3Path: fileUrl,
        startTime,
        endTime,
      });

      console.log('recordId??', recordId);
      const url = `${BASE_URL}/records/${recordId}/transcriptions?${queryParams.toString()}`;
      console.log('😀 STT 요청 URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('STT 요청 실패');

      Alert.alert('요청 완료', '음성 텍스트 변환을 시작했습니다.');
    } catch (error) {
      console.error('STT 요청 실패:', error);
      Alert.alert('오류', '음성 텍스트 변환 요청에 실패했습니다.');
    }
  };

  const handleUploadAndTranscribe = async () => {
    if (!recordedUri) {
      Alert.alert('오류', '녹음된 파일이 없습니다.');
      return;
    }

    setIsUploading(true);
    const fileName = getFileNameFromUri(recordedUri);
    const presigned = await getPresignedUrl(fileName);

    // console.log('업로드함수: ', presigned);

    if (!presigned || !presigned.uploadUrl) {
      Alert.alert('오류', '유효한 업로드 URL이 없습니다.');
      setIsUploading(false);
      return;
    }

    const success = await uploadToS3(recordedUri, presigned.uploadUrl);
    if (success) {
      setRecordId(presigned.recordId);

      const fileUrl = presigned.uploadUrl.split('?')[0];
      console.log('😇 실제 업로드된 버킷 경로', fileUrl);

      // 'voice/...' 부분만 추출
      const recordS3Path = fileUrl.split('.com/')[1];

      const formattedStartTime = toCustomISOString(recordStartTime ?? new Date()); // 날짜 형식 'YYYY-MM-DDTHH:MM:SS.000000'
      const formattedEndTime = toCustomISOString(recordEndTime ?? new Date());
      console.log(formattedStartTime, formattedEndTime);
      await requestTranscription(
        presigned.recordId,
        recordS3Path,
        formattedStartTime,
        formattedEndTime
      );
    }

    setIsUploading(false);
  };

  const { formattedDate, formattedTime } = formatDateTime(currentDateTime);

  return (
    <View className="relative flex-1 items-center justify-center">
      {recording && <View className="absolute inset-0 z-10 bg-black/50" pointerEvents="none" />}
      <View className="absolute bottom-0 h-[111px] w-full" />

      <Text className="ml-[30px] self-start text-[33px] font-bold">음성 녹음</Text>

      <View className="mb-[10px] mt-[30px] w-[85%] flex-row justify-between">
        <Text className="rounded-xl bg-[#e8e8e8] px-[12px] py-[5px] text-[15px] text-[#4a4a4a]">
          {formattedDate}
        </Text>
        <Text className="rounded-xl bg-[#e8e8e8] px-[12px] py-[5px] text-[15px] text-[#4a4a4a]">
          {formattedTime}
        </Text>
      </View>

      <View
        className={`elevation-4 shadow-xs relative z-20 mb-[100px] h-[200px] w-[85%] items-center justify-center rounded-[20px] px-[30px] ${
          recording ? 'bg-white' : 'bg-[#f9f9f9]'
        }`}>
        {recording && <View className="absolute z-[-1] h-full w-full rounded-[10px] bg-white/80" />}

        {recording && (
          <Text className="absolute right-[18px] top-[18px] text-[15px] text-[#303030]">
            {`${formatTime(recordTime)} / 01:00:00`}
          </Text>
        )}

        <RecordButton
          recording={!!recordingInstance}
          onStartRecord={onStartRecord}
          onStopRecord={onStopRecord}
        />

        <Text
          className="pt-[20px] text-[15px] font-medium  tracking-[0.5px] text-[#888]"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 1 },
            shadowRadius: 2,
            elevation: 2,
          }}>
          {recording ? '한번 더 누를 시 중지됩니다.' : '버튼을 누르시면 음성이 기록됩니다.'}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onPlayRecordedAudio}
        disabled={!recordedUri}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: recordedUri ? '#a7cdfc' : '#cccccc',
          borderRadius: 10,
        }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {recordedUri ? '녹음 듣기 테스트' : '녹음 없음'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleUploadAndTranscribe}
        disabled={!recordedUri || isUploading}
        style={{
          marginTop: 10,
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: !recordedUri || isUploading ? '#cccccc' : '#4caf50',
          borderRadius: 10,
        }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {isUploading ? '업로드 중...' : '녹음 업로드 및 텍스트화 요청'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
