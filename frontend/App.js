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

// Custom Drawer Content with Logout button — **NO navigation reset here!**
function CustomDrawerContent(props) {
  const { logout } = useContext(AuthContext);

  const confirmLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            logout(); // Just clear auth, no navigation calls
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logout" onPress={confirmLogout} />
    </DrawerContentScrollView>
  );
}

const AppDrawer = () => (
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
    <Drawer.Screen name="HomeStack" component={HomeStack} options={{ title: 'Home' }} />
    <Drawer.Screen name="Account" component={AccountScreen} />
  </Drawer.Navigator>
);

const RootNavigator = () => {
  const { userToken, isLoading, isFirstLaunch } = useContext(AuthContext);

  if (isLoading || isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!userToken) {
  return <AuthStack initialRouteName="Splash" />;
}

  return <AppDrawer />;
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
