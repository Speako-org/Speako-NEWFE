import { View, Text } from 'react-native';
import records from '../../../data/records';
import RecordDate from '../../../components/RecordDate/RecordDate';

export default function Record() {
  return (
    <View className="flex-1 bg-[#f2f2f2] pt-[90px]">
      {/* 하단 탭바 배경 */}
      <View className="absolute bottom-0 h-[111px] w-full bg-white" />

      {/* 상단 헤더 */}
      <View className="mb-5 px-[35px]">
        <Text className="self-start text-[28px] font-bold">음성 기록</Text>
      </View>

      {/* 기록 카드 */}
      <View className="flex-1">
        <RecordDate records={records} />
      </View>
    </View>
  );
}
