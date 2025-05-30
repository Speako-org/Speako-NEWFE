import '../global.css';
import { Slot } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return <Slot />;
}
