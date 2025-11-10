import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, handleAPIError } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  sendOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and get user data
      authAPI.getMe()
        .then((response) => {
          const userData = response.user;
          setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            isAdmin: userData.isAdmin,
          });
        })
        .catch(() => {
          // Invalid token, clear it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const sendOtp = async (email: string) => {
    try {
      setError(null);
      await authAPI.sendOtp(email);
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const verifyOtp = async (email: string, otp: string) => {
    try {
      setError(null);
      const response = await authAPI.verifyOtp(email, otp);
      
      // Store token
      localStorage.setItem('token', response.token);
      
      // Set user data
      const userData = response.user;
      const userObj: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        isAdmin: userData.isAdmin,
      };
      
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint with JWT token (automatically added by interceptor)
      await authAPI.logout();
    } catch (error) {
      // Ignore errors on logout - still clear local state
      console.error('Logout API error:', error);
    } finally {
      // Always clear local state regardless of API response
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, sendOtp, verifyOtp, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
