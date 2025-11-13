import React, { useState, useEffect } from 'react';
import { Edit, Loader2, X, User, Mail, Shield, AlertCircle, CheckCircle } from 'lucide-react';

export default function EditUserModal({ user, onConfirm, onCancel, isProcessing }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [enableUsernameEdit, setEnableUsernameEdit] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      const displayName = user.name.includes('(') 
        ? user.name.substring(0, user.name.indexOf('(')).trim() 
        : user.name;
      setName(displayName);
      setEmail(user.email);
      setNewUsername(user.username);
    }
  }, [user]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateUsername = (username) => {
    if (username.length < 3 || username.length > 32) {
      return false;
    }
    const re = /^[\p{L}\p{N}\s._-]+$/u;
    return re.test(username);
  };

  const handleSubmit = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (enableUsernameEdit) {
      if (!newUsername.trim()) {
        newErrors.newUsername = 'Vui lòng nhập username mới';
      } else if (!validateUsername(newUsername)) {
        newErrors.newUsername = 'Username chỉ được chứa chữ, số, dấu chấm, gạch dưới, gạch ngang (3-32 ký tự)';
      } else if (newUsername === user.username) {
        newErrors.newUsername = 'Username mới phải khác username hiện tại';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onConfirm({
      username: user.username,
      name: name.trim(),
      email: email.trim(),
      new_username: enableUsernameEdit && newUsername !== user.username ? newUsername.trim() : undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border-2 border-slate-200 max-h-[90vh] overflow-y-auto" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-5 relative overflow-hidden sticky top-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-600/20 to-transparent"></div>
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30 shadow-lg">
                <Edit className="text-white" size={26} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Chỉnh sửa thông tin</h2>
                <p className="text-slate-200 text-sm font-medium">Cập nhật thông tin tài khoản</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/30 disabled:opacity-50 flex-shrink-0"
            >
              <X className="text-white" size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Username */}
          <div>
            <label className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <Shield size={16} strokeWidth={2.5} />
                Username
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableUsernameEdit}
                  onChange={(e) => {
                    setEnableUsernameEdit(e.target.checked);
                    if (!e.target.checked) {
                      setNewUsername(user?.username);
                      setErrors({...errors, newUsername: null});
                    }
                  }}
                  disabled={isProcessing}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer disabled:opacity-50"
                />
                <span className="text-xs text-slate-600 font-medium">Cho phép chỉnh sửa</span>
              </label>
            </label>
            
            {!enableUsernameEdit ? (
              <div className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-slate-600 font-mono text-sm font-medium">
                {user?.username}
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => {
                    setNewUsername(e.target.value);
                    if (errors.newUsername) setErrors({...errors, newUsername: null});
                  }}
                  disabled={isProcessing}
                  placeholder="Nhập username mới"
                  className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 text-slate-900 font-mono text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                    errors.newUsername 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                      : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
                {errors.newUsername && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    {errors.newUsername}
                  </p>
                )}
                <div className="mt-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl p-3">
                  <p className="text-xs text-emerald-800 flex items-start gap-2 font-medium">
                    <CheckCircle size={14} className="flex-shrink-0 mt-0.5" />
                    <span>Sessions được giữ nguyên - User không cần đăng nhập lại</span>
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Họ tên */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
              <User size={16} strokeWidth={2.5} />
              Họ và tên
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-semibold">Bắt buộc</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({...errors, name: null});
              }}
              disabled={isProcessing}
              placeholder="Nhập họ và tên đầy đủ"
              className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 text-slate-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                errors.name 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle size={14} className="flex-shrink-0" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
              <Mail size={16} strokeWidth={2.5} />
              Email
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-semibold">Bắt buộc</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({...errors, email: null});
              }}
              disabled={isProcessing}
              placeholder="example@company.com"
              className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 text-slate-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                errors.email 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                  : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle size={14} className="flex-shrink-0" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Info */}
          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={22} strokeWidth={2.5} />
              <div>
                <p className="font-bold text-blue-900 mb-2">Lưu ý</p>
                <ul className="space-y-1 text-xs text-blue-800 font-medium">
                  <li>• Thông tin sẽ được cập nhật ngay lập tức</li>
                  <li>• Email phải là địa chỉ hợp lệ và duy nhất</li>
                  {enableUsernameEdit && (
                    <li>• Sessions được giữ nguyên khi đổi username</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t-2 border-slate-200 flex gap-3 justify-end sticky bottom-0">
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed border-2 border-slate-200"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            className="px-5 py-3 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-200 font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-blue-500/20"
            style={{ boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)' }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={18} strokeWidth={2.5} />
                Đang lưu...
              </>
            ) : (
              <>
                <Edit size={18} strokeWidth={2.5} />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}