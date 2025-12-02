"use client";
import { KPICardProps } from "@/types/dashboard/overview.interface";
import { TrendingDown, TrendingUp, Minus, ArrowUpRight } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Area, AreaChart } from "recharts";

const KPICard = ({
  title,
  value,
  change,
  changeValue,
  direction = "neutral",
  icon: Icon,
  trendData = [],
  color = "blue",
  formatValue,
}: KPICardProps) => {
  const isUp = direction === "up";
  const isDown = direction === "down";
  const isNeutral = direction === "neutral";

  // Enhanced color schemes with gradients
  const colorClasses = {
    green: {
      bg: "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
      icon: "text-emerald-600",
      value: "text-emerald-700",
      border: "border-emerald-200",
      glow: "shadow-emerald-200/50",
      change: isUp ? "text-emerald-600" : isDown ? "text-red-600" : "text-gray-600",
    },
    red: {
      bg: "bg-gradient-to-br from-red-50 via-rose-50 to-pink-50",
      iconBg: "bg-gradient-to-br from-red-500 to-rose-600",
      icon: "text-red-600",
      value: "text-red-700",
      border: "border-red-200",
      glow: "shadow-red-200/50",
      change: isUp ? "text-emerald-600" : isDown ? "text-red-600" : "text-gray-600",
    },
    amber: {
      bg: "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
      icon: "text-amber-600",
      value: "text-amber-700",
      border: "border-amber-200",
      glow: "shadow-amber-200/50",
      change: isUp ? "text-emerald-600" : isDown ? "text-red-600" : "text-gray-600",
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
      iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
      icon: "text-blue-600",
      value: "text-blue-700",
      border: "border-blue-200",
      glow: "shadow-blue-200/50",
      change: isUp ? "text-emerald-600" : isDown ? "text-red-600" : "text-gray-600",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50",
      iconBg: "bg-gradient-to-br from-purple-500 to-violet-600",
      icon: "text-purple-600",
      value: "text-purple-700",
      border: "border-purple-200",
      glow: "shadow-purple-200/50",
      change: isUp ? "text-emerald-600" : isDown ? "text-red-600" : "text-gray-600",
    },
  };

  // Add fallback to prevent undefined errors if invalid color is passed
  const colors = colorClasses[color] || colorClasses.blue;
  const ChangeIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  // Format the value
  const displayValue =
    typeof value === "number" && formatValue
      ? formatValue(value)
      : typeof value === "number"
      ? value.toLocaleString()
      : value;

  // Prepare sparkline data
  const sparklineData =
    trendData.length > 0
      ? trendData.map((val, idx) => ({ value: val, index: idx }))
      : [];

  return (
    <div
      className={`${colors.bg} ${colors.border} border-2 p-6 rounded-2xl shadow-lg ${colors.glow} transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden group`}
    >
      {/* Animated background gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Decorative corner accent */}
      <div className={`absolute top-0 right-0 w-20 h-20 ${colors.iconBg} opacity-10 rounded-bl-full`}></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className={`${colors.iconBg} p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
              {Icon && <Icon className="text-white" size={22} />}
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
            </div>
          </div>
          {trendData.length > 0 && (
            <div className="w-20 h-10 opacity-70 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <defs>
                    <linearGradient id={`gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isUp ? "#10b981" : isDown ? "#ef4444" : "#6b7280"} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={isUp ? "#10b981" : isDown ? "#ef4444" : "#6b7280"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={isUp ? "#10b981" : isDown ? "#ef4444" : "#6b7280"}
                    strokeWidth={2.5}
                    fill={`url(#gradient-${color})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between mt-6">
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-2">
              <span className={`text-4xl font-extrabold ${colors.value} tracking-tight`}>
                {displayValue}
              </span>
              {changeValue !== undefined && changeValue !== 0 && (
                <ArrowUpRight 
                  size={20} 
                  className={`${isUp ? "text-emerald-600 rotate-0" : isDown ? "text-red-600 rotate-180" : "text-gray-400"} transition-transform duration-300`}
                />
              )}
            </div>
            {change && (
              <div className={`flex items-center gap-2 mt-3 text-sm font-semibold ${colors.change}`}>
                <div className={`p-1.5 rounded-lg ${isUp ? "bg-emerald-100" : isDown ? "bg-red-100" : "bg-gray-100"}`}>
                  <ChangeIcon size={12} />
                </div>
                <span>
                  {changeValue !== undefined && changeValue !== 0
                    ? `${changeValue > 0 ? "+" : ""}${changeValue.toFixed(1)}%`
                    : change}
                </span>
                <span className="text-xs text-gray-400 ml-1">vs previous</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPICard;
