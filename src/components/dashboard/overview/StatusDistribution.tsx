"use client";
import { PaymentStatusDistribution } from "@/types/dashboard/overview.interface";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { CreditCard } from "lucide-react";

interface StatusDistributionProps {
  data: PaymentStatusDistribution;
  title?: string;
}

const StatusDistribution = ({
  data,
  title = "Payment Status Distribution",
}: StatusDistributionProps) => {
  const chartData = [
    { name: "Paid", value: data.paid, color: "#10b981" },
    { name: "Pending", value: data.pending, color: "#f59e0b" },
    { name: "Legacy", value: data.overdue, color: "#ef4444" }, // Using overdue field for legacy
  ].filter((item) => item.value > 0);

  const total = data.paid + data.pending + data.overdue;

  return (
    <div className="group relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100/50 to-emerald-100/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-md">
            <CreditCard className="text-white" size={18} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
        {total > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  percent && percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ""
                }
                outerRadius={90}
                innerRadius={50}
                fill="#8884d8"
                dataKey="value"
                stroke="white"
                strokeWidth={3}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  padding: "12px",
                }}
                formatter={(value: number) => `₦${value.toLocaleString()}`}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ paddingTop: "20px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[280px] text-gray-400">
            <div className="text-center">
              <CreditCard size={48} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No payment data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusDistribution;
