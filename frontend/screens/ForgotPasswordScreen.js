import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import API_BASE_URL from '../apiConfig';  // adjust relative path as needed

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleRequestOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/auth/request-password-reset`, {
        email,
      });

      if (response.data.success) {
        setOtpSent(true);
        Alert.alert('Success', response.data.message);
      } else {
        Alert.alert('Error', response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      Alert.alert('Error', 'Please enter OTP and new password');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });

      if (response.data.success) {
        Alert.alert('Success', 'Password reset successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtpSent(false);
    setOtp('');
    setNewPassword('');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Text style={styles.title}>Reset Your Password</Text>
        <Text style={styles.subtitle}>Regain access to your peace of mind</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!otpSent}
          returnKeyType="done"
          blurOnSubmit={true}
        />

        {otpSent && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              keyboardType="numeric"
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
              returnKeyType="next"
              blurOnSubmit={false}
            />

            <TextInput
              style={styles.input}
              placeholder="New Password"
              secureTextEntry
              autoCapitalize="none"
              value={newPassword}
              onChangeText={setNewPassword}
              returnKeyType="done"
              blurOnSubmit={true}
            />
          </>
        )}

        {!otpSent ? (
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRequestOtp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Sending OTP...' : 'Send OTP'}</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleResetPassword}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Resetting...' : 'Reset Password'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.resendButton, loading && styles.buttonDisabled]} 
              onPress={handleResendOtp}
              disabled={loading}
            >
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Back to Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3E5F5', // Light lavender background
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4A0072', // Dark purple for title
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6A1B9A', // Medium purple for subtitle
    marginBottom: 25,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    borderColor: '#CE93D8', // Light purple border
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#7B1FA2', // Primary purple button
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 6, // Reduced margin to bring buttons closer
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  resendButton: {
    backgroundColor: '#9C27B0', // Secondary purple for resend
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12, // Space before link
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resendText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  link: {
    color: '#9C27B0', // Accent purple for link
    textAlign: 'center',
    marginTop: 8,
    textDecorationLine: 'underline',
    fontSize: 15,
  },
});