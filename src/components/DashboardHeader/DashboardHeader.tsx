import React from "react";
import { Bell, Plus, Ticket } from "lucide-react";
import { styles } from "./styles";

interface DashboardHeaderProps {
  alertCount: number;
  onToggleNotifications: () => void;
  onOpenAddModal: () => void;
}

export default function DashboardHeader({
  alertCount,
  onToggleNotifications,
  onOpenAddModal,
}: DashboardHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-900/20">
            <Ticket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight text-zinc-900">
              CouponVault
            </h1>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Smart Manager
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleNotifications}
            className="relative p-3 rounded-2xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-all"
          >
            <Bell className="w-5 h-5" />
            {alertCount > 0 && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {alertCount}
              </span>
            )}
          </button>
          <button
            onClick={onOpenAddModal}
            className="bg-zinc-900 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Coupon</span>
          </button>
        </div>
      </div>
    </header>
  );
}
