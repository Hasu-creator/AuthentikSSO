import React from 'react';
import { Clock, Calendar, FileText, User, Download, UserX, UserCheck, Ban, CheckCircle } from 'lucide-react';

export default function DisableHistory({ history, onExport }) {
  if (history.length === 0) return null;

  const getActionIcon = (action) => {
    return action === 'disable' ? (
      <Ban className="text-red-600" size={16} />
    ) : (
      <CheckCircle className="text-green-600" size={16} />
    );
  };

  const getActionColor = (action) => {
    return action === 'disable' 
      ? 'from-red-500 to-orange-500' 
      : 'from-green-500 to-emerald-500';
  };

  const getActionBadge = (action) => {
    return action === 'disable' ? (
      <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">
        Vô hiệu hóa
      </span>
    ) : (
      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">
        Kích hoạt lại
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-orange-100 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Clock className="text-orange-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Lịch sử thay đổi tài khoản</h2>
              <p className="text-sm text-gray-600 mt-0.5">{history.length} hoạt động gần đây</p>
            </div>
          </div>
          
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg border border-gray-200 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow"
            >
              <Download size={16} />
              Export
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {history.slice(0, 5).map((record, index) => (
            <div 
              key={index} 
              className="group relative bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-xl p-5 hover:border-indigo-200 hover:shadow-lg transition-all duration-200"
            >
              {/* Timeline dot */}
              <div className={`absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-br ${getActionColor(record.action)} rounded-full border-4 border-white shadow-lg`}>
              </div>
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* User info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                      <User className="text-gray-600" size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-lg">{record.name}</span>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-md font-mono">
                          {record.username}
                        </span>
                        {getActionBadge(record.action)}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{record.email}</p>
                    </div>
                  </div>

                  {/* Details - Chỉ hiển thị cho action disable */}
                  {record.action === 'disable' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-start gap-2">
                        <FileText className="text-indigo-500 flex-shrink-0 mt-0.5" size={16} />
                        <div>
                          <p className="text-gray-500 text-xs">Lý do nghỉ việc</p>
                          <p className="text-gray-900 font-medium">{record.reason}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Calendar className="text-purple-500 flex-shrink-0 mt-0.5" size={16} />
                        <div>
                          <p className="text-gray-500 text-xs">Ngày nghỉ việc</p>
                          <p className="text-gray-900 font-medium">
                            {new Date(record.resignDate).toLocaleDateString('vi-VN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Note */}
                  {record.note && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                      <p className="text-xs text-blue-600 font-semibold mb-1">Ghi chú:</p>
                      <p className="text-sm text-gray-700">{record.note}</p>
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className="flex flex-col items-end gap-2">
                  <div className={`bg-gradient-to-r ${
                    record.action === 'disable' 
                      ? 'from-red-100 to-orange-100' 
                      : 'from-green-100 to-emerald-100'
                  } px-3 py-1 rounded-full`}>
                    <span className={`text-xs font-bold ${
                      record.action === 'disable' ? 'text-red-700' : 'text-green-700'
                    }`}>
                      {new Date(record.actionTime).toLocaleDateString('vi-VN', { 
                        day: '2-digit',
                        month: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(record.actionTime).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {history.length > 5 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Hiển thị 5 trong số {history.length} hoạt động gần nhất
            </p>
          </div>
        )}
      </div>
    </div>
  );
}