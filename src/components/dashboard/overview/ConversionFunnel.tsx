"use client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Filter } from "lucide-react";

interface ConversionFunnelProps {
  data: {
    name: string;
    value: number;
  }[];
  title?: string;
}

const ConversionFunnel = ({
  data,
  title = "Lead Conversion Funnel",
}: ConversionFunnelProps) => {
  // Generate gradient colors for funnel stages
  const funnelColors = [
    "#8b5cf6", // purple - leads
    "#3b82f6", // blue - contacted
    "#f59e0b", // amber - deposited
    "#10b981", // emerald - enrolled
  ];

  return (
    <div className="group relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-md">
            <Filter className="text-white" size={18} />
          </div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
            >
              <XAxis type="number" stroke="#9ca3af" fontSize={11} tick={{ fill: "#6b7280" }} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#9ca3af"
                fontSize={11}
                width={70}
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
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={funnelColors[index % funnelColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[280px] text-gray-400">
            <div className="text-center">
              <Filter size={48} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No conversion data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversionFunnel;
