"use client";
import { DashboardInsight } from "@/types/dashboard/overview.interface";
import { AlertTriangle, CheckCircle, Info, TrendingUp, Sparkles } from "lucide-react";

interface InsightsPanelProps {
  insights: DashboardInsight[];
  maxItems?: number;
}

const InsightsPanel = ({ insights, maxItems = 5 }: InsightsPanelProps) => {
  const getIcon = (type: DashboardInsight["type"]) => {
    switch (type) {
      case "warning":
        return AlertTriangle;
      case "success":
        return CheckCircle;
      case "info":
        return Info;
      default:
        return Info;
    }
  };

  const getTypeStyles = (type: DashboardInsight["type"]) => {
    switch (type) {
      case "warning":
        return {
          bg: "bg-gradient-to-br from-amber-50 to-orange-50",
          border: "border-amber-300",
          iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
          icon: "text-amber-600",
          text: "text-amber-900",
          shadow: "shadow-amber-200/50",
        };
      case "success":
        return {
          bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
          border: "border-emerald-300",
          iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
          icon: "text-emerald-600",
          text: "text-emerald-900",
          shadow: "shadow-emerald-200/50",
        };
      case "info":
        return {
          bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
          border: "border-blue-300",
          iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
          icon: "text-blue-600",
          text: "text-blue-900",
          shadow: "shadow-blue-200/50",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-gray-50 to-gray-100",
          border: "border-gray-300",
          iconBg: "bg-gradient-to-br from-gray-500 to-gray-600",
          icon: "text-gray-600",
          text: "text-gray-900",
          shadow: "shadow-gray-200/50",
        };
    }
  };

  const displayedInsights = insights.slice(0, maxItems);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-md">
          <Sparkles className="text-white" size={18} />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Key Insights</h3>
      </div>
      <div className="space-y-4">
        {displayedInsights.length > 0 ? (
          displayedInsights.map((insight, index) => {
            const Icon = getIcon(insight.type);
            const styles = getTypeStyles(insight.type);
            return (
              <div
                key={index}
                className={`${styles.bg} ${styles.border} border-2 rounded-xl p-4 flex items-start gap-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${styles.shadow}`}
              >
                <div className={`${styles.iconBg} p-2.5 rounded-lg shadow-md flex-shrink-0`}>
                  <Icon size={18} className="text-white" />
                </div>
                <div className="flex-grow">
                  <p className={`text-sm font-semibold ${styles.text} mb-1`}>
                    {insight.message}
                  </p>
                  {insight.value !== undefined && (
                    <p className={`text-xs ${styles.text} opacity-75 font-medium`}>
                      Value: {insight.value.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Sparkles size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No insights available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;
