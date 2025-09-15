import PaymentInvoiceTable from "@/components/finance/tables/PaymentInvoice.table";
import { invoices } from "@/data/mock/finance.data";

const PaymentInvoicesContent = () => {
  return (
    <div className="bg-white text-white min-h-screen font-sans flex flex-col">
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-black mb-8">
          Payments & Invoices
        </h1>

        {/* Filter Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Filter Records
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">
                Student
              </label>
              <select className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>All Students</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">
                Course
              </label>
              <select className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>All Courses</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-400 mb-1">
                Status
              </label>
              <select className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>All Statuses</option>
              </select>
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-medium text-gray-400 mb-1">
                Invoice Date Range
              </label>
              <input
                type="text"
                className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Select date range"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mb-6">
          <button className="px-6 py-2 border border-gray-300 text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-sm flex items-center gap-2">
            ₦ <span>Record Payment</span>
          </button>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14"></path>
            </svg>
            Generate Invoice
          </button>
        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded-2xl shadow-lg overflow-x-auto custom-scroll">
          <PaymentInvoiceTable
            payments={invoices}
            searchQuery=""
            filterOptions={{}}
          />
        </div>
      </main>
    </div>
  );
};

export default PaymentInvoicesContent;
