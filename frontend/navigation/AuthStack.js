import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import MoodInputScreen from '../screens/MoodInputScreen';
import HomeScreen from '../screens/HomeScreen';
import SupportScreen from '../screens/SupportScreen';
import MindMateScreen from '../screens/MindMateScreen';
import TrackMoodScreen from '../screens/TrackMoodScreen';
import TalkToMindMateScreen from '../screens/TalkToMindMateScreen';
import MoodHistoryScreen from '../screens/MoodHistoryScreen';



const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator 
      initialRouteName="MindMateScreen" // Set MindMateScreen as the initial screen
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#f9f9f9',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: '#f9f9f9',
        },
      }}
    >
      <Stack.Screen 
        name="MindMateScreen" 
        component={MindMateScreen}
        options={{ headerShown: false }} // Hide header on MindMateScreen
      />
      <Stack.Screen 
        name="TrackMoodScreen" 
        component={TrackMoodScreen}
        options={{ headerShown: false }} // Hide header on TrackMoodScreen
      />
      <Stack.Screen 
        name="TalkToMindMateScreen" 
        component={TalkToMindMateScreen}
        options={{ headerShown: false }} // Hide header on TalkToMindMateScreen
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{ headerShown: false }} // Hide header on Signup
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }} // Hide header on Login
      />
      <Stack.Screen 
        name="OtpVerification" 
        component={OtpVerificationScreen}
        options={{ title: 'OTP Verification' }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{ headerShown: false }} // Hide header on Forgot Password
      />
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen}
        options={{ headerShown: false }} // Hide header on HomeScreen
      />

      <Stack.Screen
  name="MoodHistoryScreen"
  component={MoodHistoryScreen}
  options={{ title: 'Mood History' }}
/>


<Stack.Screen
  name="SupportScreen"
  component={SupportScreen}
  options={{ title: 'Talk to MindMate' }}
/>
      <Stack.Screen 
        name="MoodInputScreen" 
        component={MoodInputScreen}
        options={{ title: 'Mood Input' }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
