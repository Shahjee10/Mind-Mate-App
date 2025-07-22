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
import { AuthContext } from '../context/AuthContext';
import Svg, { Path } from 'react-native-svg';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://192.168.100.21:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      if (token && user) {
        await login(token, user);
        Alert.alert('Success', 'Logged in successfully');
        navigation.navigate('HomeScreen');
      } else {
        Alert.alert('Login Failed', 'Invalid response from server');
      }
    } catch (error) {
      Alert.alert('Login Failed', error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setLoading(true);
      const result = await loginWithGithub();
      if (result && result.token) {
        await login(result.token, result.user || null);
      }
      Alert.alert('Success', 'GitHub login successful!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('HomeScreen'),
        },
      ]);
    } catch (error) {
      Alert.alert('GitHub Login Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Take a step towards your mental peace</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          blurOnSubmit={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          returnKeyType="done"
          blurOnSubmit={true}
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>New here? Create an account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleGithubLogin} 
          style={[styles.githubButton, loading && styles.buttonDisabled]}
          disabled={loading}
        >
          <Svg width={24} height={24} viewBox="0 0 24 24" style={styles.githubLogo}>
            <Path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.610-4.042-1.610C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="#FFFFFF"
            />
          </Svg>
          <Text style={styles.githubText}>
            {loading ? 'Connecting...' : 'Continue with GitHub'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFC0CB', // Pink background
  },
  scrollContainer: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    padding: 15,
    paddingBottom: 30,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 8, 
    textAlign: 'center', 
    color: '#880E4F', // Dark magenta for contrast
    fontFamily: 'cursive',
  },
  subtitle: { 
    fontSize: 14, 
    color: '#6A1B9A', // Purple for warmth and visibility
    textAlign: 'center', 
    marginBottom: 25,
    fontStyle: 'italic',
    fontFamily: 'cursive',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F8BBD0', // Light pink border
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    color: '#333333', // Dark gray for input text
  },
  button: {
    backgroundColor: '#D81B60', // Bright pinkish-red button
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: { 
    color: '#FFFFFF', // White text for contrast
    fontWeight: 'bold', 
    fontSize: 14 
  },
  link: { 
    color: '#6A1B9A', // Purple for links, matching subtitle
    textAlign: 'center', 
    marginTop: 8, 
    fontSize: 14,
    fontFamily: 'cursive',
  },
  githubButton: {
    flexDirection: 'row',
    backgroundColor: '#24292E', // GitHub dark gray
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  githubLogo: {
    marginRight: 8,
  },
  githubText: { 
    color: '#FFFFFF', // White text for contrast
    fontWeight: 'bold', 
    fontSize: 14 
  },
});