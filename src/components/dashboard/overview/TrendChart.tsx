"use client";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { TrendDataPoint } from "@/types/dashboard/overview.interface";
import { TrendingUp } from "lucide-react";

interface TrendChartProps {
  data: TrendDataPoint[];
  dataKey: "revenue" | "billing" | "enrollments" | "payments";
  title: string;
  color?: string;
  formatValue?: (value: number) => string;
}

const TrendChart = ({
  data,
  dataKey,
  title,
  color = "#3b82f6",
  formatValue = (val) => val.toLocaleString(),
}: TrendChartProps) => {
  const chartData = data.map((point) => ({
    date: new Date(point.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    value: point[dataKey],
  }));

  return (
    <div className="group relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md">
              <TrendingUp className="text-white" size={18} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} margin={{ top: 10, right: 15, left: 0, bottom: 10 }}>
            <defs>
              <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                <stop offset="50%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6b7280" }}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatValue}
              tick={{ fill: "#6b7280" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "2px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                padding: "12px",
              }}
              formatter={(value: number) => formatValue(value)}
              labelStyle={{ color: "#374151", fontWeight: "bold", marginBottom: "8px" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={3}
              fill={`url(#gradient-${dataKey})`}
              dot={false}
              activeDot={{ r: 6, fill: color, strokeWidth: 2, stroke: "white" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
