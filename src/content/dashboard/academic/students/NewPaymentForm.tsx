import { useState } from "react";
import Card from "./Card";

const NewPaymentForm = () => {
  const [formData, setFormData] = useState({
    amount: "0.00",
    paymentMethod: "Bank Transfer",
    date: new Date().toISOString().split("T")[0],
    transactionId: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRecordPayment = () => {
    console.log("Recording Payment:", formData);
    alert(
      `Payment Recorded: ${formData.amount} via ${formData.paymentMethod}. Check console for details.`
    );
  };

  return (
    <Card title="New Payment">
      <div className="space-y-4">
        {/* Amount Received */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount Received
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg font-bold"
            placeholder="0.00"
          />
        </div>

        {/* Payment Method */}
        <div>
          <label
            htmlFor="paymentMethod"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
          >
            <option>Bank Transfer</option>
            <option>POS</option>
            <option>Cash</option>
            <option>Online Payment Gateway</option>
          </select>
        </div>

        {/* Date of Payment */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date of Payment
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Transaction ID */}
        <div>
          <label
            htmlFor="transactionId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Transaction ID
          </label>
          <input
            type="text"
            id="transactionId"
            name="transactionId"
            value={formData.transactionId}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter transaction reference"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleRecordPayment}
          className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out shadow-md"
        >
          Record Payment
        </button>
      </div>
    </Card>
  );
};

export default NewPaymentForm;