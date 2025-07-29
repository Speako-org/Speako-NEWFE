import { View, Text, Pressable, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { useState, useEffect } from 'react';

const EmotionChart = () => {
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const updateDimensions = () => {
      setScreenWidth(Dimensions.get('window').width);
    };

    // 초기 화면 크기 설정
    updateDimensions();

    const subscription = Dimensions.addEventListener('change', updateDimensions);
    return () => {
      subscription?.remove();
    };
  }, []);

  // 차트가 항상 표시되도록 안정적인 너비 설정
  const chartWidth = Math.max(screenWidth - 40, 300);

  // 차트 데이터
  const chartData = {
    labels: ['1월', '2월', '3월', '4월', '5월'],
    datasets: [
      {
        data: [80, 40, 60, 20, 0],
        color: (opacity = 1) => `rgba(160, 136, 224, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [20, 60, 40, 80, 100],
        color: (opacity = 1) => `rgba(255, 146, 138, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: [],
  };

  return (
    <View className="mx-[20px]">
      {/* Header */}
      <View className="mb-[15px] flex-row items-center justify-between pt-7">
        <Text className="text-[18px] font-bold text-black">주간 감정 변화</Text>
        <Pressable className="flex-row items-center pr-2.5">
          <Text className="mr-1.5 text-[14px] text-gray-500">최근 5개월</Text>
          <Ionicons name="chevron-down" size={16} color="#666" />
        </Pressable>
      </View>

      {/* Chart Box */}
      <View
        className="elevation-3 rounded-[15px] bg-white px-4 pb-[20px] shadow-sm"
        style={{
          minHeight: 250,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={250}
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
              fontSize: 14,
            },
            propsForBackgroundLines: {
              strokeDasharray: [],
            },
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            paddingRight: 50,
            paddingTop: 50,
          }}
          withHorizontalLines={false}
          withVerticalLines={false}
          withDots={true}
          withShadow={false}
          bezier={false}
          onDataPointClick={() => {}}
          style={{
            marginVertical: 4,
            borderRadius: 12,
          }}
          fromZero={true}
          yAxisSuffix=""
          segments={5}
          yAxisInterval={1}
          getDotColor={(dataPoint, index) => {
            if (index === 0) return 'rgba(160, 136, 224, 1)';
            if (index === 1) return 'rgba(255, 146, 138, 1)';
            return 'rgba(160, 136, 224, 1)';
          }}
        />
      </View>

      {/* Legend */}
      <View className="mt-2.5 flex-row justify-end">
        <View className="mx-2.5 flex-row items-center">
          <View className="mr-1.5 h-2 w-2 rounded-full bg-[#A088E0]" />
          <Text className="text-[12px] text-gray-500">긍정적 표현</Text>
        </View>
        <View className="mx-2.5 flex-row items-center">
          <View className="mr-1.5 h-2 w-2 rounded-full bg-[#FF928A]" />
          <Text className="text-[12px] text-gray-500">부정적 표현</Text>
        </View>
      </View>
    </View>
  );
};

export default EmotionChart;
