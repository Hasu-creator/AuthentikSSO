import React from 'react';
import { UserCheck, Loader2, Ban, Mail, Shield, Edit, AlertCircle } from 'lucide-react';

export default function InactiveUserTable({ users, loading, onActivateClick, onEditClick, searchTerm }) {
  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.split(' ').filter(w => w.length > 0);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 p-16">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={48} strokeWidth={2.5} />
          <span className="text-slate-700 font-semibold text-lg">Đang tải danh sách...</span>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 p-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-5 shadow-md">
            <Ban className="text-slate-500" size={44} strokeWidth={2.5} />
          </div>
          <p className="text-slate-800 text-xl font-bold mb-2">
            {searchTerm ? 'Không tìm thấy tài khoản phù hợp' : 'Không có tài khoản bị vô hiệu hóa'}
          </p>
          <p className="text-slate-600 text-sm">
            {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Tất cả tài khoản đang hoạt động bình thường'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-slate-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200">
              <th className="px-8 py-5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">
                Nhân viên
              </th>
              <th className="px-8 py-5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">
                Tài khoản
              </th>
              <th className="px-8 py-5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">
                Email
              </th>
              <th className="px-8 py-5 text-center text-xs font-bold text-slate-800 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user, index) => (
              <tr 
                key={user.username} 
                className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-transparent transition-all duration-200"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    {/* Inactive Avatar - Grayscale */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-300 to-slate-400 rounded-xl flex items-center justify-center text-slate-700 font-bold text-base shadow-md">
                        {getInitials(user.name)}
                      </div>
                      {/* Inactive Badge */}
                      <div className="absolute -bottom-0.5 -right-0.5 bg-gradient-to-br from-red-500 to-red-600 rounded-full p-1.5 border-2 border-white shadow-md">
                        <Ban className="text-white" size={9} strokeWidth={3} />
                      </div>
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="text-base font-bold text-slate-800 truncate" title={user.name}>
                          {user.name}
                        </div>
                        <span className="text-xs bg-gradient-to-r from-red-100 to-red-50 text-red-700 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 border border-red-200">
                          <AlertCircle size={12} strokeWidth={2.5} />
                          Inactive
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-600 font-semibold">ID: #{index + 1}</span>
                        {user.deactivated_at && (
                          <span className="text-xs text-slate-600">
                            • Ngày vô hiệu: {new Date(user.deactivated_at).toLocaleDateString('vi-VN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <Shield className="text-slate-500" size={16} strokeWidth={2.5} />
                    <span 
                      className="text-sm font-mono font-semibold bg-slate-50 text-slate-700 px-3 py-2 rounded-lg border border-slate-200 truncate max-w-xs"
                      title={user.username}
                    >
                      {user.username}
                    </span>
                  </div>
                </td>
                
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="text-slate-500" size={16} strokeWidth={2.5} />
                    <a 
                      href={`mailto:${user.email}`}
                      className="text-sm text-slate-700 hover:text-blue-600 transition-colors hover:underline truncate font-medium"
                      title={user.email}
                    >
                      {user.email}
                    </a>
                  </div>
                </td>
                
                <td className="px-8 py-6">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onEditClick(user)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 text-sm font-bold shadow-md border border-blue-500/20"
                      title="Chỉnh sửa thông tin"
                      style={{ boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)' }}
                    >
                      <Edit size={16} strokeWidth={2.5} />
                      <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => onActivateClick(user)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl transition-all duration-200 text-sm font-bold shadow-md border border-emerald-500/20"
                      title="Kích hoạt lại tài khoản"
                      style={{ boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)' }}
                    >
                      <UserCheck size={16} strokeWidth={2.5} />
                      <span>Kích hoạt</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}