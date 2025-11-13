import React, { useState } from 'react';
import { Clock, Calendar, FileText, User, Download, Ban, CheckCircle, Edit, ArrowRight, AlertTriangle, Filter, ChevronDown, ChevronUp, Shield } from 'lucide-react';

export default function AuditHistory({ auditLogs, onExportJSON, onExportCSV }) {
  const [filterAction, setFilterAction] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);

  if (!auditLogs || auditLogs.length === 0) return null;

  const filteredLogs = auditLogs.filter(log => {
    if (filterAction !== 'all' && log.action !== filterAction) return false;
    if (filterSeverity !== 'all' && log.severity !== filterSeverity) return false;
    return true;
  });

  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.split(' ').filter(w => w.length > 0);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const getActionBadge = (log) => {
    const badges = {
      'DISABLE_USER': { bg: 'bg-gradient-to-r from-red-100 to-red-50', text: 'text-red-700', label: 'Vô hiệu hóa', border: 'border-red-200' },
      'ACTIVATE_USER': { bg: 'bg-gradient-to-r from-emerald-100 to-emerald-50', text: 'text-emerald-700', label: 'Kích hoạt', border: 'border-emerald-200' },
      'EDIT_USER': { bg: 'bg-gradient-to-r from-blue-100 to-blue-50', text: 'text-blue-700', label: 'Chỉnh sửa', border: 'border-blue-200' },
      'CHANGE_USERNAME': { bg: 'bg-gradient-to-r from-amber-100 to-amber-50', text: 'text-amber-700', label: 'Đổi Username', border: 'border-amber-200' },
      'CHANGE_USERNAME_AND_INFO': { bg: 'bg-gradient-to-r from-purple-100 to-purple-50', text: 'text-purple-700', label: 'Đổi Username + Info', border: 'border-purple-200' }
    };

    const badge = badges[log.action] || { bg: 'bg-slate-100', text: 'text-slate-700', label: log.action, border: 'border-slate-200' };
    
    return (
      <div className="flex items-center gap-2">
        <span className={`${badge.bg} ${badge.text} ${badge.border} text-xs px-3 py-1 rounded-lg font-bold border`}>
          {badge.label}
        </span>
        {log.severity === 'critical' && (
          <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs px-3 py-1 rounded-lg font-bold flex items-center gap-1 shadow-md" style={{ boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)' }}>
            <AlertTriangle size={12} strokeWidth={3} />
            CRITICAL
          </span>
        )}
      </div>
    );
  };

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'text-red-600 font-bold',
      high: 'text-orange-600 font-bold',
      medium: 'text-amber-600 font-semibold',
      low: 'text-emerald-600 font-semibold'
    };
    return colors[severity] || 'text-slate-600';
  };

  const renderCombinedChanges = (log) => {
    if (!log.changes || log.changes.length === 0) return null;

    const hasUsernameChange = log.changes.some(c => c.field === 'username');

    return (
      <div className={`${
        hasUsernameChange 
          ? 'bg-gradient-to-r from-purple-50 to-purple-50/50 border-purple-300' 
          : 'bg-gradient-to-r from-blue-50 to-blue-50/50 border-blue-300'
      } border-2 rounded-xl p-4 shadow-sm`}>
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-2 rounded-lg ${
            hasUsernameChange ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'
          }`} style={{
            boxShadow: hasUsernameChange 
              ? '0 4px 12px rgba(168, 85, 247, 0.3)' 
              : '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            {hasUsernameChange ? (
              <Shield className="text-white" size={16} strokeWidth={2.5} />
            ) : (
              <Edit className="text-white" size={16} strokeWidth={2.5} />
            )}
          </div>
          <p className={`font-bold text-sm ${
            hasUsernameChange ? 'text-purple-900' : 'text-blue-900'
          }`}>
            {hasUsernameChange ? 'Thay đổi thông tin (bao gồm Username)' : 'Thay đổi thông tin'}
          </p>
        </div>
        
        <div className="space-y-2">
          {log.changes.map((change, idx) => {
            const isCritical = change.critical || change.field === 'username';
            
            return (
              <div 
                key={idx} 
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  isCritical 
                    ? 'bg-red-50 border-2 border-red-200' 
                    : 'bg-white border-2 border-slate-200'
                }`}
              >
                <div className={`min-w-[90px] text-sm font-bold ${
                  isCritical ? 'text-red-700' : 'text-slate-800'
                }`}>
                  {change.label || change.field}:
                </div>
                
                <code className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold line-through ${
                  isCritical ? 'bg-red-100 text-red-900 border border-red-200' : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {change.oldValue}
                </code>
                
                <ArrowRight size={16} className="text-slate-400" strokeWidth={2.5} />
                
                <code className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold ${
                  isCritical ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white' : 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white'
                }`} style={{
                  boxShadow: isCritical 
                    ? '0 2px 8px rgba(168, 85, 247, 0.3)' 
                    : '0 2px 8px rgba(16, 185, 129, 0.3)'
                }}>
                  {change.newValue}
                </code>
              </div>
            );
          })}
        </div>
        
        {hasUsernameChange && (
          <div className="mt-3 bg-gradient-to-r from-emerald-50 to-emerald-50/50 border-2 border-emerald-300 rounded-lg p-3">
            <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
              <CheckCircle size={13} strokeWidth={2.5} />
              Sessions được giữ nguyên - User không bị logout
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-slate-200 mb-6">
      {/* Header */}
      <div 
        className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 cursor-pointer hover:from-slate-700 hover:to-slate-800 transition-all duration-300"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ boxShadow: '0 4px 12px rgba(30, 41, 59, 0.3)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 text-white px-2 py-2 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-bold border-2 border-white/20" style={{ boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>
              <Clock className="text-white" size={22} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Lịch sử Audit Log</h2>
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-lg font-bold border border-white/30">
                  {filteredLogs.length}
                </span>
              </div>
              <p className="text-slate-300 text-sm mt-0.5 font-medium">
                Click để {isExpanded ? 'thu gọn' : 'mở rộng'}
              </p>
            </div>
          </div>

          <button
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronUp className="text-white" size={22} strokeWidth={2.5} />
            ) : (
              <ChevronDown className="text-white" size={22} strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <>
          {/* Filters & Export */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-50/50 border-b-2 border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Filters */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                  <Filter size={18} strokeWidth={2.5} />
                  <span>Lọc:</span>
                </div>
                
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="px-4 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-sm text-slate-800 font-semibold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                >
                  <option value="all">Tất cả hành động</option>
                  <option value="DISABLE_USER">Vô hiệu hóa</option>
                  <option value="ACTIVATE_USER">Kích hoạt</option>
                  <option value="EDIT_USER">Chỉnh sửa</option>
                  <option value="CHANGE_USERNAME">Đổi username</option>
                  <option value="CHANGE_USERNAME_AND_INFO">Đổi username + info</option>
                </select>
                
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-4 py-2.5 bg-white border-2 border-slate-300 rounded-xl text-sm text-slate-800 font-semibold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                >
                  <option value="all">Tất cả mức độ</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* Export Buttons */}
              <div className="flex items-center gap-2">
                {onExportJSON && (
                  <button
                    onClick={onExportJSON}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 text-sm font-bold shadow-md hover:shadow-lg border border-blue-500/20"
                    style={{ boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
                  >
                    <Download size={16} strokeWidth={2.5} />
                    JSON
                  </button>
                )}
                {onExportCSV && (
                  <button
                    onClick={onExportCSV}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl transition-all duration-200 text-sm font-bold shadow-md hover:shadow-lg border border-emerald-500/20"
                    style={{ boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
                  >
                    <Download size={16} strokeWidth={2.5} />
                    CSV
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-50/50">
            <div className="space-y-4">
              {filteredLogs.slice(0, 10).map((log) => (
                <div 
                  key={log.id} 
                  className="bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      {/* User info */}
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center text-slate-800 font-bold text-sm shadow-md">
                          {getInitials(log.userDisplayName || log.username)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-bold text-slate-900">{log.userDisplayName || log.username}</span>
                            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-mono font-semibold border border-slate-200">
                              {log.username}
                            </span>
                            {getActionBadge(log)}
                          </div>
                          <p className="text-sm text-slate-700 font-medium">{log.email}</p>
                        </div>
                      </div>

                      {/* Combined Changes */}
                      {(log.action === 'EDIT_USER' || log.action === 'CHANGE_USERNAME' || log.action === 'CHANGE_USERNAME_AND_INFO') && renderCombinedChanges(log)}

                      {/* Disable Details */}
                      {log.action === 'DISABLE_USER' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {log.reason && (
                            <div className="flex items-start gap-2 bg-slate-50 border-2 border-slate-200 rounded-xl p-3">
                              <FileText className="text-slate-600 flex-shrink-0 mt-0.5" size={16} strokeWidth={2.5} />
                              <div>
                                <p className="text-slate-700 text-xs font-bold mb-1">Lý do</p>
                                <p className="text-slate-900 text-sm font-medium">{log.reason}</p>
                              </div>
                            </div>
                          )}
                          
                          {log.resignDate && (
                            <div className="flex items-start gap-2 bg-slate-50 border-2 border-slate-200 rounded-xl p-3">
                              <Calendar className="text-slate-600 flex-shrink-0 mt-0.5" size={16} strokeWidth={2.5} />
                              <div>
                                <p className="text-slate-700 text-xs font-bold mb-1">Ngày nghỉ việc</p>
                                <p className="text-slate-900 text-sm font-medium">
                                  {new Date(log.resignDate).toLocaleDateString('vi-VN')}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Note */}
                      {log.note && (
                        <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 border-2 border-blue-300 rounded-xl p-3">
                          <p className="text-xs text-blue-800 font-bold mb-1 flex items-center gap-1">
                            <FileText size={12} strokeWidth={2.5} />
                            Ghi chú:
                          </p>
                          <p className="text-sm text-slate-800 font-medium">{log.note}</p>
                        </div>
                      )}

                      {/* Performed By */}
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <User size={13} strokeWidth={2.5} />
                        <span>Thực hiện bởi: <span className="font-bold text-slate-800">{log.performedBy || 'System'}</span></span>
                        <span className={`ml-2 font-bold ${getSeverityColor(log.severity)}`}>
                          [{log.severity?.toUpperCase()}]
                        </span>
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
                        <Calendar size={13} className="text-slate-600" strokeWidth={2.5} />
                        <span className="text-xs font-bold text-slate-800">
                          {new Date(log.timestamp).toLocaleDateString('vi-VN', { 
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200">
                        <Clock size={13} className="text-blue-600" strokeWidth={2.5} />
                        <span className="text-xs font-bold text-blue-800">
                          {new Date(log.timestamp).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredLogs.length > 10 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-700 font-semibold">
                  Hiển thị 10 trong số {filteredLogs.length} hoạt động
                </p>
              </div>
            )}

            {filteredLogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-700 font-semibold">Không có log nào phù hợp với bộ lọc</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}