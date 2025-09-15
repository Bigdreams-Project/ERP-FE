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
import {
  CalendarDays,
  CheckCircle,
  Users
} from "lucide-react";
import Image from "next/image";

export default function Overview() {
  return (
    <div className="flex bg-white font-sans text-gray-800 min-h-screen">
      <main className="flex-1 p-8">
        {/* Overview Header */}
        <div className="overview-gradient p-6 rounded-xl shadow-sm shadow-gray-400 mb-6">
          <h1 className="text-2xl font-bold text-white">Welcome, John Doe!</h1>
          <p className="text-gray-300 mt-1">
            Here's what's happening today across your human resource operations.
          </p>
          <p className="text-sm font-medium text-white mt-2">
            Role: Regional Manager
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow hover:bg-indigo-700 transition-colors">
              <Users size={15} /> <span>New Staff</span>
            </button>
            <button className="px-4 py-2 flex items-center gap-2 bg-white text-gray-800 text-sm font-medium rounded-lg shadow hover:bg-gray-100 transition-colors">
              <CalendarDays size={15} /> <span>New Leave Request</span>
            </button>
            <button className="px-4 py-2 flex items-center gap-2 bg-white text-gray-800 text-sm font-medium rounded-lg shadow hover:bg-gray-100 transition-colors">
              <Users size={15} />
              <span className="mr-2">View All Staff</span>
            </button>
          </div>
        </div>

        {/* Staff Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6 text-rose-600">
          {staffStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm shadow-gray-400 hover:shadow-2xl"
            >
              <div className="text-sm font-semibold text-gray-500 flex justify-between mb-2">
                {stat.title} {stat.icon}
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
              <div className="text-2xl font-bold">12.5%</div>
              <div className="text-xs text-gray-500">vs last month</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-500 font-medium">
                Average Time to Hire
              </div>
              <div className="text-2xl font-bold">32 Days</div>
              <div className="text-xs text-gray-500">
                vs last year's average
              </div>
            </div>
            <div className="col-span-2 space-y-2">
              <div className="text-sm text-gray-500 font-medium">
                Training Completion
              </div>
              <div className="text-2xl font-bold">88%</div>
              <div className="text-xs text-gray-500">
                of staff completed mandatory training
              </div>
            </div>
          </div>
        </div>

        {/* Pending Actions and System-Assisted Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Pending Actions */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Pending Actions</h3>
            <ul className="space-y-4">
              {pendingActions.map((action, index) => (
                <li
                  key={index}
                  className="flex flex-col border-b last:border-b-0 py-2"
                >
                  <div className="flex justify-between">
                    <div className="w-2/6">
                      <div className="flex-1 text-sm text-gray-700 font-bold">
                        {action.text}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                        <Image
                          src={action.image}
                          alt="action"
                          width={25}
                          height={25}
                          className="rounded-full object-cover"
                        />
                        {action.user}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {action.actions.map((btn, btnIndex) => (
                        <button
                          key={btnIndex}
                          className="w-fit h-8 px-4 py-2 flex items-center gap-2 bg-white text-gray-800 text-sm font-medium rounded-md shadow shadow-gray-400 hover:bg-gray-100 transition-colors"
                        >
                          {btn.icon} {btn.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* System-Assisted Actions */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              System-Assisted Actions
            </h3>
            <ul className="space-y-6">
              {systemActions.map((action, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-2 text-sm text-gray-700"
                >
                  <CheckCircle size={18} className="text-black" />
                  <span className="font-bold">{action}</span>
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
                    <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                      <Image
                        src={alert.user.image}
                        alt="action"
                        width={25}
                        height={25}
                        className="rounded-full object-cover"
                      />
                      {alert.user.name}
                    </div>
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
            <ul className="space-y-6">
              {leaveReasons.map((reason, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex items-center space-x-2">
                    {reason.icon}
                    <span className="text-gray-700 font-bold">
                      {reason.reason}
                    </span>
                  </div>
                  <div className="text-gray-500 font-medium">
                    {reason.percentage}
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
                    Staff
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
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {activity.event}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                        <Image
                          src={activity.staff.image}
                          alt="action"
                          width={25}
                          height={25}
                          className="rounded-full object-cover"
                        />
                        {activity.staff.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.date}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
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
