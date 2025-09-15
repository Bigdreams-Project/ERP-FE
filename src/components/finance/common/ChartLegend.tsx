"use client";
import { useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { getPieChartBgColor } from "@/components/academic/utils/backgrounds";

interface ChartLegendProps {
  data: { name: string; value: string | number; color: string }[];
}

const parseCurrencyToNumber = (v: string | number): number => {
  if (typeof v === "number") return Math.round(v);
  const s = String(v).trim();
  if (!s) return 0;

  // Remove currency symbols and commas, keep K/M suffixes and dots
  let cleaned = s.replace(/[^0-9.kKmM.]/g, "");

  let multiplier = 1;
  if (/[mM]$/.test(cleaned)) {
    multiplier = 1_000_000;
    cleaned = cleaned.replace(/[mM]$/, "");
  } else if (/[kK]$/.test(cleaned)) {
    multiplier = 1_000;
    cleaned = cleaned.replace(/[kK]$/, "");
  }

  const num = parseFloat(cleaned);
  if (isNaN(num)) return 0;
  return Math.round(num * multiplier);
};

const formatCurrency = (v: number) =>
  // Format with comma separators. You can replace with Intl if you want currency symbol
  v.toLocaleString();

const ChartLegend = ({ data }: ChartLegendProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null
  );

  // map data to chart-friendly form and keep original display value
  const chartData = data.map((item) => {
    const numeric = parseCurrencyToNumber(item.value);
    return {
      title: item.name,
      value: numeric,
      displayValue: item.value,
      color: getPieChartBgColor(item.color),
    };
  });

  const total = chartData.reduce((sum, it) => sum + it.value, 0);

  // handlers
  const handleSliceEnter = (evt: React.MouseEvent, index: number) => {
    setHovered(index);
    setTooltipPos({ x: evt.clientX, y: evt.clientY });
  };

  const handleMouseMove = (evt: React.MouseEvent) => {
    if (hovered !== null) {
      setTooltipPos({ x: evt.clientX, y: evt.clientY });
    }
  };

  const handleSliceLeave = () => {
    setHovered(null);
    setTooltipPos(null);
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 relative">
      <ul className="space-y-2 text-sm text-gray-700 font-medium">
        {data.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>

      <div
        className="relative"
        style={{ height: 200, width: 200 }}
        onMouseMove={handleMouseMove}
      >
        <PieChart
          data={chartData.map((d) => ({
            title: d.title,
            value: d.value,
            color: d.color,
          }))}
          lineWidth={50}
          animate
          segmentsStyle={{ cursor: "pointer" }}
          onMouseOver={(evt: any, index: number) =>
            handleSliceEnter(evt, index)
          }
          onMouseOut={handleSliceLeave}
          style={{ height: "200px", width: "200px" }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 pointer-events-none">
          <span className="text-sm font-bold">Total Revenue</span>
          <span className="text-sm text-gray-500">
            ₦{formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Bubble tooltip */}
      {hovered !== null && tooltipPos && (
        <div
          className="fixed z-50 pointer-events-none bg-gray-900 text-white text-xs px-3 py-1 rounded-md shadow-lg transform -translate-y-6"
          style={{
            left: tooltipPos.x + 12,
            top: tooltipPos.y - 8,
            whiteSpace: "nowrap",
          }}
        >
          <strong className="block text-[11px]">
            {chartData[hovered].title}
          </strong>
          <span className="block text-[11px]">
            {String(data[hovered].value)}
          </span>
        </div>
      )}
    </div>
  );
};

export default ChartLegend;
