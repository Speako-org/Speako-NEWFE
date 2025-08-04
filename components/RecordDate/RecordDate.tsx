import { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type RecordType = {
  id: string;
  title: string;
  date: string;
  duration: string;
};

interface RecordProps {
  records: RecordType[];
}

export default function RecordDate({ records }: RecordProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const changeDate = (days: number) => {
    setSelectedDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
  };

  const formattedSelectedDate = selectedDate.toISOString().split('T')[0];

  const filteredRecords = records.filter((record) => record.date === formattedSelectedDate);

  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];
  const isToday = formattedSelectedDate === formattedToday;

  const handleRecordPress = (record: RecordType) => {
    router.push({
      pathname: '/(protected)/record-detail',
      params: { record: JSON.stringify(record) },
    });
  };

  return (
    <View className="mx-[28px] h-[580px] rounded-[15px] bg-white px-[10px] py-[20px]">
      {/* 날짜 이동 컨트롤 */}
      <View className="mx-[15px] my-[20px] flex-row items-center justify-between">
        <TouchableOpacity onPress={() => changeDate(-1)}>
          <AntDesign name="left" size={20} />
        </TouchableOpacity>

        <Text className="text-[20px] font-semibold text-[#8962c8]">{formattedSelectedDate}</Text>

        <TouchableOpacity onPress={() => changeDate(1)} disabled={isToday}>
          <AntDesign name="right" size={20} color={isToday ? '#bbb' : 'black'} />
        </TouchableOpacity>
      </View>

      <View className="mx-[10px] h-[1px] bg-[#eee]" />

      {/* 기록 리스트 */}
      <FlatList
        data={filteredRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleRecordPress(item)}>
            <View className="mx-[15px] gap-[3px] py-[13px]">
              <Text className="pb-[1px] text-[16px] font-bold">{item.title}</Text>
              <Text className="text-[14px] text-[#777]">{item.duration}</Text>
            </View>
            <View className="mx-[10px] h-[1px] bg-[#eee]" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text className="mx-[15px] mt-[20px] text-[15px] text-[#888]">기록 없음</Text>
        }
      />
    </View>
  );
}
