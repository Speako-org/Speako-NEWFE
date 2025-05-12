import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const EmotionChart = () => {
  return (
    <View className="mb-2.5">
      {' '}
      {/* chartSection */}
      {/* Header */}
      <View className="mx-5 mb-[15px] mt-5 flex-row items-center justify-between">
        {' '}
        {/* chartHeader */}
        <Text className="pl-2.5 text-[18px] font-bold text-black">
          {' '}
          {/* chartTitle */}
          주간 감정 변화
        </Text>
        <TouchableOpacity className="flex-row items-center pr-2.5">
          {' '}
          {/* periodButton */}
          <Text className="mr-1.5 text-[14px] text-gray-500">
            {' '}
            {/* periodText */}
            최근 5개월
          </Text>
          <Ionicons name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>
      </View>
      {/* Chart Box */}
      <View className="elevation-3 rounded-[12px] bg-white p-[13px] shadow-sm">
        {/* chart */}
        <LineChart
          data={{
            labels: ['1월', '2월', '3월', '4월', '5월'],
            datasets: [
              {
                data: [80, 45, 60, 20, 10],
                color: (opacity = 1) => `rgba(160, 136, 224, ${opacity})`,
                strokeWidth: 2,
              },
              {
                data: [20, 70, 40, 80, 90],
                color: (opacity = 1) => `rgba(255, 146, 138, ${opacity})`,
                strokeWidth: 2,
              },
            ],
            legend: [],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 12,
            },
            propsForDots: {
              r: '4',
              strokeWidth: '3',
              stroke: '#fff',
            },
            propsForLabels: {
              fontSize: 12,
            },
            propsForBackgroundLines: {
              strokeDasharray: [],
            },
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
          }}
          withHorizontalLines={false}
          withVerticalLines={false}
          withDots={true}
          withShadow={false}
          bezier={false}
        />
      </View>
      {/* Legend */}
      <View className="mr-[15px] mt-2.5 flex-row justify-end">
        {' '}
        {/* legendContainer */}
        <View className="mx-2.5 flex-row items-center">
          {' '}
          {/* legendItem */}
          <View className="mr-1.5 h-2 w-2 rounded-full bg-[#A088E0]" /> {/* legendDot */}
          <Text className="text-[12px] text-gray-500">긍정적 표현</Text> {/* legendText */}
        </View>
        <View className="mx-2.5 flex-row items-center">
          {' '}
          {/* legendItem */}
          <View className="mr-1.5 h-2 w-2 rounded-full bg-[#FF928A]" /> {/* legendDot */}
          <Text className="text-[12px] text-gray-500">부정적 표현</Text> {/* legendText */}
        </View>
      </View>
    </View>
  );
};

export default EmotionChart;
