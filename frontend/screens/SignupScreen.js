import React, { useState, useContext } from 'react';
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
import { loginWithGithub } from '../utils/githubOAuth';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigation = useNavigation();
  const { setUserToken } = useContext(AuthContext); // Get setUserToken from context

  const handleSendOtp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://192.168.100.21:5000/api/auth/signup', {
        name,
        email,
        password,
      });

      if (response.data.success) {
        setOtpSent(true);
        Alert.alert('Success', response.data.message);
      } else {
        Alert.alert('Signup Failed', response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSignup = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://192.168.100.21:5000/api/auth/complete-signup', {
        name,
        email,
        password,
        otp,
      });
      if (response.data.success) {
        // Save the token to context for authenticated requests
        setUserToken(response.data.token); // <-- Save JWT token
        Alert.alert('Success', 'Account created successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]);
      } else {
        Alert.alert('Signup Failed', response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to complete signup');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    try {
      setLoading(true);
      const result = await loginWithGithub();
      // Save the token to context if your backend returns it
      if (result && result.token) {
        setUserToken(result.token); // <-- Save JWT token
      }
      Alert.alert('Success', 'GitHub signup successful!');
      // Optionally navigate to MoodInputScreen or another screen
      // navigation.navigate('MoodInputScreen');
    } catch (error) {
      Alert.alert('GitHub Signup Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtpSent(false);
    setOtp('');
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
        <Text style={styles.title}>Signup</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          editable={!otpSent}
          autoCapitalize="words"
          returnKeyType="next"
          blurOnSubmit={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!otpSent}
          returnKeyType="next"
          blurOnSubmit={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
          editable={!otpSent}
          returnKeyType="done"
          blurOnSubmit={true}
        />

        {otpSent && (
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
            maxLength={6}
            returnKeyType="done"
            blurOnSubmit={true}
          />
        )}

        {!otpSent ? (
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleSendOtp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Sending OTP...' : 'Send OTP'}</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleCompleteSignup}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Complete Signup'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.resendButton} 
              onPress={handleResendOtp}
              disabled={loading}
            >
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleGithubSignup} 
          style={[styles.githubButton, loading && styles.buttonDisabled]}
          disabled={loading}
        >
          <Text style={styles.githubText}>
            {loading ? 'Connecting...' : 'Continue with GitHub'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    padding: 20,
    paddingBottom: 40,
  },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resendButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  resendText: { color: '#fff', fontWeight: 'bold' },
  link: { color: '#007BFF', textAlign: 'center', marginTop: 10, fontSize: 16 },
  githubButton: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  githubText: { color: '#fff', fontWeight: 'bold' },
});
