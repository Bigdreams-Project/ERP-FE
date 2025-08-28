"use client";

import PieChart from "@/components/hr/common/PieChart";
import {
  leaveReasons,
  pendingActions,
  recentActivity,
  staffDistribution,
  staffStats,
  systemActions,
  upcomingAlerts,
} from "@/data/mock/hr.data";

export default function Overview() {
  return (
    <div className="flex bg-gray-100 font-sans text-gray-800 min-h-screen">
      <main className="flex-1 p-8">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">HR & Staff: Overview</h1>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700 transition-colors">
              + New Staff
            </button>
            <button className="px-4 py-2 bg-white text-gray-800 text-sm font-medium rounded-lg shadow hover:bg-gray-100 transition-colors">
              + New Leave Request
            </button>
            <button className="px-4 py-2 bg-white text-gray-800 text-sm font-medium rounded-lg shadow hover:bg-gray-100 transition-colors">
              <span className="mr-2">View All Staff</span>
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Staff Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          {staffStats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-md">
              <div className="text-sm font-semibold text-gray-500 mb-2">
                {stat.title}
              </div>
              <div className={`text-3xl font-bold ${stat.color}`}>
                {stat.count}
              </div>
            </div>
          ))}
        </div>

        {/* Staff Distribution and Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-md flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4">Staff Distribution</h3>
              <div className="space-y-2">
                {staffDistribution.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm text-gray-700"
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-gray-500">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0">
              <PieChart data={staffDistribution} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md grid grid-cols-2 gap-4">
            <h3 className="col-span-2 text-lg font-semibold mb-2">
              Key Metrics
            </h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-500 font-medium">
                Employee Attrition Rate
              </div>
              <div className="text-lg font-bold">12.5%</div>
              <div className="text-xs text-gray-500">vs last month</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500 font-medium">
                Average Time to Hire
              </div>
              <div className="text-lg font-bold">32 Days</div>
              <div className="text-xs text-gray-500">
                vs last year's average
              </div>
            </div>
            <div className="col-span-2 space-y-2">
              <div className="text-sm text-gray-500 font-medium">
                Training Completion
              </div>
              <div className="text-lg font-bold">88%</div>
              <div className="text-xs text-gray-500">
                of staff completed mandatory training
              </div>
            </div>
          </div>
        </div>

        {/* Pending Actions and System-Assisted Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Pending Actions</h3>
            <ul className="space-y-3">
              {pendingActions.map((action, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span>{action.text}</span>
                  <span className="px-2 py-1 bg-gray-200 rounded-full text-xs">
                    {action.type}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              System-Assisted Actions
            </h3>
            <ul className="space-y-3">
              {systemActions.map((action, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span>{action.text}</span>
                  <span className="px-2 py-1 bg-gray-200 rounded-full text-xs">
                    {action.type}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Upcoming Alerts and Top Reasons for Leave */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Upcoming Alerts</h3>
            <ul className="space-y-4">
              {upcomingAlerts.map((alert, index) => (
                <li key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">{alert.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{alert.title}</div>
                    <div className="text-xs text-gray-500">{alert.details}</div>
                  </div>
                  <button className="px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-medium rounded-lg">
                    {alert.action}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Top Reasons for Leave
            </h3>
            <ul className="space-y-2">
              {leaveReasons.map((reason, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-700">{reason.reason}</span>
                  <div className="w-16 h-1 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: reason.reason.match(/\d+/)![0] + "%" }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Event
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentActivity.map((activity, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {activity.event}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
