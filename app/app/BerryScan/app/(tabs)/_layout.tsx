import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon'; // Adjust path as per your project structure
import { Colors } from '@/constants/Colors'; // Adjust path as per your project structure
import { useColorScheme } from '@/hooks/useColorScheme'; // Adjust path as per your project structure


// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBX5fmw91abLEpSPoyFFxmEBkuG5kxPXso",
  authDomain: "berryscan-c511a.firebaseapp.com",
  databaseURL: "https://berryscan-c511a-default-rtdb.firebaseio.com",
  projectId: "berryscan-c511a",
  storageBucket: "berryscan-c511a.appspot.com",
  messagingSenderId: "531425893147",
  appId: "1:531425893147:web:4b53cbab16fac3d7b751be"
};

const TabLayout: React.FC = () => {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: 'Signup',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Signup_Form"
        //component={SignupForm}
        options={{
          title: 'Signup Form',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'document-text' : 'document-text-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default TabLayout;
