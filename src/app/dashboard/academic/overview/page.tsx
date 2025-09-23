"use client";
import AcademicStatCard from "@/components/academic/cards/AcademicStatCard.card";
import ActivityItem from "@/components/academic/cards/ActivityItem.card";
import StatCard from "@/components/academic/cards/StatCard.card";
import { mockData } from "@/data/mock/academic.data";
import { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Overview() {
  const [showPicker, setShowPicker] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [displayRange, setDisplayRange] = useState("");
  const [insights, setInsights] = useState(mockData.insights);

  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setRange([ranges.selection]);
    setDisplayRange(
      `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
    );

    const filteredInsights = mockData.insights.filter(
      (_, index) => index % 2 === 0
    );
    setInsights(filteredInsights);

    setShowPicker(false);
  };

  useEffect(() => {
    if (range[0].startDate && range[0].endDate) {
      console.log(
        `Date range selected: From ${range[0].startDate} to ${range[0].endDate}`
      );
    }
  }, [range]);

  return (
    <div className="min-h-screen bg-white text-gray-100 p-4 md:py-8 md:px-3 font-inter">
      <div className="max-w-7xl mx-auto">
        {/* Overview Header */}
        <div className="overview-gradient p-6 rounded-xl shadow-sm shadow-gray-400 mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-white text-4xl font-extrabold">Academic Overview</h1>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome, John Doe!
            </h1>
            <p className="text-gray-300 mt-1">
              Here's what's happening today across your academic operations.
            </p>
            <p className="text-sm font-medium text-white mt-2">
              Role: Regional Manager
            </p>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {mockData.stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts & Latest Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white shadow-sm shadow-gray-400 p-6 rounded-xl flex flex-col">
            <h2 className="text-lg font-bold mb-4 text-[#242524FF]">
              Enrollment Funnel
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={mockData.funnel}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "#4b5563",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#9ca3af" }}
                    itemStyle={{ color: "#e5e7eb" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6366f1"
                    fill="#4f46e5"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Latest Insights */}
          <div className="bg-white p-6 rounded-xl shadow-sm shadow-gray-400 relative">
            <h2 className="text-lg font-bold mb-4 text-[#242524FF]">
              Latest Insights
            </h2>

            {/* Date range */}
            <div className="mb-4">
              <input
                type="text"
                readOnly
                value={displayRange || "Select a date range"}
                onClick={() => setShowPicker(!showPicker)}
                className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date Picker */}
            {showPicker && (
              <div className="absolute right-0 z-50 bg-white shadow-lg rounded-lg p-2">
                <DateRangePicker
                  ranges={range}
                  onChange={handleSelect}
                  moveRangeOnFirstSelection={false}
                  className="text-black"
                />
              </div>
            )}

            {/* Insights List */}
            <ul className="space-y-4 mt-4">
              {insights.map((insight, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-[#8C8D8BFF]"
                >
                  {insight.icon}
                  <span>{insight.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {mockData.academicStats.map((stat, index) => (
            <AcademicStatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {mockData.courseStats.map((stat, index) => (
              <AcademicStatCard key={index} {...stat} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm shadow-gray-400">
          <h2 className="text-lg font-bold mb-4 text-[#242524FF]">
            Recent Activity
          </h2>
          <div className="space-y-6">
            {mockData.recentActivity.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
