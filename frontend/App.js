import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/AuthStack';
import { AuthProvider, AuthContext } from './context/AuthContext';
import * as Font from 'expo-font';
import { View, ActivityIndicator, Alert } from 'react-native';  // <-- Added Alert import
import HomeStack from './navigation/HomeStack'; // import it


import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import HomeScreen from './screens/HomeScreen';
import AccountScreen from './screens/AccountScreen';

const Drawer = createDrawerNavigator();

// Custom Drawer Content to add Logout button with confirmation
function CustomDrawerContent(props) {
  const { logout } = useContext(AuthContext);

  // Function to show logout confirmation alert
  const confirmLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },          // Cancel button
        { text: "Logout", style: "destructive", onPress: () => logout() }, // Confirm logout
      ],
      { cancelable: true }
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Render default drawer items (Home, Account, etc.) */}
      <DrawerItemList {...props} />

      {/* Logout button triggers confirmation */}
      <DrawerItem
        label="Logout"
        onPress={confirmLogout}  // <-- Changed to call confirmLogout instead of direct logout
      />
    </DrawerContentScrollView>
  );
}

// Drawer shown after login
const AppDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName="HomeStack"
      screenOptions={{ headerShown: false }}
    >
      {/* Use MoodStack as the Home screen with all nested routes */}
      <Drawer.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen name="Account" component={AccountScreen} />
    </Drawer.Navigator>
  );
};



// Root navigator decides which stack to show based on auth
const RootNavigator = () => {
  const { userToken, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return userToken ? <AppDrawer /> : <AuthStack />;
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      DancingScript: require('./assets/fonts/DancingScript-Medium.ttf'),
    }).then(() => setFontLoaded(true));
  }, []);

  if (!fontLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
