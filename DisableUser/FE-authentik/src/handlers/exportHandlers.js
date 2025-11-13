import { historyService } from '../services';
import { auditService } from '../services';


export const handleExportHistory = (showNotification) => {
  historyService.exportHistory();
  showNotification('success', 'Đã xuất lịch sử thành công. Kiểm tra file tải về.');
};

export const handleExportAuditJSON = (showNotification) => {
  const success = auditService.exportAuditLogs();
  if (success) {
    showNotification('success', 'Đã xuất Audit Log (JSON) thành công. Kiểm tra file tải về.');
  } else {
    showNotification('error', 'Không thể xuất Audit Log.');
  }
};

export const handleExportAuditCSV = (showNotification) => {
  const success = auditService.exportAuditLogsCSV();
  if (success) {
    showNotification('success', 'Đã xuất Audit Log (CSV) thành công. Kiểm tra file tải về.');
  } else {
    showNotification('error', 'Không thể xuất Audit Log.');
  }
};