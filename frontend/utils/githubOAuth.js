// frontend/utils/githubOAuth.js
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

// Import the GitHub client ID from environment variables
import { GITHUB_CLIENT_ID } from '@env';

// Use the environment variable, fallback to the known client ID for demo
const githubClientId = GITHUB_CLIENT_ID || "Ov23liu9JpRw9hbgR4U7";

// Configure the redirect URI
const redirectUri = 'exp://192.168.100.21:8081';

// Debug: Log the configuration
console.log('🔍 Debug - Redirect URI:', redirectUri);
console.log('🔍 Debug - Platform:', Platform.OS);
console.log('🔍 Debug - GitHub Client ID:', githubClientId);

/**
 * Initiates the GitHub OAuth login flow using manual WebBrowser approach.
 * @returns {Promise<Object>} The result of the authentication session.
 */
export const loginWithGithub = async () => {
  try {
    // Construct the GitHub OAuth URL manually (no PKCE)
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&scope=read:user%20user:email&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    console.log('🔍 Debug - Auth URL:', authUrl);
    
    // Open the GitHub OAuth page in a web browser
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
    
    console.log('GitHub OAuth result:', result);
    
    if (result.type === 'success' && result.url) {
      // Extract the authorization code from the URL
      const url = new URL(result.url);
      const code = url.searchParams.get('code');
      
      if (code) {
        console.log('🔍 Debug - Extracted code:', code);
        // Send the code to your backend
        return await sendCodeToBackend(code);
      } else {
        throw new Error('No authorization code received from GitHub');
      }
    } else {
      throw new Error('GitHub OAuth was cancelled or failed');
    }
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    throw error;
  }
};

/**
 * Sends the authorization code to your backend to complete the OAuth flow.
 * @param {string} code - The authorization code from GitHub
 * @returns {Promise<Object>} The user data and token from your backend
 */
const sendCodeToBackend = async (code) => {
  try {
    console.log('🔍 Debug - Sending to backend - Code:', code);
    
    const response = await fetch('http://192.168.100.21:5000/api/auth/github', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to authenticate with backend');
    }
    
    return data;
  } catch (error) {
    console.error('Backend authentication error:', error);
    throw error;
  }
};
