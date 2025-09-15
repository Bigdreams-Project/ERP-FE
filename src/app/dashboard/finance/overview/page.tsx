"use client";
import ChartLegend from "@/components/finance/common/ChartLegend";
import IconButton from "@/components/finance/common/IconButton";
import TopPerformingCenter from "@/components/finance/TopPerformingCenter";
import {
  expensesDistribution,
  franchisePayments,
  kpiData,
  mainMetrics,
  overduePayments,
  revenueDistribution,
  topCenters,
  topPerformingCenters,
} from "@/data/mock/finance.data";
import { Plus } from "lucide-react";
import { BiHomeAlt2 } from "react-icons/bi";
import { IoDocumentAttachOutline } from "react-icons/io5";

export default function Overview() {
  return (
    <div className="flex bg-white font-sans text-gray-800">
      <main className="flex-1 py-8 px-3">
        {/* Header */}
        <div className="overview-gradient rounded-2xl p-6 text-white mb-6 shadow-md">
          <h1 className="text-xl font-bold">Welcome, John Doe</h1>
          <p className="text-sm font-medium">
            Have a great morning today, let's dive into your financial
            operations.
          </p>
          <p className="text-xs mt-1">Role: COO/HQ Admin</p>
        </div>

        <div className="flex justify-end space-x-4 my-4">
          <IconButton
            icon={<Plus size={17} />}
            text="Record Payment"
            textColor="text-white"
            bgColor="bg-action-button"
            primary={true}
          />
          <IconButton
            icon={<BiHomeAlt2 size={17} />}
            text="Generate Payroll"
            textColor="text-gray-800"
            bgColor="bg-white"
          />
          <IconButton
            icon={<IoDocumentAttachOutline size={17} />}
            text="Export Full Report"
            textColor="text-gray-800"
            bgColor="bg-white"
          />
        </div>

        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {kpiData.map((kpi, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm shadow-gray-400 transition-all duration-300 hover:shadow-2xl flex flex-col justify-between"
            >
              <div className="text-sm font-semibold text-gray-500 mb-2">
                {kpi.title}
              </div>
              <div className="text-4xl font-bold mb-1">{kpi.value}</div>
              <div
                className={`text-xs font-medium ${
                  kpi.trend === "positive"
                    ? "text-emerald-500"
                    : kpi.trend === "negative"
                    ? "text-rose-500"
                    : "text-gray-500"
                }`}
              >
                {kpi.description}
              </div>
            </div>
          ))}
        </div>

        {/* Main Metrics (Revenue, Expenses, Profit, Cash Flow) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {mainMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm shadow-gray-400 transition-all duration-300 hover:shadow-2xl"
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className={`w-3 h-3 rounded-full ${metric.color}`}></span>
                <div className="text-sm font-medium text-gray-500">
                  {metric.title}
                </div>
              </div>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-sm text-gray-500">{metric.trend}</div>
            </div>
          ))}
        </div>

        {/* Charts and Top Centers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Revenue Distribution */}
          <div className="bg-white p-6 rounded-2xl shadow-sm shadow-gray-400 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-lg font-semibold mb-2">
              Revenue Distribution by Center
            </h3>
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span>18/12/2024 - 18/12/2024</span>
            </div>
            <div className="flex items-center space-x-4">
              <ChartLegend data={revenueDistribution} />
            </div>
          </div>

          {/* Expenses Distribution */}
          <div className="bg-white p-6 rounded-2xl shadow-sm shadow-gray-400 transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-lg font-semibold mb-2">
              Expenses Distribution by Center
            </h3>
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span>18/12/2024 - 18/12/2024</span>
            </div>
            <div className="flex items-center space-x-4">
              <ChartLegend data={expensesDistribution} />
            </div>
          </div>

          {/* Top Performing Centers */}
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm shadow-gray-400 transition-all duration-300 hover:shadow-2xl border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Top Performing Centers
            </h2>
            <ul className="space-y-4">
              {topPerformingCenters.map((centerData, index) => (
                <TopPerformingCenter
                  key={centerData.id}
                  number={centerData.id}
                  name={centerData.centerName}
                  percentage={centerData.score}
                  status={centerData.status}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* Overdue Payments */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4 flex justify-between items-center">
            Overdue Payments
            <span className="text-sm text-indigo-600 font-medium cursor-pointer">
              View All
            </span>
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Student
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Course
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Center
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Due Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {overduePayments.map((payment, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.student}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.center}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-rose-500 font-semibold">
                      {payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Remind
                      </a>
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Receipt
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Franchise Payments Due */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex justify-between items-center">
            Franchise Payments Due
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Center
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Due Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {franchisePayments.map((payment, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.center}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === "Paid"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        HQ Reminder
                      </a>
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Upload Receipt
                      </a>
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
