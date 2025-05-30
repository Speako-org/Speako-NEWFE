import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import EmotionChart from '../../../components/Chart/EmotionChart';

const Mypage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white pt-[80px]">
      {/* Header */}
      <View className="flex-row items-center justify-between bg-white px-[25px] pb-5">
        <Text className="text-[28px] font-bold text-black">마이페이지</Text>
        <TouchableOpacity className="p-[5px]" onPress={() => router.push({ pathname: '/Setting' })}>
          <Ionicons name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View
        className="elevation-3 mx-[20px] mb-[10px] mt-[15px] rounded-[10px] border border-[#fff] px-[15px] pt-5"
        style={{ borderWidth: 1, borderColor: '#ddd' }}>
        {/* Profile Info */}
        <View className="mb-5 flex-row items-center">
          <Image
            source={require('../../../assets/default-profile.png')}
            className="mr-[15px] h-[60px] w-[60px] rounded-full"
          />
          <View className="flex-1">
            <View className="mb-2 flex-row items-center">
              <Text className="mr-[5px] text-[18px] font-bold text-black">박은지</Text>
              <Text className="rounded-full bg-[#eadeff] px-2 py-1 text-[9px] font-bold text-[#8953e0]">
                긍정 마스터
              </Text>
            </View>
            <Text className="text-[13px] font-semibold text-gray-500">
              매일 긍정적인 표현을 연습하며 성장중입니다.
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View className="mb-[20px] mt-[10px] flex-row justify-between">
          <View className="flex-1 items-center">
            <Text className="mb-[5px] text-[22px] font-bold text-black">42</Text>
            <Text className="text-[14px] font-semibold text-gray-500">기록 횟수</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="mb-[5px] text-[22px] font-bold text-black">156</Text>
            <Text className="text-[14px] font-semibold text-gray-500">긍정 표현</Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="mb-[5px] text-[22px] font-bold text-[#8953e0]">+65%</Text>
            <Text className="text-[14px] font-semibold text-gray-500">개선율</Text>
          </View>
        </View>
      </View>

      {/* Chart */}
      <EmotionChart />
    </View>
  );
};

export default Mypage;
