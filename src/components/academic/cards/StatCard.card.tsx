import { StatCardProps } from "@/app/dashboard/academic/overview/types";
import { TrendingDown, TrendingUp } from "lucide-react";

const StatCard = ({
  title,
  value,
  change,
  direction,
  icon: Icon,
  changeText,
  subText,
  theme,
}: StatCardProps) => {
  const isUp = direction === "up";
  const changeColor = isUp ? "text-green-500" : "text-red-500";
  const ChangeIcon = isUp ? TrendingUp : TrendingDown;

  return (
    <div
      className={`bg-white dark:bg-gray-800 p-6 border-1 border-gray-700 dark:border-gray-600 rounded-xl shadow-sm shadow-gray-400 dark:shadow-gray-900 transition-all duration-300 hover:shadow-2xl`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-400">{title}</h3>
        {Icon && <Icon className="text-gray-500 dark:text-gray-400" size={20} />}
      </div>
      <div className="flex items-end space-x-2">
        <span className="text-3xl font-bold text-[#242524FF] dark:text-gray-100">{value}</span>
        {change && (
          <div
            className={`flex items-center text-sm font-medium ${changeColor}`}
          >
            <ChangeIcon size={16} className="mr-1" />
            <span>{change}%</span>
          </div>
        )}
      </div>
      {subText && <p className="text-gray-400 dark:text-gray-400 text-xs mt-1">{subText}</p>}
      {changeText && <p className="text-gray-400 dark:text-gray-400 text-xs mt-1">{changeText}</p>}
    </div>
  );
};

export default StatCard;
