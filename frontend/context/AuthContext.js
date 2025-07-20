// frontend/context/AuthContext.js
// Import React and createContext to create a context for authentication
import React, { createContext, useState } from 'react';

// Create the AuthContext object
export const AuthContext = createContext();

// Create a provider component to wrap the app and provide auth state
export const AuthProvider = ({ children }) => {
  // Placeholder for user token (JWT or similar)
  const [userToken, setUserToken] = useState(null);

  // You can add more auth-related state and functions here (e.g., user info, login/logout)

  return (
    // The value prop contains everything you want to expose to context consumers
    <AuthContext.Provider value={{ userToken, setUserToken }}>
      {children}
    </AuthContext.Provider>
  );
};
