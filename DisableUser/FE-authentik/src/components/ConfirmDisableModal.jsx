import React, { useState } from 'react';
import { AlertCircle, UserX, Loader2, Calendar, FileText, X } from 'lucide-react';

export default function ConfirmDisableModal({ user, onConfirm, onCancel, isProcessing }) {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [resignDate, setResignDate] = useState('');

  const reasons = [
    { value: 'Nghỉ việc theo đơn xin thôi việc', icon: '📄' },
    { value: 'Hết hạn hợp đồng', icon: '📅' },
    { value: 'Chấm dứt hợp đồng', icon: '⚠️' },
    { value: 'Nghỉ hưu', icon: '🎉' },
    { value: 'Chuyển công tác', icon: '🔄' },
    { value: 'Khác', icon: '📝' }
  ];

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2);
    return maxDate.toISOString().split('T')[0];
  };

  const handleSubmit = () => {
    if (!reason) {
      alert('Vui lòng chọn lý do nghỉ việc');
      return;
    }
    if (!resignDate) {
      alert('Vui lòng chọn ngày nghỉ việc');
      return;
    }
    
    onConfirm({
      username: user.username,
      reason,
      note,
      resignDate,
      processedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border-2 border-slate-200 max-h-[90vh] overflow-y-auto" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-5 relative overflow-hidden sticky top-0">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent"></div>
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl border border-white/30 shadow-lg">
                <AlertCircle className="text-white" size={26} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Xác nhận vô hiệu hóa</h2>
                <p className="text-red-100 text-sm font-medium">Vui lòng kiểm tra kỹ thông tin</p>
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
          {/* User Info */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-50/50 border-2 border-slate-200 rounded-xl p-4">
            <p className="text-sm text-slate-700 font-semibold mb-2">Tài khoản sẽ được vô hiệu hóa:</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-sm text-slate-600 font-mono truncate">{user.username}</p>
              </div>
            </div>
          </div>

          {/* Resign Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
              <Calendar size={16} strokeWidth={2.5} />
              Ngày nghỉ việc
              <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded font-semibold">Bắt buộc</span>
            </label>
            <input
              type="date"
              value={resignDate}
              onChange={(e) => setResignDate(e.target.value)}
              max={getMaxDate()}
              disabled={isProcessing}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 text-slate-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            />
            <p className="text-xs text-slate-500 mt-2">
              Có thể chọn ngày trong tương lai (tối đa 2 tháng)
            </p>
          </div>

          {/* Reason */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
              <FileText size={16} strokeWidth={2.5} />
              Lý do nghỉ việc
              <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded font-semibold">Bắt buộc</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2">
              {reasons.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setReason(r.value)}
                  disabled={isProcessing}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left font-medium disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${
                    reason === r.value
                      ? 'border-red-500 bg-red-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{r.icon}</span>
                  <span className={`text-sm ${
                    reason === r.value ? 'text-red-900' : 'text-slate-700'
                  }`}>
                    {r.value}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="text-sm font-bold text-slate-800 mb-2 block">
              Ghi chú thêm
              <span className="ml-2 text-xs text-slate-500 font-normal">(Không bắt buộc)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isProcessing}
              placeholder="Ví dụ: Đã bàn giao công việc, hoàn tất thủ tục..."
              rows={2}
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 resize-none text-slate-900 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            />
          </div>

          {/* Warning */}
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={22} strokeWidth={2.5} />
              <div>
                <p className="font-bold text-red-900 mb-2">Cảnh báo quan trọng</p>
                <ul className="text-xs text-red-800 space-y-1 font-medium">
                  <li>• Tài khoản sẽ ngay lập tức bị vô hiệu hóa</li>
                  <li>• Nhân viên không thể đăng nhập vào hệ thống</li>
                  <li>• Hành động này được ghi lại trong lịch sử</li>
                  <li>• Đảm bảo nhân viên đã hoàn tất thủ tục</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-2 bg-slate-50 border-t border-slate-200 sticky bottom-0">
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
            disabled={isProcessing || !reason || !resignDate}
            className="flex-1 px-5 py-3 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg border border-red-500/20"
            style={{ boxShadow: '0 4px 16px rgba(220, 38, 38, 0.4)' }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={18} strokeWidth={2.5} />
                Đang xử lý...
              </>
            ) : (
              <>
                <UserX size={18} strokeWidth={2.5} />
                Xác nhận vô hiệu hóa
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}