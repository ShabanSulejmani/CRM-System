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
    const checkExistingLogin = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // Add logo path based on company
          const enhancedUser = {
            ...parsedUser,
            companyLogo: getCompanyLogoPath(parsedUser.company)
          };
          
          setUser(enhancedUser);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Failed to restore user session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkExistingLogin();
  }, []);
  
  // Helper function to get logo path based on company
  const getCompanyLogoPath = (company) => {
    switch(company) {
      case 'fordon':
        return '/img/company-logos/fordon.jpeg';
      case 'tele':
        return '/img/company-logos/tele.jpeg';
      case 'forsakring':
        return '/img/company-logos/forsakring.jpeg';
      default:
        return null;
    }
  };
  
  // Login function
  const login = async (userData) => {
    try {
      // Add the logo path to the user data
      const enhancedUserData = {
        ...userData,
        companyLogo: getCompanyLogoPath(userData.company)
      };
      
      setUser(enhancedUserData);
      setIsLoggedIn(true);
      localStorage.setItem('user', JSON.stringify(enhancedUserData));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      // Clear user data
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('user');
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false };
    }
  };
  
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