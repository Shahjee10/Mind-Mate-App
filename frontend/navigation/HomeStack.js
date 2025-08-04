// navigation/HomeStack.js
import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import MoodInputScreen from '../screens/MoodInputScreen';
import MoodHistoryScreen from '../screens/MoodHistoryScreen';
import SupportScreen from '../screens/SupportScreen';
import MoodAnalyticsScreen from '../screens/MoodAnalyticsScreen';
import VersePopupScreen from '../screens/VersePopupScreen'; // ✅ import it


const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="MoodAnalytics" component={MoodAnalyticsScreen} />
      <Stack.Screen name="MoodInputScreen" component={MoodInputScreen} />
      <Stack.Screen name="MoodHistoryScreen" component={MoodHistoryScreen} />
      <Stack.Screen name="SupportScreen" component={SupportScreen} />
      <Stack.Screen name="VersePopupScreen" component={VersePopupScreen} />

    </Stack.Navigator>
  );
};

export default HomeStack;
