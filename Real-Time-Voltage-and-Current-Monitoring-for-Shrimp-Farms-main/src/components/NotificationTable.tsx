import React from 'react';
import { Bell, ChevronRight, CheckCircle2 } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationTableProps {
  notifications: NotificationItem[];
  onViewAll: () => void;
  onToggleStatus: (id: string) => void;
}

export const NotificationTable: React.FC<NotificationTableProps> = ({
  notifications,
  onViewAll,
  onToggleStatus,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-red-50 text-red-500 flex items-center justify-center">
            <Bell className="w-4 h-4 text-red-500" />
          </div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span>Notifikasi & Alarm</span>
            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
              3
            </span>
          </h2>
        </div>

        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 hover:underline cursor-pointer transition-colors"
        >
          <span>Lihat Semua</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold">
              <th className="pb-2.5 font-medium pl-1">Waktu</th>
              <th className="pb-2.5 font-medium">Kategori</th>
              <th className="pb-2.5 font-medium">Pesan</th>
              <th className="pb-2.5 font-medium pr-1 text-right sm:text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80 text-slate-700 font-medium">
            {notifications.slice(0, 4).map((item) => {
              // Dot color based on category
              let dotColor = 'bg-blue-500';
              if (item.kategori === 'Peringatan') {
                dotColor = item.pesan.includes('30%') ? 'bg-amber-400' : 'bg-red-500';
              } else if (item.kategori === 'Bahaya') {
                dotColor = 'bg-red-600';
              }

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onToggleStatus(item.id)}
                  title="Klik untuk ubah status"
                >
                  <td className="py-2.5 pl-1 font-mono text-slate-500 whitespace-nowrap text-[11px]">
                    {item.waktu}
                  </td>
                  <td className="py-2.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 text-xs">
                      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                      <span>{item.kategori}</span>
                    </span>
                  </td>
                  <td className="py-2.5 pr-2 text-slate-800 font-medium text-xs">
                    {item.pesan}
                  </td>
                  <td className="py-2.5 pr-1 text-right sm:text-left whitespace-nowrap">
                    <span
                      className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-md ${
                        item.status === 'Terselesaikan'
                          ? 'bg-emerald-100/80 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
