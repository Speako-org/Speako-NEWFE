import { Tabs } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        headerShown: false,
        // @ts-ignore
        tabBarStyle: {
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderTopWidth: 1,
          borderTopColor: '#C8C2C2',
          height: 80,
          backgroundColor: '#fff',
          position: 'absolute',
          bottom: 0,
          overflow: 'hidden',
          margin: 0,
          padding: 3,
        },
        tabBarLabelStyle: {
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 9,
        },
        tabBarItemStyle: {
          flex: 1,
          marginHorizontal: -8,
          paddingHorizontal: 0,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: '홈',
          // @ts-ignore
          tabBarIcon: ({ color, focused }) => (
            <Feather name="home" size={24} color={focused ? 'black' : '#C8C2C2'} />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: '기록',
          // @ts-ignore
          tabBarIcon: ({ color, focused }) => (
            <Octicons name="three-bars" size={24} color={focused ? 'black' : '#C8C2C2'} />
          ),
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          title: '소셜',
          // @ts-ignore
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="people" size={24} color={focused ? 'black' : '#C8C2C2'} />
          ),
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: '마이페이지',
          // @ts-ignore
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="person" size={24} color={focused ? 'black' : '#C8C2C2'} />
          ),
        }}
      />
    </Tabs>
  );
}
