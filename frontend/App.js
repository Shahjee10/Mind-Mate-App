import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/AuthStack';
import { AuthProvider, AuthContext } from './context/AuthContext';
import * as Font from 'expo-font';
import { View, ActivityIndicator, Alert } from 'react-native';
import HomeStack from './navigation/HomeStack';

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

  const confirmLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => logout() },
      ],
      { cancelable: true }
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={confirmLogout}
      />
    </DrawerContentScrollView>
  );
}

// Drawer shown after login with custom styling added here
const AppDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName="HomeStack"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 250,
          backgroundColor: '#E6F4F1',
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        },
        drawerActiveTintColor: '#00695C',
        drawerInactiveTintColor: '#004D40',
        drawerLabelStyle: { fontSize: 16, fontWeight: '600' },
      }}
    >
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
