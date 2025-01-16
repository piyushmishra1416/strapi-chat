import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: number | null;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  showLogin: boolean;
  setShowLogin: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwt'));
  const [userId, setUserId] = useState<number | null>(null);
  const [showLogin, setShowLogin] = useState(true);

  const login = async (identifier: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/local`, {
        identifier,
        password,
      });

      localStorage.setItem('jwt', response.data.jwt);
      setUserId(response.data.user.id);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/local/register`, {
        username,
        email,
        password,
      });

      localStorage.setItem('jwt', response.data.jwt);
      setUserId(response.data.user.id);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    delete axios.defaults.headers.common['Authorization'];
    setUserId(null);
    setIsAuthenticated(false);
    setShowLogin(true);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userId, 
      login, 
      signup, 
      logout,
      showLogin,
      setShowLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 