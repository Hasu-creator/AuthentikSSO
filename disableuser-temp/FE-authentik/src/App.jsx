import React, { useState, useEffect } from 'react';
import { Users, Ban, AlertCircle } from 'lucide-react';

// Components
import Header from './components/Header';
import Notification from './components/Notification';
import SearchBar from './components/SearchBar';
import UserTable from './components/UserTable';
import InactiveUserTable from './components/InactiveUserTable';
import ConfirmDisableModal from './components/ConfirmDisableModal';
import ConfirmActivateModal from './components/ConfirmActivateModal';
import EditUserModal from './components/EditUserModal';
import AuditHistory from './components/AuditHistory';
import ScrollToTop from './components/ScrollToTop';

// Custom Hooks
import { useUsers } from './hooks/useUsers';
import { useSearch } from './hooks/useSearch';
import { useModals } from './hooks/useModals';
import { useNotification } from './hooks/useNotification';

// Handlers
import { handleDisableUser, handleActivateUser, handleEditUser } from './handlers/userActionsHandler';
import { handleExportAuditJSON, handleExportAuditCSV } from './handlers/exportHandlers';

// Services
import { historyService, auditService } from './services';

import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('active');
  const [history, setHistory] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Custom hooks
  const { 
    users, 
    setUsers, 
    inactiveUsers, 
    setInactiveUsers, 
    loading, 
    error, 
    fetchAllData 
  } = useUsers();
  
  const { searchTerm, setSearchTerm, filteredUsers } = useSearch(users, inactiveUsers, activeTab);
  
  const { 
    showDisableModal, 
    showActivateModal, 
    showEditModal, 
    selectedUser, 
    isProcessing, 
    setIsProcessing,
    openDisableModal, 
    openActivateModal, 
    openEditModal, 
    closeAllModals 
  } = useModals();
  
  const { notification, showNotification, closeNotification } = useNotification();

  // Load initial data
  useEffect(() => {
    loadHistory();
    loadAuditLogs();
  }, []);

  // Show error notification
  useEffect(() => {
    if (error) {
      showNotification('error', error);
    }
  }, [error, showNotification]);

  const loadHistory = () => {
    const historyData = historyService.getHistory();
    setHistory(historyData);
  };

  const loadAuditLogs = () => {
    const logs = auditService.getAuditLogs();
    setAuditLogs(logs);
  };

  // Handler wrappers
  const onConfirmDisable = (data) => {
    handleDisableUser({
      data,
      selectedUser,
      setIsProcessing,
      showNotification,
      setHistory,
      setAuditLogs,
      setUsers,
      setInactiveUsers,
      closeModal: closeAllModals,
    });
  };

  const onConfirmActivate = (data) => {
    handleActivateUser({
      data,
      selectedUser,
      setIsProcessing,
      showNotification,
      setHistory,
      setAuditLogs,
      setUsers,
      setInactiveUsers,
      closeModal: closeAllModals,
    });
  };

  const onConfirmEdit = (data) => {
    handleEditUser({
      data,
      selectedUser,
      activeTab,
      setIsProcessing,
      showNotification,
      setAuditLogs,
      setUsers,
      setInactiveUsers,
      closeModal: closeAllModals,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Header 
          onRefresh={fetchAllData} 
          loading={loading}
          userCount={activeTab === 'active' ? users.length : inactiveUsers.length}
        />
        
        {/* Notification */}
        <Notification 
          type={notification?.type} 
          message={notification?.message}
          onClose={closeNotification}
        />
        
        {/* Audit History */}
        <AuditHistory 
          auditLogs={auditLogs}
          onExportJSON={() => handleExportAuditJSON(showNotification)}
          onExportCSV={() => handleExportAuditCSV(showNotification)}
        />

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-1 mb-6 border border-gray-200">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Users size={18} />
              Tài khoản hoạt động
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                activeTab === 'active' ? 'bg-white bg-opacity-20' : 'bg-slate-200'
              }`}>
                {users.length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('inactive')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === 'inactive'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Ban size={18} />
              Tài khoản vô hiệu hóa
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                activeTab === 'inactive' ? 'bg-white bg-opacity-20' : 'bg-slate-200'
              }`}>
                {inactiveUsers.length}
              </span>
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalUsers={activeTab === 'active' ? users.length : inactiveUsers.length}
          filteredCount={filteredUsers.length}
        />
        
        {/* User Tables */}
        {activeTab === 'active' ? (
          <UserTable 
            users={filteredUsers}
            loading={loading}
            onDisableClick={openDisableModal}
            onEditClick={openEditModal}
            searchTerm={searchTerm}
          />
        ) : (
          <InactiveUserTable 
            users={filteredUsers}
            loading={loading}
            onActivateClick={openActivateModal}
            onEditClick={openEditModal}
            searchTerm={searchTerm}
          />
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-block bg-white rounded-xl shadow-lg border-2 border-slate-200 px-6 py-4 max-w-3xl">
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-2.5 rounded-xl flex-shrink-0 shadow-md" style={{ boxShadow: '0 4px 12px rgba(245, 158, 11, 0.35)' }}>
                <AlertCircle className="text-white" size={22} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900 mb-1.5 text-base">Lưu ý quan trọng</p>
                <p className="text-slate-700 text-sm leading-relaxed font-medium">
                  {activeTab === 'active' 
                    ? 'Chỉ vô hiệu hóa tài khoản khi nhân viên đã hoàn tất đầy đủ thủ tục nghỉ việc và bàn giao công việc.'
                    : 'Chỉ kích hoạt lại tài khoản khi nhân viên quay lại làm việc và được phê duyệt bởi quản lý.'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-slate-600 text-xs mt-5 font-semibold">
            © 2025 Hệ thống quản lý tài khoản - Phòng Nhân sự
          </p>
        </div>
      </div>
      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Modals */}
      {showDisableModal && selectedUser && (
        <ConfirmDisableModal
          user={selectedUser}
          onConfirm={onConfirmDisable}
          onCancel={closeAllModals}
          isProcessing={isProcessing}
        />
      )}

      {showActivateModal && selectedUser && (
        <ConfirmActivateModal
          user={selectedUser}
          onConfirm={onConfirmActivate}
          onCancel={closeAllModals}
          isProcessing={isProcessing}
        />
      )}

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onConfirm={onConfirmEdit}
          onCancel={closeAllModals}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}

export default App;