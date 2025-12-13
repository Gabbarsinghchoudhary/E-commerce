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
    // Check if user is logged in on mount by calling /me endpoint
    // Token is sent automatically via httpOnly cookie
    authAPI.getMe()
      .then((response) => {
        const userData = response.user;
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          isAdmin: userData.isAdmin,
        });
        // Store user data in localStorage for offline access
        localStorage.setItem('user', JSON.stringify(userData));
      })
      .catch(() => {
        // No valid cookie or session expired
        localStorage.removeItem('user');
      })
      .finally(() => {
        setIsLoading(false);
      });
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
      
      // Token is now stored in httpOnly cookie by backend
      // Just store user data
      const userData = response.user;
      const userObj: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        isAdmin: userData.isAdmin,
      };
      
      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userObj);
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint - cookie will be cleared by backend
      await authAPI.logout();
    } catch (error) {
      // Ignore errors on logout - still clear local state
      console.error('Logout API error:', error);
    } finally {
      // Always clear local state regardless of API response
      setUser(null);
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
