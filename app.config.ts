import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'nativewind',
  slug: 'nativewind',
  version: '1.0.0',
  scheme: 'nativewind',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.anonymous.Speako',
    infoPlist: {
      NSMicrophoneUsageDescription: '이 앱은 음성 녹음을 위해 마이크 접근이 필요합니다.',
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.amu601.nativewind',
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-dev-launcher',
      {
        launchMode: 'most-recent',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
});
