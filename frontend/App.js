import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/AuthStack';
import { AuthProvider } from './context/AuthContext';
import * as Font from 'expo-font';
import { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  React.useEffect(() => {
    Font.loadAsync({
      'DancingScript': require('./assets/fonts/DancingScript-Medium.ttf'),
    }).then(() => setFontLoaded(true));
  }, []);

  if (!fontLoaded) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    </AuthProvider>
  );
}