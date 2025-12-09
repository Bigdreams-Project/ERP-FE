"use client";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
  trend?: {
    value: number;
    label: string;
  };
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  gradient,
  iconColor,
  trend,
}: StatCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border border-gray-100">
      {/* Gradient background overlay */}
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      {/* Animated border gradient */}
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 ${iconColor} rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={24} className="text-white" />
          </div>
          {trend && (
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-500">{trend.label}</div>
              <div className={`text-sm font-bold ${trend.value >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                {trend.value >= 0 ? "+" : ""}{trend.value}%
              </div>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;

