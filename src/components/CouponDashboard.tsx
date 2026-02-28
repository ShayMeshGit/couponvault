"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Ticket } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { parseISO } from "date-fns";
import {
  Coupon,
  CouponApiResponse,
  CouponFilter,
  CouponFormData,
} from "@/types";
import {
  getCoupons,
  addCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/services/coupons-api";
import { normalizeCoupon } from "@/utils/coupon-utils";
import { checkExpiringCoupons, ExpiryAlert } from "@/utils/notifications";
import CouponCard from "./CouponCard";
import AddCouponModal from "./AddCouponModal";
import DashboardHeader from "./DashboardHeader";
import NotificationCenter from "./NotificationCenter";
import CouponFilters from "./CouponFilters";
import CouponStatsCard from "./CouponStatsCard";

export default function CouponDashboard() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<CouponFilter>("all");
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);

  const refreshCoupons = useCallback(async () => {
    const data = await getCoupons();
    setCoupons(
      data.map((coupon) => normalizeCoupon(coupon as CouponApiResponse)),
    );
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

  const handleAddCoupon = useCallback(
    async (data: CouponFormData) => {
      try {
        await addCoupon(data);
        await refreshCoupons();
      } catch (error) {
        console.error("Failed to add coupon", error);
      }
    },
    [refreshCoupons],
  );

  const handleUpdateCoupon = useCallback(
    async (updated: Coupon) => {
      try {
        await updateCoupon(updated);
        await refreshCoupons();
      } catch (error) {
        console.error("Failed to update coupon", error);
      }
    },
    [refreshCoupons],
  );

  const handleDeleteCoupon = useCallback(
    async (id: string) => {
      if (window.confirm("Are you sure you want to delete this coupon?")) {
        try {
          await deleteCoupon(id);
          await refreshCoupons();
        } catch (error) {
          console.error("Failed to delete coupon", error);
        }
      }
    },
    [refreshCoupons],
  );

  const alerts = useMemo<ExpiryAlert[]>(
    () => checkExpiringCoupons(coupons),
    [coupons],
  );

  const normalizedQuery = useMemo(
    () => searchQuery.trim().toLowerCase(),
    [searchQuery],
  );

  const filteredCoupons = useMemo(() => {
    const now = Date.now();

    return coupons.filter((coupon) => {
      const matchesSearch =
        coupon.storeName.toLowerCase().includes(normalizedQuery) ||
        coupon.description.toLowerCase().includes(normalizedQuery) ||
        coupon.category.toLowerCase().includes(normalizedQuery) ||
        (coupon.code && coupon.code.toLowerCase().includes(normalizedQuery)) ||
        coupon.expiryDate.includes(searchQuery.trim());

      const isExpiredByDate = parseISO(coupon.expiryDate).getTime() < now;
      const isExpired = coupon.status === "expired" || isExpiredByDate;

      if (filter === "all") return matchesSearch;
      if (filter === "active") {
        return matchesSearch && coupon.status === "active" && !isExpired;
      }
      if (filter === "expired") return matchesSearch && isExpired;

      return matchesSearch && coupon.status === filter;
    });
  }, [coupons, filter, normalizedQuery, searchQuery]);

  const { activeCount, redeemedCount, totalLeft, totalLeftCurrency } = useMemo(
    () =>
      coupons.reduce(
        (counts, coupon) => {
          if (coupon.status === "active") counts.activeCount += 1;
          if (coupon.status === "redeemed") counts.redeemedCount += 1;
          counts.totalLeft += coupon.amountLeft ?? 0;
          if (!counts.totalLeftCurrency && coupon.currency) {
            counts.totalLeftCurrency = coupon.currency;
          }
          return counts;
        },
        {
          activeCount: 0,
          redeemedCount: 0,
          totalLeft: 0,
          totalLeftCurrency: "₪",
        },
      ),
    [coupons],
  );

  const redeemedPercent = useMemo(
    () => (redeemedCount / (coupons.length || 1)) * 100,
    [redeemedCount, coupons.length],
  );

  const toggleNotificationCenter = useCallback(() => {
    setShowNotificationCenter((current) => !current);
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const closeNotificationCenter = useCallback(() => {
    setShowNotificationCenter(false);
  }, []);

  return (
    <div className="min-h-screen pb-20 bg-zinc-50">
      <DashboardHeader
        alertCount={alerts.length}
        onToggleNotifications={toggleNotificationCenter}
        onOpenAddModal={openModal}
      />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <NotificationCenter
          isOpen={showNotificationCenter}
          alerts={alerts}
          onClose={closeNotificationCenter}
        />

        {/* Stats & Search */}
        <div
          suppressHydrationWarning
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <CouponFilters
            searchQuery={searchQuery}
            filter={filter}
            onSearchChange={setSearchQuery}
            onFilterChange={setFilter}
          />

          <CouponStatsCard
            activeCount={activeCount}
            redeemedCount={redeemedCount}
            totalLeft={totalLeft}
            totalLeftCurrency={totalLeftCurrency}
            redeemedPercent={redeemedPercent}
          />
        </div>

        {/* Coupon Grid */}
        <AnimatePresence initial={false}>
          {filteredCoupons.length > 0 ? (
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-2">
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
                  onClick={openModal}
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
        onClose={closeModal}
        onAdd={handleAddCoupon}
      />
    </div>
  );
}
