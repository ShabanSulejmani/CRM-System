import { createContext, useState, useContext, useEffect } from 'react';

// Skapa en kontext för autentisering
const AuthContext = createContext();

// Skapa en provider-komponent
export function AuthProvider({ children }) {
  // Kontrollera om användaren redan är inloggad från föregående session
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // Funktion för att hantera inloggning
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  
  // Funktion för att hantera utloggning
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  // Kontextvärde som ska tillhandahållas
  const value = {
    user,
    login,
    logout,
    isLoggedIn: !!user
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Egen hook för att använda auth-kontexten
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth måste användas inom en AuthProvider');
  }
  return context;
}