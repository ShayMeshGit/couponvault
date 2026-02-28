"use client";

import { useCallback, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  X,
  Plus,
  Tag,
  ShoppingBag,
  Utensils,
  Smartphone,
  Home,
  HelpCircle,
  Hash,
  ChevronRight,
  Settings2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AddCouponModalProps, CouponFormData, CouponCategory } from "@/types";
import { getDefaultCouponFormData } from "@/utils/coupon-utils";
import { addYears, format } from "date-fns";

const CATEGORIES: { label: CouponCategory; icon: LucideIcon }[] = [
  { label: "Groceries", icon: ShoppingBag },
  { label: "Clothing", icon: Tag },
  { label: "Dining", icon: Utensils },
  { label: "Electronics", icon: Smartphone },
  { label: "Home Goods", icon: Home },
  { label: "Other", icon: HelpCircle },
];

const EXPIRY_YEARS = [1, 2, 3, 5, 10] as const;

export default function AddCouponModal({
  isOpen,
  onClose,
  onAdd,
}: AddCouponModalProps) {
  const [isAdvancedDate, setIsAdvancedDate] = useState(false);
  const [yearsToAdd, setYearsToAdd] = useState(1);
  const [formData, setFormData] = useState<CouponFormData>(() =>
    getDefaultCouponFormData(),
  );

  const resetForm = useCallback(() => {
    setFormData(getDefaultCouponFormData());
    setIsAdvancedDate(false);
    setYearsToAdd(1);
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    resetForm();
  }, [onClose, resetForm]);

  const updateFormField = useCallback(
    <K extends keyof CouponFormData>(key: K, value: CouponFormData[K]) => {
      setFormData((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const finalData = { ...formData };
      if (!isAdvancedDate) {
        finalData.expiryDate = format(
          addYears(new Date(), yearsToAdd),
          "yyyy-MM-dd",
        );
      }

      onAdd(finalData);
      handleClose();
    },
    [formData, handleClose, isAdvancedDate, onAdd, yearsToAdd],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b flex justify-between items-center bg-zinc-50/50">
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Add New Coupon</h2>
            <p className="text-xs text-zinc-500">
              Enter your coupon details below
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[80vh] overflow-y-auto"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => updateFormField("category", cat.label)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                        formData.category === cat.label
                          ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
                          : "border-zinc-100 bg-zinc-50 text-zinc-500 hover:border-zinc-200"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-tight">
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Store Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => updateFormField("storeName", e.target.value)}
                  placeholder="e.g. Starbucks"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Coupon Code
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => updateFormField("code", e.target.value)}
                    placeholder="Optional"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Value
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-medium">
                    {formData.currency}
                  </span>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={formData.originalAmount || ""}
                    onChange={(e) =>
                      updateFormField(
                        "originalAmount",
                        Number.parseFloat(e.target.value) || 0,
                      )
                    }
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Expiry Date
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAdvancedDate(!isAdvancedDate)}
                    className="text-[10px] font-bold text-zinc-400 hover:text-zinc-900 flex items-center gap-1 transition-colors"
                  >
                    <Settings2 className="w-3 h-3" />
                    {isAdvancedDate ? "Simple" : "Advanced"}
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {isAdvancedDate ? (
                    <motion.input
                      key="advanced"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      required
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) =>
                        updateFormField("expiryDate", e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
                    />
                  ) : (
                    <motion.div
                      key="simple"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex items-center gap-2"
                    >
                      <select
                        value={yearsToAdd}
                        onChange={(e) =>
                          setYearsToAdd(parseInt(e.target.value))
                        }
                        className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all bg-white text-sm"
                      >
                        {EXPIRY_YEARS.map((year) => (
                          <option
                            key={year}
                            value={year}
                          >{`In ${year} year${year > 1 ? "s" : ""}`}</option>
                        ))}
                      </select>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormField("description", e.target.value)}
                placeholder="What is this coupon for?"
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-900 text-white py-3.5 rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/20"
          >
            <Plus className="w-5 h-5" />
            Save Coupon
          </button>
        </form>
      </motion.div>
    </div>
  );
}
