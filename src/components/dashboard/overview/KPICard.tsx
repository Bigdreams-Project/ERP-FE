"use client";
import { KPICardProps } from "@/types/dashboard/overview.interface";
import { TrendingDown, TrendingUp, Minus, ArrowUpRight } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Area, AreaChart } from "recharts";

const KPICard = ({
  title,
  value,
  change,
  changeValue,
  changeValueYoY,
  direction = "neutral",
  directionYoY = "neutral",
  icon: Icon,
  trendData = [],
  color = "blue",
  formatValue,
  sparklineType = "area",
  layout = "default",
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

  // Simple layout matching the design exactly
  if (layout === "simple") {
    const isUpYoY = directionYoY === "up";
    const isDownYoY = directionYoY === "down";
    const ChangeIconYoY = isUpYoY ? TrendingUp : isDownYoY ? TrendingDown : Minus;

    return (
      <div
        className={`${colors.bg} ${colors.border} border-2 p-6 rounded-2xl shadow-lg ${colors.glow} transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden group`}
      >
        {/* Animated background gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Decorative corner accent */}
        <div className={`absolute top-0 right-0 w-20 h-20 ${colors.iconBg} opacity-10 rounded-bl-full`}></div>
        
        <div className="relative z-10">
          {/* Header: Title left, Icon right */}
          <div className="flex justify-between items-start mb-4">
            <h3 className={`text-xs font-semibold uppercase tracking-wider ${color === "red" ? "text-white" : "text-gray-500"}`}>{title}</h3>
            {Icon && (
              <div className={`${colors.iconBg} p-2 rounded-lg ${color === "red" ? "opacity-80" : "opacity-60"}`}>
                <Icon className="text-white" size={16} />
              </div>
            )}
          </div>

          {/* Main Value */}
          <div className="mb-4">
            <span className={`text-3xl font-bold ${colors.value} tracking-tight`}>
              {displayValue}
            </span>
          </div>

          {/* Growth Metrics: MoM and YoY side by side */}
          {(changeValue !== undefined || changeValueYoY !== undefined) && (
            <div className="flex items-center gap-3 mb-4 text-xs font-medium">
              {changeValue !== undefined && changeValue !== 0 && (
                <div className={`flex items-center gap-1 ${isUp ? "text-emerald-600" : isDown ? "text-red-600" : "text-gray-600"}`}>
                  <ChangeIcon size={12} />
                  <span>{changeValue > 0 ? "+" : ""}{changeValue.toFixed(1)}% MoM</span>
                </div>
              )}
              {changeValue !== undefined && changeValue !== 0 && changeValueYoY !== undefined && changeValueYoY !== 0 && (
                <span className="text-gray-300">•</span>
              )}
              {changeValueYoY !== undefined && changeValueYoY !== 0 && (
                <div className={`flex items-center gap-1 ${isUpYoY ? "text-emerald-600" : isDownYoY ? "text-red-600" : "text-gray-600"}`}>
                  <ChangeIconYoY size={12} />
                  <span>{changeValueYoY > 0 ? "+" : ""}{changeValueYoY.toFixed(1)}% YoY</span>
                </div>
              )}
            </div>
          )}

          {/* Trend Line at Bottom - Full Width */}
          {trendData.length > 0 && (
            <div className="w-full h-12 mt-4 -mx-6 -mb-6">
              <ResponsiveContainer width="100%" height="100%">
                {sparklineType === "line" ? (
                  <LineChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={
                        color === "red" 
                          ? "#ffffff" 
                          : color === "green" 
                          ? "#10b981" 
                          : color === "blue"
                          ? "#3b82f6"
                          : color === "purple"
                          ? "#8b5cf6"
                          : color === "amber"
                          ? "#f59e0b"
                          : isUp 
                          ? "#3b82f6" 
                          : isDown 
                          ? "#ef4444" 
                          : "#6b7280"
                      }
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                ) : (
                  <AreaChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id={`sparkline-gradient-${color}-${title}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={
                              color === "red" ? "#ffffff" 
                              : color === "green" ? "#10b981"
                              : color === "blue" ? "#3b82f6"
                              : color === "purple" ? "#8b5cf6"
                              : color === "amber" ? "#f59e0b"
                              : isUp ? "#3b82f6" 
                              : isDown ? "#ef4444" 
                              : "#6b7280"
                            } stopOpacity={color === "red" ? 0.3 : 0.2}/>
                            <stop offset="95%" stopColor={
                              color === "red" ? "#ffffff" 
                              : color === "green" ? "#10b981"
                              : color === "blue" ? "#3b82f6"
                              : color === "purple" ? "#8b5cf6"
                              : color === "amber" ? "#f59e0b"
                              : isUp ? "#3b82f6" 
                              : isDown ? "#ef4444" 
                              : "#6b7280"
                            } stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={
                            color === "red" ? "#ffffff" 
                            : color === "green" ? "#10b981"
                            : color === "blue" ? "#3b82f6"
                            : color === "purple" ? "#8b5cf6"
                            : color === "amber" ? "#f59e0b"
                            : isUp ? "#3b82f6" 
                            : isDown ? "#ef4444" 
                            : "#6b7280"
                          }
                          strokeWidth={2}
                          fill={`url(#sparkline-gradient-${color}-${title})`}
                          dot={false}
                        />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default enhanced layout
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
                {sparklineType === "line" ? (
                  <LineChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={color === "red" ? "#ffffff" : isUp ? "#3b82f6" : isDown ? "#ef4444" : "#6b7280"}
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                ) : (
                  <AreaChart data={sparklineData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`gradient-${color}-${title}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isUp ? "#10b981" : isDown ? "#ef4444" : "#6b7280"} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={isUp ? "#10b981" : isDown ? "#ef4444" : "#6b7280"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={isUp ? "#10b981" : isDown ? "#ef4444" : "#6b7280"}
                      strokeWidth={2.5}
                      fill={`url(#gradient-${color}-${title})`}
                      dot={false}
                    />
                  </AreaChart>
                )}
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
            {(changeValue !== undefined || changeValueYoY !== undefined || change) && (
              <div className="flex items-center gap-3 mt-3 text-xs font-medium">
                {changeValue !== undefined && changeValue !== 0 && (
                  <div className={`flex items-center gap-1 ${isUp ? "text-emerald-600" : isDown ? "text-red-600" : "text-gray-600"}`}>
                    <ChangeIcon size={12} />
                    <span>{changeValue > 0 ? "+" : ""}{changeValue.toFixed(1)}% MoM</span>
                  </div>
                )}
                {changeValue !== undefined && changeValue !== 0 && changeValueYoY !== undefined && changeValueYoY !== 0 && (
                  <span className="text-gray-300">•</span>
                )}
                {changeValueYoY !== undefined && changeValueYoY !== 0 && (
                  <div className={`flex items-center gap-1 ${directionYoY === "up" ? "text-emerald-600" : directionYoY === "down" ? "text-red-600" : "text-gray-600"}`}>
                    <ChangeIcon size={12} />
                    <span>{changeValueYoY > 0 ? "+" : ""}{changeValueYoY.toFixed(1)}% YoY</span>
                  </div>
                )}
                {change && !changeValue && !changeValueYoY && (
                  <div className={`flex items-center gap-2 text-sm font-semibold ${colors.change}`}>
                    <div className={`p-1.5 rounded-lg ${isUp ? "bg-emerald-100" : isDown ? "bg-red-100" : "bg-gray-100"}`}>
                      <ChangeIcon size={12} />
                    </div>
                    <span>{change}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPICard;
