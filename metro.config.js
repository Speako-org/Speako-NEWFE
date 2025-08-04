// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */

const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Set default port to 8080
config.server = {
  ...config.server,
  port: 8080,
};

// 웹 환경에서 import.meta 문제 해결을 위한 설정
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// 웹 환경에서 React Native 호환성 개선
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native$': 'react-native-web',
};

module.exports = withNativeWind(config, { input: './global.css' });
