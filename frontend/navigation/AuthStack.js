import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
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
import VersePopupScreen from '../screens/VersePopupScreen';
import MoodAnalyticsScreen from '../screens/MoodAnalyticsScreen';
import SplashScreen from '../screens/SplashScreen';



const Stack = createStackNavigator();

const AuthStack = ({ initialRouteName }) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
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
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,  // <--- Add this line here

      }}
    >

      <Stack.Screen
  name="Splash"
  component={SplashScreen}
  options={{ headerShown: false }} // Hide header for Splash
/>
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

      <Stack.Screen name="MoodAnalytics" component={MoodAnalyticsScreen}   options={{ headerShown: false }}  // hide default header
 />

      <Stack.Screen 
        name="OtpVerification" 
        component={OtpVerificationScreen}
        options={{ title: 'OTP Verification' }}
      />

<Stack.Screen name="VersePopupScreen" component={VersePopupScreen} />

      
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
