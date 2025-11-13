import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ searchTerm, onSearchChange, totalUsers, filteredCount }) {
  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 p-5 mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search Input */}
        <div className="flex-1 min-w-[280px] relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-slate-500" size={20} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm theo tên, username hoặc email..."
            className="w-full pl-12 pr-12 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-red-600 transition-colors"
              title="Xóa tìm kiếm"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 rounded-xl border-2 border-emerald-200">
          <span className="text-sm text-slate-700 font-medium">
            Hiển thị
          </span>
          <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            {filteredCount}
          </span>
          <span className="text-sm text-slate-700 font-medium">
            / {totalUsers}
          </span>
        </div>
      </div>

      {/* Filter Status */}
      {searchTerm && (
        <div className="mt-3 pt-3 border-t-2 border-slate-100">
          <p className="text-sm text-slate-700">
            Đang lọc với từ khóa:{' '}
            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
              "{searchTerm}"
            </span>
          </p>
        </div>
      )}
    </div>
  );
}