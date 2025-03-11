// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // State for user, login status, and loading state
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Check for existing login on mount
  useEffect(() => {
    const checkExistingLogin = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsLoggedIn(true);
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    
    checkExistingLogin();
  }, []);
  
  // Login function - stores user in state and localStorage
  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  
  // Logout function - clears backend session and local state
  const logout = async () => {
    try {
      console.log("Logging out user on server...");
      
      // Call backend logout endpoint to clear session
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', // Important: Include cookies for session
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to logout on server: ${errorData.message || response.statusText}`);
      }
      
      console.log('Server session cleared successfully');
    } catch (error) {
      console.error('Error logging out from server:', error);
    } finally {
      // Even if server logout fails, clear local state
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('user');
      console.log('Local user state cleared');
    }
  };
  
  // Provide the context values to components
  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn, 
      loading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;