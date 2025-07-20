import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/AuthStack';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

export default function App() {
  return (
    // Wrap the app in AuthProvider to provide auth state to all components
    <AuthProvider>
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    </AuthProvider>
  );
}