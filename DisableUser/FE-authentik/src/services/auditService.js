const AUDIT_STORAGE_KEY = 'user_audit_logs';
const MAX_AUDIT_LOGS = 1000; 

export const auditService = {
  // Lấy tất cả audit logs
  getAuditLogs: () => {
    try {
      const logs = localStorage.getItem(AUDIT_STORAGE_KEY);
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Error reading audit logs:', error);
      return [];
    }
  },

  // Thêm audit log mới
  addAuditLog: (logEntry) => {
    try {
      const logs = auditService.getAuditLogs();
      
      const newLog = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        ...logEntry
      };
      
      // Thêm log mới vào đầu array
      logs.unshift(newLog);
      
      // Giới hạn số lượng logs
      const trimmedLogs = logs.slice(0, MAX_AUDIT_LOGS);
      
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(trimmedLogs));
      
      console.log('✅ Audit log added:', newLog);
      return trimmedLogs;
    } catch (error) {
      console.error('Error adding audit log:', error);
      return auditService.getAuditLogs();
    }
  },

  // Log khi disable user
  logDisableUser: (userData) => {
    return auditService.addAuditLog({
      action: 'DISABLE_USER',
      actionType: 'user_management',
      severity: 'high',
      username: userData.username,
      userDisplayName: userData.name,
      email: userData.email,
      reason: userData.reason || 'N/A',
      resignDate: userData.resignDate,
      note: userData.note || '',
      performedBy: 'current_admin',
      details: {
        message: `Vô hiệu hóa tài khoản ${userData.username}`,
        reason: userData.reason,
        resignDate: userData.resignDate
      }
    });
  },

  // Log khi activate user
  logActivateUser: (userData) => {
    return auditService.addAuditLog({
      action: 'ACTIVATE_USER',
      actionType: 'user_management',
      severity: 'medium',
      username: userData.username,
      userDisplayName: userData.name,
      email: userData.email,
      note: userData.note || '',
      performedBy: 'current_admin',
      details: {
        message: `Kích hoạt lại tài khoản ${userData.username}`,
        activatedAt: userData.activatedAt
      }
    });
  },

  // ⭐ NEW: Log khi edit user với TẤT CẢ thay đổi (bao gồm cả username)
  logEditUserCombined: (originalData, updatedData, options = {}) => {
    const changes = [];
    let hasUsernameChange = false;
    let severity = 'low';
    
    // Kiểm tra username change
    if (updatedData.username && originalData.username !== updatedData.username) {
      changes.push({
        field: 'username',
        label: 'Username',
        oldValue: originalData.username,
        newValue: updatedData.username,
        critical: true
      });
      hasUsernameChange = true;
      severity = 'critical';
    }
    
    // Kiểm tra name change
    if (originalData.name !== updatedData.name) {
      changes.push({
        field: 'name',
        label: 'Họ tên',
        oldValue: originalData.name,
        newValue: updatedData.name,
        critical: false
      });
      if (severity === 'low') severity = 'medium';
    }
    
    // Kiểm tra email change
    if (originalData.email !== updatedData.email) {
      changes.push({
        field: 'email',
        label: 'Email',
        oldValue: originalData.email,
        newValue: updatedData.email,
        critical: false
      });
      if (severity === 'low') severity = 'medium';
    }

    // Tạo message tổng hợp
    let message = `Chỉnh sửa thông tin tài khoản`;
    if (hasUsernameChange) {
      message = `⚠️ ĐỔI USERNAME và cập nhật thông tin tài khoản`;
    }

    return auditService.addAuditLog({
      action: hasUsernameChange ? 'CHANGE_USERNAME_AND_INFO' : 'EDIT_USER',
      actionType: 'user_management',
      severity: severity,
      username: originalData.username,
      newUsername: hasUsernameChange ? updatedData.username : undefined,
      userDisplayName: originalData.name,
      email: originalData.email,
      performedBy: 'current_admin',
      securityImpact: hasUsernameChange,
      changes: changes,
      details: {
        message: message,
        changesCount: changes.length,
        hasUsernameChange: hasUsernameChange,
        oldUsername: originalData.username,
        newUsername: hasUsernameChange ? updatedData.username : undefined,
        sessionsKept: hasUsernameChange ? options.sessionsKept : undefined,
        warning: hasUsernameChange ? 'Username đã thay đổi' : undefined
      }
    });
  },

  // OLD: Log khi edit user (không đổi username) - Giữ lại để backward compatible
  logEditUser: (originalData, updatedData) => {
    return auditService.logEditUserCombined(originalData, updatedData, {});
  },

  // OLD: Log khi đổi username (CRITICAL) - Giữ lại để backward compatible
  logUsernameChange: (originalUsername, newUsername, userData) => {
    return auditService.logEditUserCombined(
      {
        username: originalUsername,
        name: userData.name,
        email: userData.email
      },
      {
        username: newUsername,
        name: userData.name,
        email: userData.email
      },
      { sessionsKept: true }
    );
  },

  getLogsByAction: (action) => {
    const logs = auditService.getAuditLogs();
    return logs.filter(log => log.action === action);
  },

  getLogsByUsername: (username) => {
    const logs = auditService.getAuditLogs();
    return logs.filter(log => 
      log.username === username || log.newUsername === username
    );
  },

  getLogsBySeverity: (severity) => {
    const logs = auditService.getAuditLogs();
    return logs.filter(log => log.severity === severity);
  },

  getCriticalLogs: () => {
    return auditService.getLogsBySeverity('critical');
  },

  // Export audit logs to JSON
  exportAuditLogs: () => {
    try {
      const logs = auditService.getAuditLogs();
      const dataStr = JSON.stringify(logs, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('✅ Audit logs exported successfully');
      return true;
    } catch (error) {
      console.error('Error exporting audit logs:', error);
      return false;
    }
  },

  // Export audit logs to CSV
  exportAuditLogsCSV: () => {
    try {
      const logs = auditService.getAuditLogs();
      
      // CSV headers
      const headers = ['Timestamp', 'Action', 'Severity', 'Username', 'New Username', 'Email', 'Performed By', 'Details'];
      
      // Convert logs to CSV rows
      const rows = logs.map(log => [
        new Date(log.timestamp).toLocaleString('vi-VN'),
        log.action,
        log.severity,
        log.username || '',
        log.newUsername || '',
        log.email || '',
        log.performedBy || '',
        JSON.stringify(log.details || {})
      ]);
      
      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      // Create and download
      const dataBlob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('✅ Audit logs CSV exported successfully');
      return true;
    } catch (error) {
      console.error('Error exporting audit logs CSV:', error);
      return false;
    }
  },

  // Clear all audit logs (admin only)
  clearAuditLogs: () => {
    try {
      localStorage.removeItem(AUDIT_STORAGE_KEY);
      console.log('⚠️ All audit logs cleared');
      return true;
    } catch (error) {
      console.error('Error clearing audit logs:', error);
      return false;
    }
  },

  // Get statistics
  getStatistics: () => {
    const logs = auditService.getAuditLogs();
    
    return {
      total: logs.length,
      byAction: {
        disableUser: logs.filter(l => l.action === 'DISABLE_USER').length,
        activateUser: logs.filter(l => l.action === 'ACTIVATE_USER').length,
        editUser: logs.filter(l => l.action === 'EDIT_USER').length,
        changeUsername: logs.filter(l => l.action === 'CHANGE_USERNAME' || l.action === 'CHANGE_USERNAME_AND_INFO').length,
      },
      bySeverity: {
        critical: logs.filter(l => l.severity === 'critical').length,
        high: logs.filter(l => l.severity === 'high').length,
        medium: logs.filter(l => l.severity === 'medium').length,
        low: logs.filter(l => l.severity === 'low').length,
      },
      recentActivity: logs.slice(0, 10)
    };
  }
};