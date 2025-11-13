import { useState, useEffect } from 'react';

export const useSearch = (users, inactiveUsers, activeTab) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const currentList = activeTab === 'active' ? users : inactiveUsers;
    
    if (searchTerm.trim() === '') {
      setFilteredUsers(currentList);
    } else {
      const filtered = currentList.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users, inactiveUsers, activeTab]);

  return {
    searchTerm,
    setSearchTerm,
    filteredUsers,
  };
};