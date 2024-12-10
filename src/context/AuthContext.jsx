// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";

// Create AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state

  const login = (userData) => setUser(userData);  // Login function
  const logout = () => setUser(null);  // Logout function

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
