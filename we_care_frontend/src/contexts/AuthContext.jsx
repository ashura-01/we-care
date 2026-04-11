import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authController } from '../api/authController';
import api from '../api/api';

// FIX 1: We must EXPORT the context so useAuth.js can see it
export const AuthContext = createContext(undefined);

// FIX 2: We must EXPORT useAuth so NavBar.jsx can see it
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const clearAuthData = useCallback(() => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get('/profile');

      if (response.data?.success && response.data?.user) {
        const userData = response.data.user;
        const isDoctor = !!response.data.doctor;
        
        setUser({
          ...userData,
          isDoctor,
          photoURL: response.data.doctor?.profileImage || userData.photoURL || null,
          role: isDoctor
            ? 'doctor'
            : ['admin', 'super_admin'].includes(userData?.role) 
              ? userData.role
              : localStorage.getItem('userRole') || 'patient',
        });
      } else {
        clearAuthData();
      }
    } catch (error) {
      // Only log out if it's a 401 Unauthorized, not a random server lag
      if (error.response?.status === 401) {
        clearAuthData();
      }
    } finally {
      setLoading(false);
    }
  }, [clearAuthData]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loginUser = async (incomingData) => {
    try {
      const response = await api.get('/profile');
      if (response.data?.success && response.data?.user) {
        const userData = response.data.user;
        const isDoctor = !!response.data.doctor;
        setUser({
          ...userData,
          isDoctor,
          photoURL: response.data.doctor?.profileImage || userData.photoURL || null,
          role: isDoctor
            ? 'doctor'
            : ['admin', 'super_admin'].includes(userData?.role)
              ? userData.role
              : localStorage.getItem('userRole') || 'patient',
        });
      }
    } catch {
      const isDoctor = incomingData?.isDoctor || localStorage.getItem('userRole') === 'doctor';
      setUser({
        ...incomingData,
        isDoctor,
        role: isDoctor ? 'doctor' : incomingData?.role || 'patient',
      });
    }
  };

  const logoutUser = async () => {
    try {
      await authController.logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      clearAuthData();
    }
  };

  const value = {
    user,
    loginUser,
    logoutUser,
    loading,
    refreshAuth: checkAuth 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};