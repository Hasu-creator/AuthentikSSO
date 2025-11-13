import { userAPI } from '../services';
import { historyService } from '../services';
import { auditService } from '../services';

export const handleDisableUser = async ({
  data,
  selectedUser,
  setIsProcessing,
  showNotification,
  setHistory,
  setAuditLogs,
  setUsers,
  setInactiveUsers,
  closeModal,
}) => {
  setIsProcessing(true);
  try {
    await userAPI.disableUser(data.username);
    
    showNotification(
      'success', 
      `Đã vô hiệu hóa tài khoản "${data.username}" thành công. Nhân viên không thể đăng nhập vào hệ thống.`
    );
    
    const historyRecord = {
      ...selectedUser,
      reason: data.reason,
      note: data.note,
      resignDate: data.resignDate,
      processedAt: data.processedAt,
      action: 'disable'
    };
    
    const updatedHistory = historyService.addDisableRecord(historyRecord);
    setHistory(updatedHistory);
    
    const updatedAuditLogs = auditService.logDisableUser({
      username: data.username,
      name: selectedUser.name,
      email: selectedUser.email,
      reason: data.reason,
      resignDate: data.resignDate,
      note: data.note
    });
    setAuditLogs(updatedAuditLogs);
    

    setUsers(prev => prev.filter(u => u.username !== data.username));
    setInactiveUsers(prev => [...prev, selectedUser]);
    
    closeModal();
  } catch (error) {
    showNotification('error', `Không thể vô hiệu hóa tài khoản: ${error.message}`);
  } finally {
    setIsProcessing(false);
  }
};

export const handleActivateUser = async ({
  data,
  selectedUser,
  setIsProcessing,
  showNotification,
  setHistory,
  setAuditLogs,
  setUsers,
  setInactiveUsers,
  closeModal,
}) => {
  setIsProcessing(true);
  try {
    await userAPI.activateUser(data.username);
    
    showNotification(
      'success', 
      `Đã kích hoạt lại tài khoản "${data.username}" thành công. Nhân viên có thể đăng nhập vào hệ thống.`
    );
    
    // Lưu vào lịch sử
    const historyRecord = {
      ...selectedUser,
      note: data.note,
      activatedAt: data.activatedAt,
      action: 'activate'
    };
    
    const updatedHistory = historyService.addActivateRecord(historyRecord);
    setHistory(updatedHistory);
    g
    const updatedAuditLogs = auditService.logActivateUser({
      username: data.username,
      name: selectedUser.name,
      email: selectedUser.email,
      note: data.note,
      activatedAt: data.activatedAt
    });
    setAuditLogs(updatedAuditLogs);
    
    setInactiveUsers(prev => prev.filter(u => u.username !== data.username));
    setUsers(prev => [...prev, selectedUser]);
    
    closeModal();
  } catch (error) {
    showNotification('error', `Không thể kích hoạt tài khoản: ${error.message}`);
  } finally {
    setIsProcessing(false);
  }
};


export const handleEditUser = async ({
  data,
  selectedUser,
  activeTab,
  setIsProcessing,
  showNotification,
  setAuditLogs,
  setUsers,
  setInactiveUsers,
  closeModal,
}) => {
  console.log('🔍 DEBUG selectedUser:', selectedUser);
  console.log('🔍 DEBUG data từ form:', data);
  
  setIsProcessing(true);
  try {

    const realOldUsername = selectedUser.name.includes('(') 
      ? selectedUser.name.match(/\(([^)]+)\)/)[1]
      : selectedUser.username;
    
    console.log('✅ Real old username:', realOldUsername);
    
    const originalData = {
      username: realOldUsername,
      name: selectedUser.name.includes('(') 
        ? selectedUser.name.substring(0, selectedUser.name.indexOf('(')).trim()
        : selectedUser.name,
      email: selectedUser.email
    };

    const nameOnly = data.name.includes('(') 
      ? data.name.split('(')[0].trim() 
      : data.name;
    
    const payload = {
      name: nameOnly,
      email: data.email
    };
    
    const isUsernameChanged = data.new_username && 
                              data.new_username.trim() !== '' && 
                              data.new_username !== realOldUsername;
    
    if (isUsernameChanged) {
      payload.new_username = data.new_username;
    }
    
    console.log('📤 Gọi API với:', {
      oldUsername: realOldUsername,
      payload,
      isUsernameChanged
    });
    
    const updatedUser = await userAPI.editUser(realOldUsername, payload);
    
    const finalUsername = isUsernameChanged && data.new_username
      ? data.new_username
      : realOldUsername;
    
    console.log('✅ API response:', {
      updatedUser,
      finalUsername
    });
    
    const updatedData = {
      username: finalUsername, 
      name: updatedUser.name,
      email: updatedUser.email
    };
    
    const updatedAuditLogs = auditService.logEditUserCombined(
      originalData,
      updatedData,
      {
        sessionsKept: isUsernameChanged 
      }
    );
    setAuditLogs(updatedAuditLogs);
    
    const changesList = [];
    if (isUsernameChanged) changesList.push(`Username: ${realOldUsername} → ${finalUsername}`);
    if (originalData.name !== updatedData.name) changesList.push(`Họ tên: ${originalData.name} → ${updatedData.name}`);
    if (originalData.email !== updatedData.email) changesList.push(`Email: ${originalData.email} → ${updatedData.email}`);
    
    if (changesList.length > 0) {
      const changesText = changesList.join(' | ');
      showNotification(
        'success', 
        `✅ Cập nhật thành công! Thay đổi: ${changesText}`
      );
    } else {
      showNotification('success', `Đã cập nhật thông tin tài khoản "${realOldUsername}" thành công.`);
    }
    
    const displayName = `${updatedUser.name} (${finalUsername})`;
    
    if (activeTab === 'active') {
      setUsers(prev => prev.map(u => {
        const uUsername = u.name.includes('(') 
          ? u.name.match(/\(([^)]+)\)/)?.[1]
          : u.username;
        
        return uUsername === realOldUsername 
          ? { 
              ...u, 
              username: finalUsername,
              name: displayName,
              email: updatedUser.email 
            }
          : u;
      }));
    } else {
      setInactiveUsers(prev => prev.map(u => {
        const uUsername = u.name.includes('(') 
          ? u.name.match(/\(([^)]+)\)/)?.[1]
          : u.username;
        
        return uUsername === realOldUsername 
          ? { 
              ...u, 
              username: finalUsername,
              name: displayName,
              email: updatedUser.email 
            }
          : u;
      }));
    }
    
    closeModal();
  } catch (error) {
    showNotification('error', `Không thể cập nhật tài khoản: ${error.message}`);
  } finally {
    setIsProcessing(false);
  }
};