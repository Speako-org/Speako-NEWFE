import Svg, { Circle } from 'react-native-svg';

interface EmotionCircleChartProps {
  negativeRatio: number;
  positiveRatio: number;
  size?: number;
  strokeWidth?: number;
}

const CircleChart: React.FC<EmotionCircleChartProps> = ({
  negativeRatio,
  positiveRatio,
  size = 80,
  strokeWidth = 7,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const totalRatio = negativeRatio + positiveRatio;
  const adjustedNegativeRatio =
    totalRatio > 100 ? (negativeRatio / totalRatio) * 100 : negativeRatio;
  const adjustedPositiveRatio =
    totalRatio > 100 ? (positiveRatio / totalRatio) * 100 : positiveRatio;

  const negLength = (adjustedNegativeRatio / 100) * circumference;
  const posLength = (adjustedPositiveRatio / 100) * circumference;

  return (
    <Svg width={size} height={size}>
      {/* 회색 배경 */}
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke="#e2e2e2"
        strokeWidth={strokeWidth}
        fill="none"
      />

      {/* 긍정(오른쪽) */}
      {adjustedPositiveRatio > 0 && (
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#8ab5fa"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${posLength} ${circumference}`}
          strokeDashoffset={0}
          transform={`rotate(-90 ${center} ${center})`}
          strokeLinecap="butt"
        />
      )}

      {/* 부정(왼쪽)*/}
      {adjustedNegativeRatio > 0 && (
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#ff8f89"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${negLength} ${circumference}`}
          strokeDashoffset={-negLength}
          transform={`rotate(-90 ${center} ${center})`}
          strokeLinecap="butt"
        />
      )}
    </Svg>
  );
};

export default CircleChart;
