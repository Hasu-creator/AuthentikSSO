import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('authentik_username');
    
    if (savedUser) {
      fetchUserInfo(savedUser);
    } else {
      fetchUserInfo('admin');
    }
  }, []);

  const fetchUserInfo = async (username) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/whoami', {
        headers: {
          'X-User': username
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    return currentUser.permissions.includes(permission);
  };

  const canModifyUser = (targetUsername) => {
    if (!currentUser) return false;

    if (currentUser.role === 'superadmin') return true;

    if (targetUsername === currentUser.username) return false;

    const adminUsers = ['admin', 'akadmin'];
    if (adminUsers.includes(targetUsername.toLowerCase())) {
      return currentUser.role === 'superadmin';
    }
    
    return true;
  };

  const login = (username) => {
    localStorage.setItem('authentik_username', username);
    fetchUserInfo(username);
  };

  const logout = () => {
    localStorage.removeItem('authentik_username');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    hasPermission,
    canModifyUser,
    login,
    logout
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};