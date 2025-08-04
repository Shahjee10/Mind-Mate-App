import React, { useContext, useState, useLayoutEffect, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // ✅ Required for avatar picker
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../apiConfig';


const BASE_URL = API_BASE_URL;

const githubLogoUri =
  'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png';

const AccountScreen = () => {
  const navigation = useNavigation();
  const { userInfo, userToken, setUserInfo } = useContext(AuthContext);

  const isGithubUser =
    userInfo?.provider?.toLowerCase() === 'github' || !!userInfo?.githubUsername;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // 🔽 NEW STATE for manual avatar upload
  const [selectedImage, setSelectedImage] = useState(null);

  // 🔽 Sync selectedImage with userInfo.avatar (show avatar on load/login)
  useEffect(() => {
    if (userInfo?.avatar) {
      setSelectedImage(BASE_URL + userInfo.avatar);
    } else {
      setSelectedImage(null);
    }
  }, [userInfo]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <View style={styles.burgerIcon}>
          <Ionicons
            name="menu"
            size={28}
            color="#4b0082"
            onPress={() => navigation.openDrawer()}
          />
        </View>
      ),
      title: 'Account',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: '#4b0082',
      },
      headerStyle: {
        backgroundColor: '#f0f4f8',
        elevation: 0,
        shadowOpacity: 0,
      },
    });
  }, [navigation]);

  const handleUpdatePassword = async () => {
    try {
      if (!userToken) {
        alert('You must be logged in to update your password.');
        return;
      }

      if (newPassword !== confirmNewPassword) {
        alert('New password and confirm password do not match.');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/auth/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password update failed');
      }

      alert(data.message || 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('🔴 Password update error:', error);
      alert(error.message || 'Something went wrong');
    }
  };

  // 🔽 NEW: Pick image from gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: false,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // 🔽 NEW: Upload image to backend
 const handleUploadAvatar = async () => {
  if (!selectedImage) {
    alert("Please select an image first.");
    return;
  }

  const formData = new FormData();
  formData.append('avatar', {
    uri: selectedImage,
    type: 'image/jpeg',
    name: 'avatar.jpg',
  });

  try {
    const response = await fetch(`${BASE_URL}/api/users/upload-avatar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    alert('Avatar uploaded successfully!');

    setUserInfo(prev => {
      const updatedUser = {
        ...prev,
        avatar: data.avatar,
      };

      AsyncStorage.setItem('userInfo', JSON.stringify(updatedUser)).catch(error => {
        console.error('Failed to save updated user info to AsyncStorage', error);
      });

      return updatedUser;
    });
  } catch (error) {
    console.error('🔴 Avatar Upload Error:', error);
    alert(error.message || 'Something went wrong');
  }
};


  // GitHub user UI remains unchanged
  if (isGithubUser) {
    return (
      <View style={githubStyles.container}>
        <Image source={{ uri: userInfo?.avatar }} style={githubStyles.avatar} />
        <Text style={githubStyles.name}>{userInfo?.name}</Text>
        <Text style={githubStyles.email}>{userInfo?.email}</Text>

        <View style={githubStyles.githubNotice}>
          <Image source={{ uri: githubLogoUri }} style={githubStyles.githubLogo} />
          <Text style={githubStyles.noticeText}>
            You are logged in via <Text style={githubStyles.githubHighlight}>GitHub</Text>.
            Account details cannot be updated here.
          </Text>
        </View>
      </View>
    );
  }

  // Manual user view
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f0f4f8' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={manualStyles.scrollContainer}>
        <View style={manualStyles.container}>

          {/* 🔽 Upload Avatar Section for Manual Users */}
          <View style={manualStyles.avatarContainer}>
            <TouchableOpacity onPress={pickImage}>
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={manualStyles.avatarImage}
                />
              ) : (
                <View style={manualStyles.avatarPlaceholder}>
                  <Text style={manualStyles.avatarText}>Upload Avatar</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* 🔽 Upload Button */}
          <TouchableOpacity
            onPress={handleUploadAvatar}
            style={[manualStyles.button, { backgroundColor: '#4b0082', marginBottom: 20 }]}
          >
            <Text style={manualStyles.buttonText}>Save Avatar</Text>
          </TouchableOpacity>

          {/* Account Info */}
          <Text style={manualStyles.title}>Account Details</Text>

          <View style={manualStyles.infoBox}>
            <Text style={manualStyles.label}>Name:</Text>
            <Text style={manualStyles.infoText}>{userInfo?.name || 'N/A'}</Text>
          </View>

          <View style={manualStyles.infoBox}>
            <Text style={manualStyles.label}>Email:</Text>
            <Text style={manualStyles.infoText}>{userInfo?.email || 'N/A'}</Text>
          </View>

          {/* Password Update */}
          <Text style={[manualStyles.title, { marginTop: 30 }]}>Update Password</Text>

          <TextInput
            style={manualStyles.input}
            placeholder="Current Password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            autoCapitalize="none"
          />

          <TextInput
            style={manualStyles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            autoCapitalize="none"
          />

          <TextInput
            style={manualStyles.input}
            placeholder="Confirm New Password"
            secureTextEntry
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
            autoCapitalize="none"
          />

          <TouchableOpacity style={manualStyles.button} onPress={handleUpdatePassword}>
            <Text style={manualStyles.buttonText}>Update Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Burger menu style
const styles = StyleSheet.create({
  burgerIcon: {
    position: 'absolute',
    top: 50,
    left: 15,
    zIndex: 1000,
    backgroundColor: '#7dbeffff',
    padding: 5,
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

// GitHub styles (unchanged)
const githubStyles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f9f9fb',
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#6a1b9a',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4b0082',
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
    textAlign: 'center',
  },
  githubNotice: {
    marginTop: 40,
    alignItems: 'center',
    backgroundColor: '#f0e6ff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#6a1b9a',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  githubLogo: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  noticeText: {
    fontSize: 16,
    color: '#4b0082',
    textAlign: 'center',
  },
  githubHighlight: {
    fontWeight: '700',
    color: '#9333ea',
  },
});

// Manual styles (added avatarImage)
const manualStyles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarPlaceholder: {
    backgroundColor: '#ddd',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#4b0082',
  },
  avatarText: {
    color: '#777',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4b0082',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  infoBox: {
    backgroundColor: '#e6d4f3',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#522e69',
    marginBottom: 6,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#333',
  },
  button: {
    backgroundColor: '#6a1b9a',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default AccountScreen;
