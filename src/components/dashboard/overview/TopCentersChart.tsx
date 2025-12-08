"use client";
import { TopPerformingCenter } from "@/types/dashboard/overview.interface";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Trophy } from "lucide-react";

interface TopCentersChartProps {
  data: TopPerformingCenter[];
  dataKey: "revenue" | "enrollments";
  title: string;
  color?: string;
  formatValue?: (value: number) => string;
  maxItems?: number;
}

const TopCentersChart = ({
  data,
  dataKey,
  title,
  color = "#3b82f6",
  formatValue,
  maxItems = 5,
}: TopCentersChartProps) => {
  // Default formatter based on dataKey
  const defaultFormatter = dataKey === "enrollments" 
    ? (val: number) => val.toLocaleString()
    : (val: number) => `₦${val.toLocaleString()}`;
  
  const valueFormatter = formatValue || defaultFormatter;

  const chartData = data
    .slice(0, maxItems)
    .map((center, index) => ({
      name: center.center.length > 15 ? center.center.substring(0, 15) + "..." : center.center,
      value: center[dataKey],
      fullName: center.center,
      rank: index + 1,
    }))
    .sort((a, b) => b.value - a.value);

  // Generate gradient colors for bars
  const gradientColors = [
    "#10b981", // emerald
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#f59e0b", // amber
    "#ef4444", // red
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500 rounded-lg">
          <Trophy className="text-white" size={18} />
        </div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart 
            data={chartData} 
            margin={{ 
              top: 10, 
              right: 15, 
              left: dataKey === "revenue" ? 70 : 50, 
              bottom: 20 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={70}
              tick={{ fill: "#6b7280" }}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={valueFormatter}
              tick={{ fill: "#6b7280" }}
              width={dataKey === "revenue" ? 65 : 45}
            />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  padding: "12px",
                }}
                formatter={(value: number) => valueFormatter(value)}
                labelFormatter={(label, payload) =>
                  payload?.[0]?.payload?.fullName || label
                }
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={gradientColors[index % gradientColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[280px] text-gray-400">
            <div className="text-center">
              <Trophy size={48} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No data available</p>
            </div>
          </div>
        )}
    </div>
  );
};

export default TopCentersChart;
