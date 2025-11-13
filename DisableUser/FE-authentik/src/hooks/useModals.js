import { useState } from 'react';

/**
 * Custom hook để quản lý các modals
 */
export const useModals = () => {
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const openDisableModal = (user) => {
    setSelectedUser(user);
    setShowDisableModal(true);
  };

  const openActivateModal = (user) => {
    setSelectedUser(user);
    setShowActivateModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const closeAllModals = () => {
    setShowDisableModal(false);
    setShowActivateModal(false);
    setShowEditModal(false);
    setSelectedUser(null);
  };

  return {
    showDisableModal,
    showActivateModal,
    showEditModal,
    selectedUser,
    isProcessing,
    setIsProcessing,
    openDisableModal,
    openActivateModal,
    openEditModal,
    closeAllModals,
  };
};