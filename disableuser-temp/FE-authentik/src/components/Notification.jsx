import React from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Notification({ type, message, onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';
  
  return (
    <div className={`mb-6 rounded-xl shadow-lg overflow-hidden border-2 animate-slideDown backdrop-blur-sm ${
      isSuccess 
        ? 'bg-gradient-to-r from-emerald-50 to-emerald-50/80 border-emerald-300' 
        : 'bg-gradient-to-r from-red-50 to-red-50/80 border-red-300'
    }`}
    style={{
      boxShadow: isSuccess
        ? '0 8px 24px rgba(16, 185, 129, 0.2), 0 4px 8px rgba(0, 0, 0, 0.05)'
        : '0 8px 24px rgba(239, 68, 68, 0.2), 0 4px 8px rgba(0, 0, 0, 0.05)'
    }}>
      <div className="p-4 flex items-center gap-3">
        <div className={`flex-shrink-0 p-2.5 rounded-xl ${
          isSuccess 
            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
            : 'bg-gradient-to-br from-red-500 to-red-600'
        }`}
        style={{
          boxShadow: isSuccess
            ? '0 4px 12px rgba(16, 185, 129, 0.3)'
            : '0 4px 12px rgba(239, 68, 68, 0.3)'
        }}>
          {isSuccess ? (
            <CheckCircle className="text-white" size={22} strokeWidth={2.5} />
          ) : (
            <AlertCircle className="text-white" size={22} strokeWidth={2.5} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-base ${
            isSuccess ? 'text-emerald-900' : 'text-red-900'
          }`}>
            {isSuccess ? '✓ Thành công' : '✕ Có lỗi xảy ra'}
          </p>
          <p className={`text-sm mt-1 ${
            isSuccess ? 'text-emerald-800' : 'text-red-800'
          }`}>
            {message}
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 ${
              isSuccess 
                ? 'hover:bg-emerald-200 text-emerald-700 hover:text-emerald-900' 
                : 'hover:bg-red-200 text-red-700 hover:text-red-900'
            }`}
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}