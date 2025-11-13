import React, { useState } from 'react';
import { UserCheck, FileText, CheckCircle, X, Loader2 } from 'lucide-react';

export default function ConfirmActivateModal({ user, onConfirm, onCancel, isProcessing }) {
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    onConfirm({ note });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border-2 border-slate-200" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent"></div>
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30 shadow-lg">
                <UserCheck className="text-white" size={26} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Xác nhận kích hoạt</h2>
                <p className="text-emerald-100 text-sm font-medium">Khôi phục quyền truy cập tài khoản</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors border border-white/30 disabled:opacity-50"
            >
              <X className="text-white" size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* User Info */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-50/50 border-2 border-slate-200 rounded-xl p-4">
            <p className="text-sm text-slate-700 font-semibold mb-2">Tài khoản sẽ được kích hoạt:</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-600 font-mono">{user.username}</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-50/50 border-2 border-emerald-300 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-emerald-600 flex-shrink-0 mt-0.5" size={22} strokeWidth={2.5} />
              <div>
                <p className="text-sm text-emerald-900 font-bold mb-1">Sau khi kích hoạt:</p>
                <ul className="text-xs text-emerald-800 space-y-1 font-medium">
                  <li>• Tài khoản có thể đăng nhập lại vào hệ thống</li>
                  <li>• Tất cả quyền truy cập sẽ được khôi phục</li>
                  <li>• User có thể làm việc bình thường</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
              <FileText size={16} strokeWidth={2.5} />
              Ghi chú (tùy chọn)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isProcessing}
              rows={3}
              placeholder="Nhập ghi chú nếu cần (ví dụ: Quay lại làm việc sau kỳ nghỉ...)"
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed resize-none font-medium transition-all duration-200"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed border-2 border-slate-200"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isProcessing}
              className="flex-1 px-5 py-3 bg-gradient-to-br from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg border border-emerald-500/20"
              style={{ boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)' }}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={18} strokeWidth={2.5} />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <UserCheck size={18} strokeWidth={2.5} />
                  Xác nhận kích hoạt
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}