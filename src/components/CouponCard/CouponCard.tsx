"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { LucideIcon } from "lucide-react";
import { CouponCardProps, CouponCategory } from "@/types";
import { copyTextToClipboard } from "@/utils/clipboard";
import {
  Calendar,
  MapPin,
  Trash2,
  CheckCircle2,
  Clock,
  ShoppingBag,
  Tag,
  Utensils,
  Smartphone,
  Home,
  HelpCircle,
  MinusCircle,
  PlusCircle,
  X,
  Copy,
  Check,
} from "lucide-react";
import { addDays, format, isWithinInterval, parseISO } from "date-fns";
import { styles } from "./styles";

const CATEGORY_ICONS: Record<CouponCategory, LucideIcon> = {
  Groceries: ShoppingBag,
  Clothing: Tag,
  Dining: Utensils,
  Electronics: Smartphone,
  "Home Goods": Home,
  Other: HelpCircle,
};

function CouponCard({ coupon, onDelete, onUpdate }: CouponCardProps) {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState<number | null>(null);
  const copyResetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setNow(Date.now());
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      if (copyResetTimeoutRef.current !== null) {
        window.clearTimeout(copyResetTimeoutRef.current);
      }
    };
  }, []);

  const expiryDate = useMemo(
    () => parseISO(coupon.expiryDate),
    [coupon.expiryDate],
  );
  const isExpired = useMemo(() => {
    if (now === null) return false;
    return expiryDate.getTime() < now;
  }, [expiryDate, now]);
  const isExpiringSoon = useMemo(() => {
    if (now === null) return false;
    const currentDate = new Date(now);
    return isWithinInterval(expiryDate, {
      start: currentDate,
      end: addDays(currentDate, 7),
    });
  }, [expiryDate, now]);

  const Icon = CATEGORY_ICONS[coupon.category] || HelpCircle;

  const statusColor = useMemo(() => {
    if (coupon.status === "redeemed")
      return "bg-zinc-100 text-zinc-500 border-zinc-200";
    if (isExpired) return "bg-red-50 text-red-600 border-red-100";
    if (isExpiringSoon) return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
  }, [coupon.status, isExpired, isExpiringSoon]);

  const canDelete = coupon.status !== "redeemed" && coupon.status !== "expired" && !isExpired;

  const progressPercent = useMemo(() => {
    const originalAmount = coupon.originalAmount ?? 1;
    const amountLeft = coupon.amountLeft ?? 0;
    return (amountLeft / originalAmount) * 100;
  }, [coupon.amountLeft, coupon.originalAmount]);

  const handleRedeem = useCallback(() => {
    const newAmountLeft = Math.max(0, coupon.amountLeft - redeemAmount);
    const newStatus = newAmountLeft <= 0 ? "redeemed" : coupon.status;
    onUpdate({
      ...coupon,
      amountLeft: newAmountLeft,
      status: newStatus,
    });
    setIsRedeeming(false);
    setRedeemAmount(0);
  }, [coupon, onUpdate, redeemAmount]);

  const copyToClipboard = useCallback(async () => {
    if (coupon.code) {
      const copiedToClipboard = await copyTextToClipboard(coupon.code);
      if (!copiedToClipboard) return;
      setCopied(true);
      if (copyResetTimeoutRef.current !== null) {
        window.clearTimeout(copyResetTimeoutRef.current);
      }
      copyResetTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [coupon.code]);

  const handleRedeemAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseFloat(event.target.value);
      setRedeemAmount(Number.isFinite(value) ? value : 0);
    },
    [],
  );

  return (
    <div
      className={`${styles.card} ${
        coupon.status === "redeemed" ? styles.redeemedCard : styles.activeCard
      }`}
    >
      <div className="mb-4 flex min-w-0 items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            className={`p-3 rounded-2xl ${coupon.status === "redeemed" ? "bg-zinc-200 text-zinc-500" : "bg-zinc-900 text-white"}`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="mb-0.5 flex min-w-0 items-center gap-2">
              <h3 className="truncate text-lg font-bold leading-tight text-zinc-900">
                {coupon.storeName}
              </h3>
              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColor}`}
              >
                {coupon.status === "redeemed"
                  ? "Redeemed"
                  : isExpired
                    ? "Expired"
                    : isExpiringSoon
                      ? "Expiring Soon"
                      : "Active"}
              </span>
            </div>
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
              {coupon.category}
            </p>
          </div>
        </div>
        <div className="shrink-0 pl-2 text-right">
          <div className="text-2xl font-black text-zinc-900">
            {coupon.currency}
            {(coupon.amountLeft ?? 0).toFixed(2)}
          </div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase">
            Left of {coupon.currency}
            {(coupon.originalAmount ?? 0).toFixed(2)}
          </div>
        </div>
      </div>

      {coupon.code && (
        <div className="group/code mb-4 flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-3">
          <div className="min-w-0 flex-1 flex flex-col">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Coupon Code
            </span>
            <span className="break-all text-sm font-mono font-bold leading-tight text-zinc-900">
              {coupon.code}
            </span>
          </div>
          <button
            onClick={copyToClipboard}
            className="p-2 hover:bg-zinc-200 rounded-xl transition-colors text-zinc-400 hover:text-zinc-900"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      <p className="text-sm text-zinc-500 mb-6 line-clamp-2 min-h-[2.5rem]">
        {coupon.description}
      </p>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>Expires: {format(expiryDate, "MMM d, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <MapPin className="w-3.5 h-3.5" />
          <span>Valid at: {coupon.storeName}</span>
        </div>
      </div>

      <div className="flex gap-2">
          {isRedeeming ? (
            <div
              className="flex min-w-0 flex-1 gap-2"
            >
              <input
                autoFocus
                type="number"
                step="0.01"
                placeholder="Amount"
                value={redeemAmount || ""}
                onChange={handleRedeemAmountChange}
                className="flex-1 min-w-0 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
              <button
                onClick={handleRedeem}
                className="px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsRedeeming(false)}
                className="p-2 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              disabled={coupon.status === "redeemed" || isExpired}
              onClick={() => setIsRedeeming(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                coupon.status === "redeemed" || isExpired
                  ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                  : "bg-zinc-900 text-white hover:bg-zinc-800 shadow-md shadow-zinc-900/10"
              }`}
            >
              <MinusCircle className="w-4 h-4" />
              Redeem Amount
            </button>
          )}

        {canDelete && (
          <button
            onClick={() => onDelete(coupon.id)}
            className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
            title="Delete coupon"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className={styles.progressTrack}>
        <div
          style={{ width: `${progressPercent}%` }}
          className={`h-full ${coupon.status === "redeemed" ? "bg-zinc-300" : "bg-zinc-900"}`}
        />
      </div>
    </div>
  );
}

export default memo(CouponCard);
