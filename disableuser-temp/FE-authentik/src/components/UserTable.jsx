import React from 'react';
import { UserX, Loader2, Users, Mail, Shield, Edit } from 'lucide-react';

export default function UserTable({ users, loading, onDisableClick, onEditClick, searchTerm }) {
  // Function to get initials from a name (from your second code)
  const getInitials = (name) => {
    if (!name) return '?';
    const words = name.split(' ').filter(w => w.length > 0);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  // Function for dynamic avatar colors (from your first code)
  const getAvatarStyle = (name) => {
    const styles = [
      { gradient: 'from-blue-500 to-blue-600', shadow: 'rgba(59, 130, 246, 0.3)' },      // Blue
      { gradient: 'from-emerald-500 to-emerald-600', shadow: 'rgba(16, 185, 129, 0.3)' },// Emerald
      { gradient: 'from-purple-500 to-purple-600', shadow: 'rgba(168, 85, 247, 0.3)' },  // Purple
      { gradient: 'from-amber-500 to-amber-600', shadow: 'rgba(245, 158, 11, 0.3)' }    // Amber
    ];
    
    // Create a consistent index based on the user's name
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % styles.length;
    return styles[index];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 p-16">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={48} strokeWidth={2.5} />
          <span className="text-slate-700 font-semibold text-lg">Đang tải danh sách nhân viên...</span>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 p-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl mb-5 shadow-md">
            <Users className="text-slate-500" size={44} strokeWidth={2.5} />
          </div>
          <p className="text-slate-800 text-xl font-bold mb-2">
            {searchTerm ? 'Không tìm thấy nhân viên phù hợp' : 'Danh sách trống'}
          </p>
          <p className="text-slate-600 text-sm">
            {searchTerm ? 'Thử tìm kiếm với từ khóa khác' : 'Hiện tại không có nhân viên nào trong hệ thống'}
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
                Liên hệ
              </th>
              <th className="px-8 py-5 text-center text-xs font-bold text-slate-800 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user, index) => {
              // Get the dynamic style for the current user
              const avatarStyle = getAvatarStyle(user.name);
              
              return (
                <tr 
                  key={user.username} 
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-slate-50 transition-colors duration-200"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      {/* Colorful Avatar with dynamic styles */}
                      <div className="relative">
                        <div 
                          className={`w-12 h-12 bg-gradient-to-br ${avatarStyle.gradient} rounded-xl flex items-center justify-center shadow-md`}
                          style={{ boxShadow: `0 4px 12px ${avatarStyle.shadow}` }}
                        >
                          <span className="text-white font-bold text-base">
                            {getInitials(user.name)}
                          </span>
                        </div>
                        {/* Status indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></div>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="text-base font-bold text-slate-900 truncate" title={user.name}>
                          {user.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-600 font-semibold">ID: #{index + 1}</span>
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg font-semibold border border-emerald-200">Active</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Shield className="text-blue-500 flex-shrink-0" size={16} strokeWidth={2.5} />
                      <span 
                        className="text-sm font-mono bg-slate-50 text-slate-700 px-3 py-2 rounded-lg font-semibold border border-slate-200 truncate max-w-xs"
                        title={user.username}
                      >
                        {user.username}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 min-w-0">
                      <Mail className="text-slate-500 flex-shrink-0" size={16} strokeWidth={2.5} />
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
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 text-sm font-bold shadow-md border border-blue-500/20"
                        title="Chỉnh sửa thông tin"
                        style={{ boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)' }}
                      >
                        <Edit size={16} strokeWidth={2.5} />
                        <span>Sửa</span>
                      </button>
                      <button
                        onClick={() => onDisableClick(user)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-200 text-sm font-bold shadow-md border border-red-500/20"
                        title="Vô hiệu hóa tài khoản"
                        style={{ boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)' }}
                      >
                        <UserX size={16} strokeWidth={2.5} />
                        <span>Vô hiệu hóa</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}