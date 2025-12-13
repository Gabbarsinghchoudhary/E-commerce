import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminAPI, handleAPIError } from '../services/api';

interface Admin {
  email: string;
  addedBy?: string;
  dateAdded: string;
}

interface AdminContextType {
  adminEmails: Admin[];
  addAdmin: (email: string) => Promise<void>;
  removeAdmin: (email: string) => Promise<void>;
  isAdmin: (email: string) => boolean;
  loading: boolean;
  error: string | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [adminEmails, setAdminEmails] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch admin list if user is logged in
    // Token is now in httpOnly cookie, check user data instead
    const userData = localStorage.getItem('user');
    if (userData) {
      fetchAdmins();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAdmins = async () => {
    // Token is automatically sent via httpOnly cookie
    try {
      setLoading(true);
      const response = await adminAPI.getAllAdmins();
      const admins = response.admins.map((admin) => ({
        email: admin.email,
        dateAdded: admin.dateAdded ? new Date(admin.dateAdded).toISOString().split('T')[0] : 'N/A',
      }));
      setAdminEmails(admins);
      setError(null);
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      // Fallback to empty array on error
      setAdminEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const addAdmin = async (email: string) => {
    try {
      setError(null);
      await adminAPI.addAdmin(email);
      // Refresh admin list
      await fetchAdmins();
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const removeAdmin = async (email: string) => {
    // Prevent removing the default admin
    if (email.toLowerCase() === 'jatinnikumbh7@gmail.com') {
      throw new Error('Cannot remove the default admin');
    }

    try {
      setError(null);
      await adminAPI.removeAdmin(email);
      // Refresh admin list
      await fetchAdmins();
    } catch (err) {
      const errorMessage = handleAPIError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const isAdmin = (email: string): boolean => {
    return adminEmails.some(admin => admin.email.toLowerCase() === email.toLowerCase());
  };

  return (
    <AdminContext.Provider value={{ adminEmails, addAdmin, removeAdmin, isAdmin, loading, error }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};