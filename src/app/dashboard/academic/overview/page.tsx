"use client";

import AcademicStatCard from "@/components/academic/cards/AcademicStatCard.card";
import ActivityItem from "@/components/academic/cards/ActivityItem.card";
import StatCard from "@/components/academic/cards/StatCard.card";
import { mockData } from "@/data/mock/academic.data";
import { ArrowRight } from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Overview() {
  return (
    <div className="min-h-screen bg-white text-gray-100 p-4 md:p-8 font-inter">
      <div className="max-w-7xl mx-auto">
        {/* Overview Header */}
        <div className="overview-gradient p-6 rounded-xl shadow-sm shadow-gray-400 mb-6">
          <h1 className="text-2xl font-bold text-white">Welcome, John Doe!</h1>
          <p className="text-gray-300 mt-1">
            Here's what's happening today across your academic operations.
          </p>
          <p className="text-sm font-medium text-white mt-2">
            Role: Regional Manager
          </p>
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
          <div className="lg:col-span-2 bg-white border border-gray-300 shadow-sm shadow-gray-400 p-6 rounded-xl flex flex-col">
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
          <div className="bg-white p-6 rounded-xl shadow-sm shadow-gray-400 border border-slate-700">
            <h2 className="text-lg font-bold mb-4 text-[#242524FF]">
              Latest Insights
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start text-sm text-[#8C8D8BFF]">
                <span>Enrollment rate increased by 5% in Q3.</span>
              </li>
              {mockData.insights.map((insight, index) => (
                <li
                  key={index}
                  className="flex items-start text-sm text-[#8C8D8BFF]"
                >
                  <ArrowRight
                    size={16}
                    className="text-indigo-400 flex-shrink-0 mr-3 mt-1"
                  />
                  <span>{insight}</span>
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
