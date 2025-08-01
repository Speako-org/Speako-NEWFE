import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import { Svg, Circle } from 'react-native-svg';
import CircleChart from '~/components/CircleChart/CircleChart';
import * as SecureStore from 'expo-secure-store';

type RecordType = {
  id: string;
  title: string;
  date: string;
  duration: string;
};

type AnalysisResult = {
  transcriptionId: number;
  analysisId: number;
  title: string;
  thumbnailText: string;
  negativeRatio: number;
  positiveRatio: number;
  negativeWordsTop3: string[] | null;
  averageNegativeRatioOf7DaysAgo: number;
  averageNegativeRatioOfToday: number;
  dailyRatioOfRecent7Days: {
    date: string;
    avgNegativeRatio: number;
    avgPositiveRatio: number;
  }[];
};

export default function RecordDetail() {
  const router = useRouter();
  const { record } = useLocalSearchParams<{ record: string }>();
  const recordData: RecordType = JSON.parse(record);

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);

  const BASE_URL = 'https://speako.site/api';

  // 분석 데이터
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync('accessToken');

        const response = await fetch(`${BASE_URL}/analyses/10`, {
          // 임시값 10
          method: 'GET',
          headers: {
            accept: '*/*',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setAnalysis(data.result);
      } catch (error) {
        console.error('분석 데이터 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  console.log(analysis?.thumbnailText);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#D94B44" />
        <Text className="mt-2 text-gray-500">분석 결과를 불러오는 중...</Text>
      </View>
    );
  }

  if (!analysis) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="mb-4 text-red-500">분석 데이터를 불러올 수 없습니다.</Text>
        <TouchableOpacity
          onPress={() => router.push('/(protected)/record')}
          className="rounded-lg bg-[#888888] px-5 py-3">
          <Text className="text-white">이전 페이지로 돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-[25px] pt-[80px]">
      {/* 하단 탭바 배경 */}
      <View className="absolute bottom-0 h-[111px] w-full bg-white" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View className="mb-[25px] flex-row items-center justify-between">
          <Entypo
            name="chevron-thin-left"
            size={18}
            onPress={() => router.push('/(protected)/record')}
          />
          <Text className="text-[18px] font-bold">{recordData.title}</Text>
          <Text>{recordData.duration}</Text>
        </View>

        {/* 음성 인식 결과 */}
        <View className="mb-[30px] rounded-[10px] border border-[#e2e2e2] p-[10px]">
          <View className="flex-row items-center px-[3px] py-[5px] pb-[10px]">
            <Text className="pl-[4px] text-[17px] font-semibold">음성 인식 결과</Text>
          </View>
          <Text className="pb-[5px] pl-[7px] text-[15px] leading-[18px]">
            {analysis.thumbnailText}
          </Text>
        </View>

        {/* 감정 분석 */}
        <View className="flex-row items-center px-[3px] py-[5px]">
          <Entypo name="pie-chart" size={16} />
          <Text className="pl-[4px] text-[17px] font-semibold">감정 분석</Text>
        </View>

        <View className="mb-[30px] mt-[5px] rounded-[10px] border border-[#e2e2e2] px-[20px] py-[20px]">
          <View className="w-full flex-row justify-between">
            <View>
              {[
                { label: '부정적 표현', value: `${analysis.negativeRatio}%` },
                { label: '긍정적 표현', value: `${analysis.positiveRatio}%` },
                {
                  label: '기타',
                  value: `${100 - (analysis.negativeRatio + analysis.positiveRatio)}%`,
                },
              ].map((item, idx) => (
                <View key={idx} className="my-[5px] w-[190px] flex-row justify-between text-[13px]">
                  <Text>{item.label}</Text>
                  <Text>{item.value}</Text>
                </View>
              ))}
            </View>

            <View className="items-center justify-center">
              <CircleChart
                negativeRatio={analysis.negativeRatio}
                positiveRatio={analysis.positiveRatio}
              />
            </View>
          </View>

          {/* 구분선 */}
          <View className="my-[15px] h-[1px] bg-[#ddd]" />

          <Text className="mx-[4px] text-[14px] font-semibold">발견된 부정적 표현</Text>
          <View className="mt-[5px] flex-row flex-wrap">
            {['못하니까', '실망', '긴장'].map((tag, idx) => (
              <Text
                key={idx}
                className="mr-[5.5px] mt-[3px] rounded-full bg-[#ffe9e9] px-[10px] py-[5px] text-[12px]">
                {tag}
              </Text>
            ))}
          </View>
        </View>

        {/* 개선 추이 */}
        <View className="flex-row items-center px-[3px] py-[5px]">
          <Entypo name="line-graph" size={16} />
          <Text className="pl-[4px] text-[17px] font-semibold">개선 추이</Text>
        </View>

        <View className="mb-[20px] mt-[5px] rounded-[10px] border border-[#e2e2e2] px-[10px] py-[15px]">
          {[
            { label: '1주 전', percent: 90, text: '90% 부정' },
            { label: '현재', percent: 35, text: '35% 부정' },
          ].map((item, idx) => (
            <View key={idx} className="flex-row items-center justify-between py-[5px]">
              <Text className="w-[60px] pl-[8px] text-[12px]">{item.label}</Text>
              <View className="relative h-[17px] w-[200px] overflow-hidden rounded-full border border-[#d5d5d5] bg-[#fcfcfc]">
                <View
                  style={{ width: `${item.percent}%` }}
                  className="h-full rounded-full bg-[#FF978E]"
                />
              </View>
              <Text className="w-[60px] pl-[8px] text-[12px]">{item.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
