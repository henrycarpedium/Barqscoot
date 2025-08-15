import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  Download,
  Search,
  Eye,
  MoreHorizontal,
} from "lucide-react";

const PaymentAnalytics = ({ dateRange }) => {
  const [filterIssues, setFilterIssues] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [amountRange, setAmountRange] = useState({ min: "", max: "" });
  const [dateRangeFilter, setDateRangeFilter] = useState({ start: "", end: "" });

  // Mock data for failed transactions
  const failedTransactions = [
    {
      id: "FT001",
      user: "John Doe",
      amount: "$15.50",
      method: "Credit Card",
      reason: "Insufficient funds",
      date: "11/5/2024, 10:00 PM",
      status: "failed",
    },
    {
      id: "FT002",
      user: "Sarah Smith",
      amount: "$8.75",
      method: "Credit Card",
      reason: "Payment declined",
      date: "11/5/2024, 9:45 PM",
      status: "failed",
    },
    {
      id: "FT003",
      user: "Mike Johnson", 
      amount: "$22.30",
      method: "Apple Pay",
      reason: "Network error",
      date: "11/5/2024, 9:30 PM",
      status: "pending",
    },
  ];

  const chargebacks = [
    { id: "CB001", amount: "$45.00", status: "pending", date: "11/4/2024" },
    { id: "CB002", amount: "$18.50", status: "resolved", date: "11/3/2024" },
  ];

  const refunds = [
    { id: "RF001", amount: "$12.00", status: "processed", date: "11/4/2024" },
    { id: "RF002", amount: "$25.50", status: "pending", date: "11/3/2024" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "failed":
        return "text-red-600 bg-red-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "processed":
      case "resolved":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Revenue</p>
              <p className="text-3xl font-bold">$47,892</p>
              <p className="text-green-100 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +15.3% vs last month
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Successful Payments</p>
              <p className="text-2xl font-bold text-green-600">98.2%</p>
              <p className="text-green-600 flex items-center mt-1">
                <CheckCircle className="h-4 w-4 mr-1" />
                2,847 transactions
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Failed Transactions</p>
              <p className="text-2xl font-bold text-red-600">1.8%</p>
              <p className="text-red-600 flex items-center mt-1">
                <XCircle className="h-4 w-4 mr-1" />
                52 failed payments
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Avg Transaction</p>
              <p className="text-2xl font-bold text-blue-600">$16.48</p>
              <p className="text-blue-600 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +2.1% vs last month
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>
      </div>

      {/* Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-blue-600" />
          Filter Issues
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Methods</option>
              <option value="credit-card">Credit Card</option>
              <option value="apple-pay">Apple Pay</option>
              <option value="google-pay">Google Pay</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Failure Reason
            </label>
            <select
              value={filterIssues}
              onChange={(e) => setFilterIssues(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Issues</option>
              <option value="insufficient-funds">Insufficient Funds</option>
              <option value="declined">Payment Declined</option>
              <option value="network-error">Network Error</option>
              <option value="expired-card">Expired Card</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={amountRange.min}
                onChange={(e) => setAmountRange({ ...amountRange, min: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={amountRange.max}
                onChange={(e) => setAmountRange({ ...amountRange, max: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRangeFilter.start}
                onChange={(e) => setDateRangeFilter({ ...dateRangeFilter, start: e.target.value })}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <input
                type="date"
                value={dateRangeFilter.end}
                onChange={(e) => setDateRangeFilter({ ...dateRangeFilter, end: e.target.value })}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Search className="h-4 w-4 mr-2" />
            Apply Filters
          </button>
          <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center">
            <RefreshCw className="h-4 w-4 mr-1" />
            Clear All Filters
          </button>
        </div>
      </motion.div>

      {/* Failed Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            Failed Transactions
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full">
              3 New
            </span>
          </h3>
          <button className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Failure Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {failedTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.user}
                    </div>
                    <div className="text-sm text-gray-500">{transaction.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.method}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-red-600">{transaction.reason}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Chargebacks and Refunds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chargebacks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <RefreshCw className="h-5 w-5 mr-2 text-orange-600" />
              Chargebacks
              <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                2 Pending
              </span>
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {chargebacks.map((chargeback) => (
                <div key={chargeback.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{chargeback.id}</div>
                    <div className="text-sm text-gray-500">{chargeback.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{chargeback.amount}</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(chargeback.status)}`}>
                      {chargeback.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Refunds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <RefreshCw className="h-5 w-5 mr-2 text-blue-600" />
              Refunds
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                1 Pending
              </span>
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {refunds.map((refund) => (
                <div key={refund.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{refund.id}</div>
                    <div className="text-sm text-gray-500">{refund.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{refund.amount}</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(refund.status)}`}>
                      {refund.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentAnalytics;
