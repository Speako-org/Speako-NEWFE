import { useState, useEffect, useRef } from 'react';
import { Alert, Text, View } from 'react-native';
import { Audio } from 'expo-av';
import { formatDateTime } from '../../../utils/formatDataTime';
import { formatTime } from '../../../utils/formatTime';
import RecordButton from '../../../components/RecordButton/RecordButton';

export default function Home() {
  const [recording, setRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const maxRecordTime = 3600; // 1시간 제한
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [recordingInstance, setRecordingInstance] = useState<Audio.Recording | null>(null);

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

  const onStartRecord = async () => {
    try {
      if (recordingInstance) {
        try {
          await recordingInstance.stopAndUnloadAsync();
        } catch (e) {
          // 이미 정리된 인스턴스일 수 있으니 무시
        }
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
      setRecording(true);
    } catch (error) {
      setRecording(false);
      setRecordingInstance(null); // 예외 발생 시 인스턴스 강제 정리
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
        } catch (e) {
          // 이미 정리된 인스턴스일 수 있으니 무시
        }
        const uri = recordingInstance.getURI();
        setRecordedUri(uri);
        setRecordingInstance(null);
        console.log('recordingInstance stopped and set to null');
      }
      setRecording(false);
      console.log('setRecording(false) called');
    } catch (error) {
      setRecording(false);
      setRecordingInstance(null); // 예외 발생 시 인스턴스 강제 정리
      console.error('Failed to stop recording', error);
      Alert.alert('오류', '녹음을 중지할 수 없습니다.');
    }
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

  const { formattedDate, formattedTime } = formatDateTime(currentDateTime);

  return (
    <View className="flex-1 items-center justify-center bg-[#f2f2f2]">
      {recording && (
        <View
          className="absolute bottom-0 left-0 right-0 top-0 z-10 h-full w-full bg-black/30"
          pointerEvents="none"
        />
      )}
      <View className="absolute bottom-0 h-[111px] w-full bg-white" />

      <Text className="ml-[30px] self-start text-[28px] font-bold">음성 녹음</Text>

      <View className="mb-[10px] mt-[30px] w-[85%] flex-row justify-between">
        <Text className="rounded-xl bg-[#e0e0e0] px-[12px] py-[5px] text-[#4a4a4a]">
          {formattedDate}
        </Text>
        <Text className="rounded-xl bg-[#e0e0e0] px-[12px] py-[5px] text-[#4a4a4a]">
          {formattedTime}
        </Text>
      </View>

      <View
        className={`elevation-4 relative mb-[100px] h-[200px] w-[85%] items-center justify-center rounded-[20px] px-[30px] shadow-sm ${
          recording ? 'bg-white' : 'bg-[#f5f5f5]'
        }`}>
        {recording && <View className="absolute z-[-1] h-full w-full rounded-[10px] bg-white/80" />}

        {recording && (
          <Text className="absolute right-[18px] top-[18px] text-[13px] text-[#303030]">
            {`${formatTime(recordTime)} / 01:00:00`}
          </Text>
        )}

        <RecordButton
          recording={!!recordingInstance}
          onStartRecord={onStartRecord}
          onStopRecord={onStopRecord}
        />

        <Text
          className="mt-5 pt-[20px] font-semibold leading-6 tracking-[0.5px] text-[#888]"
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
    </View>
  );
}
