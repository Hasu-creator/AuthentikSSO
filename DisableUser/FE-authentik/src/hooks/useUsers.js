import { useState, useEffect } from 'react';
import { userAPI } from '../services';


export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [activeData, inactiveData] = await Promise.all([
        userAPI.getAllUsers(),
        userAPI.getInactiveUsers()
      ]);
      
      setUsers(activeData);
      setInactiveUsers(inactiveData);
    } catch (err) {
      setError(err.message || 'Không thể kết nối đến server. Vui lòng kiểm tra lại.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    users,
    setUsers,
    inactiveUsers,
    setInactiveUsers,
    loading,
    error,
    fetchAllData
  };
};