"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Ticket,
  Sparkles,
  Bell,
  X,
  AlertTriangle,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Coupon, CouponFormData } from "@/lib/types";
import {
  getCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/lib/coupons-api";
import { checkExpiringCoupons, ExpiryAlert } from "@/lib/notifications";
import CouponCard from "./CouponCard";
import AddCouponModal from "./AddCouponModal";

export default function CouponDashboard() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<
    "all" | "active" | "redeemed" | "expired"
  >("all");
  const [alerts, setAlerts] = useState<ExpiryAlert[]>([]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  const refreshCoupons = useCallback(async () => {
    const data = await getCoupons();
    const migratedData = data.map((coupon) => ({
      ...coupon,
      originalAmount: coupon.originalAmount ?? (coupon as any).amount ?? 0,
      amountLeft: coupon.amountLeft ?? (coupon as any).amount ?? 0,
      currency: coupon.currency || "₪",
      category: coupon.category ?? "Other",
      status: coupon.status === "used" ? "redeemed" : coupon.status,
    }));
    setCoupons(migratedData);
    setAlerts(checkExpiringCoupons(migratedData));
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        await refreshCoupons();
      } catch (error) {
        console.error("Failed to load coupons", error);
      }
    };
    void loadData();
  }, [refreshCoupons]);

  const handleAddCoupon = async (data: CouponFormData) => {
    try {
      await addCoupon(data);
      await refreshCoupons();
    } catch (error) {
      console.error("Failed to add coupon", error);
    }
  };

  const handleUpdateCoupon = async (updated: Coupon) => {
    try {
      await updateCoupon(updated);
      await refreshCoupons();
    } catch (error) {
      console.error("Failed to update coupon", error);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteCoupon(id);
        await refreshCoupons();
      } catch (error) {
        console.error("Failed to delete coupon", error);
      }
    }
  };

  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch =
      coupon.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (coupon.code &&
        coupon.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      coupon.expiryDate.includes(searchQuery);

    if (filter === "all") return matchesSearch && coupon.status !== "redeemed";
    return matchesSearch && coupon.status === filter;
  });

  const activeCount = coupons.filter((c) => c.status === "active").length;
  const redeemedCount = coupons.filter((c) => c.status === "redeemed").length;

  return (
    <div className="min-h-screen pb-20 bg-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
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
              onClick={() => setShowNotificationCenter(!showNotificationCenter)}
              className="relative p-3 rounded-2xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-all"
            >
              <Bell className="w-5 h-5" />
              {alerts.length > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {alerts.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-zinc-900 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/20"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Coupon</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Notification Center Popover */}
        <AnimatePresence>
          {showNotificationCenter && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 bg-white rounded-3xl border border-zinc-200 p-6 shadow-xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </h3>
                <button
                  onClick={() => setShowNotificationCenter(false)}
                  className="text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {alerts.length > 0 ? (
                <div className="space-y-3">
                  {alerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100"
                    >
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-900 font-medium">
                        {alert.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                  <Info className="w-5 h-5 text-zinc-400 shrink-0" />
                  <p className="text-sm text-zinc-500">
                    No urgent notifications at this time.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats & Search */}
        <div
          suppressHydrationWarning
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="md:col-span-2 space-y-4">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
              <input
                suppressHydrationWarning
                type="text"
                placeholder="Search by name, category, or date (YYYY-MM-DD)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-3xl border border-zinc-200 bg-white focus:outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all shadow-sm text-sm"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {(["all", "active", "redeemed", "expired"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                    filter === f
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-900/10"
                      : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-zinc-900/30">
            <Sparkles className="absolute -right-4 -top-4 w-32 h-32 text-white/5 rotate-12" />
            <div>
              <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                Total Savings
              </p>
              <h2 className="text-5xl font-black tracking-tighter">
                {activeCount}
                <span className="text-xl text-zinc-500 ml-2 font-bold tracking-normal">
                  Active
                </span>
              </h2>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                {redeemedCount} Redeemed
              </div>
              <div className="w-10 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white"
                  style={{
                    width: `${(redeemedCount / (coupons.length || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Coupon Grid */}
        <AnimatePresence initial={false}>
          {filteredCoupons.length > 0 ? (
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-3">
              {filteredCoupons.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  onDelete={handleDeleteCoupon}
                  onUpdate={handleUpdateCoupon}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-zinc-100"
            >
              <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Ticket className="w-10 h-10 text-zinc-200" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">
                No coupons found
              </h3>
              <p className="text-sm text-zinc-400 max-w-xs mx-auto mt-2 font-medium">
                {searchQuery || filter !== "all"
                  ? "We couldn't find any coupons matching your current filters."
                  : "Your vault is empty. Start saving by adding your first coupon!"}
              </p>
              {!searchQuery && filter === "all" && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-8 bg-zinc-100 text-zinc-900 px-8 py-3 rounded-2xl font-bold text-sm hover:bg-zinc-200 transition-all"
                >
                  Add your first coupon
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AddCouponModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCoupon}
      />
    </div>
  );
}
