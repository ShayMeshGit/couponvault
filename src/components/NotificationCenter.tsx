import { AlertTriangle, Bell, Info, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ExpiryAlert } from "@/utils/notifications";

interface NotificationCenterProps {
  isOpen: boolean;
  alerts: ExpiryAlert[];
  onClose: () => void;
}

export default function NotificationCenter({
  isOpen,
  alerts,
  onClose,
}: NotificationCenterProps) {
  return (
    <AnimatePresence>
      {isOpen && (
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
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={`${alert.couponId}-${alert.daysRemaining}`}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100"
                >
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-900 font-medium">{alert.message}</p>
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
  );
}
