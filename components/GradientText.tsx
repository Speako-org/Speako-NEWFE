import React from 'react';
import { Text, ColorValue } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientTextProps {
  text: string;
  style?: string;
  colors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

const GradientText: React.FC<GradientTextProps> = ({
  text,
  style = '',
  colors = ['#94A0FF', '#D2B6FF'] as const,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
}) => (
  <MaskedView maskElement={<Text className={style}>{text}</Text>}>
    <LinearGradient colors={colors} start={start} end={end}>
      <Text className={`${style} opacity-0`}>{text}</Text>
    </LinearGradient>
  </MaskedView>
);

export default GradientText;
