import { Text, View, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

type RecordType = {
  id: string;
  title: string;
  date: string;
  duration: string;
};

export default function RecordDetail() {
  const router = useRouter();
  const { record } = useLocalSearchParams<{ record: string }>();
  const recordData: RecordType = JSON.parse(record);

  return (
    <View className="flex-1 bg-white px-[25px] pt-[80px]">
      {/* 하단 탭바 배경 */}
      <View className="absolute bottom-0 h-[111px] w-full bg-white" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 */}
        <View className="mb-[25px] flex-row items-center justify-between">
          <Entypo name="chevron-thin-left" size={18} onPress={() => router.back()} />
          <Text>{recordData.title}</Text>
          <Text>{recordData.duration}</Text>
        </View>

        {/* 음성 인식 결과 */}
        <View className="mb-[30px] rounded-[10px] border border-[#e2e2e2] p-[10px]">
          <View className="flex-row items-center px-[3px] py-[5px] pb-[10px]">
            <Text className="pl-[4px] text-[14px] font-semibold">음성 인식 결과</Text>
          </View>
          <Text className="pb-[5px] pl-[7px] text-[13px] leading-[18px]">
            저는 오늘 회의에서 발표를 했는데요, 너무 긴장돼서 말이 자주 끊기고 어버버 거렸어요. 제가
            발표를 너무 못하니까 다들 실망했을 것 같아요😢
          </Text>
        </View>

        {/* 감정 분석 */}
        <View className="flex-row items-center px-[3px] py-[5px]">
          <Entypo name="pie-chart" size={14} />
          <Text className="pl-[4px] text-[14px] font-semibold">감정 분석</Text>
        </View>

        <View className="mb-[30px] rounded-[10px] border border-[#e2e2e2] p-[15px]">
          <View className="w-full flex-row justify-between">
            <View>
              {[
                { label: '부정적 표현', value: '65%' },
                { label: '긍정적 표현', value: '15%' },
                { label: '기타', value: '20%' },
              ].map((item, idx) => (
                <View key={idx} className="my-[5px] w-[190px] flex-row justify-between text-[13px]">
                  <Text>{item.label}</Text>
                  <Text>{item.value}</Text>
                </View>
              ))}
            </View>

            <View className="items-center justify-center">
              <Svg height="80" width="80">
                <Circle cx="40" cy="40" r="30" stroke="#D94B44" strokeWidth="7" fill="none" />
              </Svg>
            </View>
          </View>

          {/* 구분선 */}
          <View className="my-[15px] h-[1px] bg-[#ddd]" />

          <Text className="mx-[5px] text-[14px] font-medium">발견된 부정적 표현</Text>
          <View className="mt-[5px] flex-row flex-wrap">
            {['못하니까', '실망', '긴장'].map((tag, idx) => (
              <Text
                key={idx}
                className="mr-[2.5px] mt-[3px] rounded-full bg-[#ffe9e9] px-[10px] py-[5px] text-[12px]">
                {tag}
              </Text>
            ))}
          </View>
        </View>

        {/* 개선 추이 */}
        <View className="flex-row items-center px-[3px] py-[5px]">
          <Entypo name="line-graph" size={14} />
          <Text className="pl-[4px] text-[14px] font-semibold">개선 추이</Text>
        </View>

        <View className="mb-[20px] rounded-[10px] border border-[#e2e2e2] p-[10px]">
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
