import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authController } from '../api/authController';
import api from '../api/api';

export const AuthContext = createContext(undefined);

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
  const location = useLocation();

  const isPublicPage = 
    location.pathname.startsWith('/login') || 
    location.pathname.startsWith('/signup') || 
    location.pathname.startsWith('/blogs') ||
    location.pathname === '/'; 

  const clearAuthData = useCallback(() => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    setUser(null);

    if (!isPublicPage) {
      navigate('/login');
    }
  }, [navigate, isPublicPage]);

  const checkAuth = useCallback(async () => {
    if (isPublicPage && !user) { 
      setLoading(false);
      return;
    }

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
      if (error.response?.status === 401) {
        clearAuthData();
      }
    } finally {
      setLoading(false);
    }
  }, [clearAuthData, isPublicPage]); 

  useEffect(() => {
    checkAuth();

    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 && !isPublicPage) {
          clearAuthData();
        }
        return Promise.reject(error);
      }
    );

    const handleFocus = () => {
      if (!isPublicPage) {
         checkAuth();
      }
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      api.interceptors.response.eject(interceptor);
      window.removeEventListener('focus', handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkAuth, isPublicPage]); 

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
          role: isDoctor ? 'doctor' : (userData.role || 'patient'),
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
    } finally {
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      setUser(null);
      navigate('/login');
    }
  };

  const value = { user, loginUser, logoutUser, loading, refreshAuth: checkAuth };

  return (
    <AuthContext.Provider value={value}>
      {loading && !isPublicPage ? (
        <div className="flex h-screen items-center justify-center">Loading...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};