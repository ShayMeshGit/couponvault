import { Sparkles } from "lucide-react";

interface CouponStatsCardProps {
  activeCount: number;
  redeemedCount: number;
  totalLeft: number;
  totalLeftCurrency: string;
  redeemedPercent: number;
}

export default function CouponStatsCard({
  activeCount,
  redeemedCount,
  totalLeft,
  totalLeftCurrency,
  redeemedPercent,
}: CouponStatsCardProps) {
  return (
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
        <div>
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            {redeemedCount} Redeemed
          </div>
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mt-1">
            Total left: {totalLeftCurrency}
            {totalLeft.toFixed(2)}
          </div>
        </div>
        <div className="w-10 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-white"
            style={{
              width: `${redeemedPercent}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
