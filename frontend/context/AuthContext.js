import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const loadAppData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const user = await AsyncStorage.getItem('userInfo');
        if (token && user) {
          setUserToken(token);
          setUserInfo(JSON.parse(user));
        }

        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('hasLaunched', 'true');
        } else {
          setIsFirstLaunch(false);
        }
      } catch (e) {
        console.error('Error loading app data', e);
        setIsFirstLaunch(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppData();
  }, []);

  const login = async (token, user) => {
    setUserToken(token);
    setUserInfo(user);
    await AsyncStorage.setItem('userToken', token);
    await AsyncStorage.setItem('userInfo', JSON.stringify(user));
  };

  const logout = async () => {
    setUserToken(null);
    setUserInfo(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        userInfo,
        isLoading,
        isFirstLaunch,
        login,
        logout,
        setUserToken,
        setUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
