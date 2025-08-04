/// <reference types="nativewind/types" />

import 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
}

declare module 'expo-router' {
  type RouteNames =
    | '/(protected)/(tabs)/home'
    | '/(protected)/(tabs)/record'
    | '/(protected)/(tabs)/social'
    | '/(protected)/(tabs)/my'
    | '/(protected)/Setting'
    | '/(public)/login'
    | '/(public)/signup';

  export function useRouter(): {
    push: (options: { pathname: RouteNames; params?: Record<string, string> }) => void;
    replace: (options: { pathname: RouteNames; params?: Record<string, string> }) => void;
    back: () => void;
  };

  export function useLocalSearchParams<T extends Record<string, string>>(): T;

  export const Tabs: React.FC<{
    screenOptions?: {
      tabBarActiveTintColor?: string;
      headerShown?: boolean;
    };
    children?: React.ReactNode;
  }> & {
    Screen: React.FC<{
      name: string;
      options?: {
        title?: string;
        tabBarIcon?: (props: { color: string }) => React.ReactNode;
        href?: string | null;
        tabBarButton?: () => React.ReactNode;
      };
    }>;
  };
}
