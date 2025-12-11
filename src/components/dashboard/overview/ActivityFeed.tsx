"use client";
import { ActivityItem } from "@/types/dashboard/overview.interface";
import {
  UserPlus,
  GraduationCap,
  DollarSign,
  Calendar,
  Filter,
  Clock,
} from "lucide-react";
import { useState } from "react";

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
}

const ActivityFeed = ({ activities, maxItems = 10 }: ActivityFeedProps) => {
  const [filter, setFilter] = useState<
    "all" | "enrollment" | "payment" | "lead" | "batch"
  >("all");

  const getIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "enrollment":
        return GraduationCap;
      case "payment":
        return DollarSign;
      case "lead":
        return UserPlus;
      case "batch":
        return Calendar;
      default:
        return Calendar;
    }
  };

  const getTypeStyles = (type: ActivityItem["type"]) => {
    switch (type) {
      case "enrollment":
        return {
          bg: "bg-gradient-to-br from-blue-500 to-indigo-600",
          border: "border-blue-200",
          text: "text-blue-800",
        };
      case "payment":
        return {
          bg: "bg-gradient-to-br from-emerald-500 to-teal-600",
          border: "border-emerald-200",
          text: "text-emerald-800",
        };
      case "lead":
        return {
          bg: "bg-gradient-to-br from-purple-500 to-violet-600",
          border: "border-purple-200",
          text: "text-purple-800",
        };
      case "batch":
        return {
          bg: "bg-gradient-to-br from-amber-500 to-orange-600",
          border: "border-amber-200",
          text: "text-amber-800",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-gray-500 to-gray-600",
          border: "border-gray-200",
          text: "text-gray-800",
        };
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredActivities =
    filter === "all"
      ? activities
      : activities.filter((activity) => activity.type === filter);

  const displayedActivities = filteredActivities.slice(0, maxItems);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md">
            <Clock className="text-white" size={18} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value as
                  | "all"
                  | "enrollment"
                  | "payment"
                  | "lead"
                  | "batch"
              )
            }
            className="text-xs border-2 border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          >
            <option value="all">All</option>
            <option value="enrollment">Enrollments</option>
            <option value="payment">Payments</option>
            <option value="lead">Leads</option>
            <option value="batch">Batches</option>
          </select>
        </div>
      </div>
      <div className="space-y-3 max-h-[450px] overflow-y-auto custom-scroll">
        {displayedActivities.length > 0 ? (
          displayedActivities.map((activity, index) => {
            const Icon = getIcon(activity.type);
            const styles = getTypeStyles(activity.type);
            return (
              <div
                key={`${activity.id}-${index}`}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50/30 transition-all duration-200 group border border-transparent hover:border-gray-200"
              >
                <div
                  className={`flex-shrink-0 p-3 ${styles.bg} rounded-xl shadow-md group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon size={18} className="text-white" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                    {activity.title}
                  </p>
                  {activity.meta && (
                    <p className="text-xs text-gray-500 mb-2">{activity.meta}</p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>{formatTimeAgo(activity.date)}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Clock size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
