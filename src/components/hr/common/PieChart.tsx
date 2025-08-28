"use client";
import { useMemo } from "react";

const PieChart = ({ data }: any) => {
  const total = useMemo(
    () => data.reduce((sum: any, item: any) => sum + item.value, 0),
    [data]
  );
  const gradientStops = useMemo(() => {
    let currentPercentage = 0;
    return data
      .map((item: any, index: any) => {
        const start = currentPercentage;
        currentPercentage += (item.value / total) * 100;
        const end = currentPercentage;
        return `${item.color} ${start}% ${end}%`;
      })
      .join(", ");
  }, [data, total]);

  return (
    <div className="relative w-40 h-40 rounded-full bg-gray-200">
      <div
        className="absolute inset-0 rounded-full"
        style={{ backgroundImage: `conic-gradient(${gradientStops})` }}
      ></div>
      <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center p-2">
        <span className="text-lg font-bold">500</span>
        <span className="text-sm text-gray-500">Total Staff</span>
      </div>
    </div>
  );
};

export default PieChart;
