import React, { useContext } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import AccountScreen from '../screens/AccountScreen';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const Drawer = createDrawerNavigator();

// Custom Drawer Content component
function CustomDrawerContent(props) {
  const { logout } = useContext(AuthContext);

  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => logout() },
      ],
      { cancelable: true }
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>MindMate</Text>
      </View>

      <DrawerItemList {...props} />

      <DrawerItem label="Logout" onPress={confirmLogout} labelStyle={styles.logoutLabel} />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#00695C',
        drawerInactiveTintColor: '#004D40',
        drawerLabelStyle: { fontSize: 16, fontWeight: '600' },
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
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Account" component={AccountScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#E6F4F1',
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#004D40',
  },
  logoutLabel: {
    color: '#D32F2F',
    fontWeight: '600',
  },
});
