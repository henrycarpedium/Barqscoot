// src/components/reports/EnhancedRevenueReports.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { scooterService } from "../../services/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  RefreshCw,
  FileText,
  Filter,
  Eye,
} from "lucide-react";
import PropTypes from "prop-types";

const EnhancedRevenueReports = ({ dateRange }) => {
  const [viewType, setViewType] = useState("overview");
  const [reportPeriod, setReportPeriod] = useState("daily");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("all");
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [issuesFilters, setIssuesFilters] = useState({
    paymentMethod: "all",
    failureReason: "all",
    amountRange: { min: "", max: "" },
    dateRange: { start: "", end: "" }
  });
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [dateFilters, setDateFilters] = useState({
    startDate: dateRange?.start || "",
    endDate: dateRange?.end || "",
  });

  // Fetch revenue data from API
  const {
    data: revenueData,
    refetch: refetchRevenue,
  } = useQuery({
    queryKey: ["revenue-reports", reportPeriod, dateFilters, selectedPaymentMethod],
    queryFn: async () => {
      try {
        const response = await scooterService.getRevenueReports({
          period: reportPeriod,
          startDate: dateFilters.startDate,
          endDate: dateFilters.endDate,
          paymentMethod: selectedPaymentMethod !== 'all' ? selectedPaymentMethod : undefined,
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        return mockRevenueData;
      }
    },
  });

  // Fetch payment breakdown
  const { data: paymentBreakdown } = useQuery({
    queryKey: ["payment-breakdown", dateFilters, selectedPaymentMethod],
    queryFn: async () => {
      try {
        const response = await scooterService.getPaymentBreakdown({
          startDate: dateFilters.startDate,
          endDate: dateFilters.endDate,
          paymentMethod: selectedPaymentMethod !== 'all' ? selectedPaymentMethod : undefined,
        });
        return response.data;
      } catch {
        return mockPaymentData;
      }
    },
  });

  // Fetch failed transactions
  const { data: failedTransactions } = useQuery({
    queryKey: ["failed-transactions", dateFilters],
    queryFn: async () => {
      try {
        const response = await scooterService.getFailedTransactions({
          startDate: dateFilters.startDate,
          endDate: dateFilters.endDate,
        });
        return response.data;
      } catch {
        return mockFailedTransactions;
      }
    },
  });

  // Fetch chargebacks
  const { data: chargebacks } = useQuery({
    queryKey: ["chargebacks", dateFilters],
    queryFn: async () => {
      try {
        const response = await scooterService.getChargebacks({
          startDate: dateFilters.startDate,
          endDate: dateFilters.endDate,
        });
        return response.data;
      } catch {
        return mockChargebacks;
      }
    },
  });

  // Fetch refunds
  const { data: refunds } = useQuery({
    queryKey: ["refunds", dateFilters],
    queryFn: async () => {
      try {
        const response = await scooterService.getRefunds({
          startDate: dateFilters.startDate,
          endDate: dateFilters.endDate,
        });
        return response.data;
      } catch {
        return mockRefunds;
      }
    },
  });

  // Mock data for development
  const mockRevenueData = [
    { date: "2024-01-01", revenue: 1200, rides: 45, avgRide: 26.67, period: "daily" },
    { date: "2024-01-02", revenue: 1450, rides: 52, avgRide: 27.88, period: "daily" },
    { date: "2024-01-03", revenue: 1680, rides: 61, avgRide: 27.54, period: "daily" },
    { date: "2024-01-04", revenue: 1320, rides: 48, avgRide: 27.50, period: "daily" },
    { date: "2024-01-05", revenue: 1890, rides: 67, avgRide: 28.21, period: "daily" },
    { date: "2024-01-06", revenue: 2100, rides: 75, avgRide: 28.00, period: "daily" },
    { date: "2024-01-07", revenue: 1950, rides: 70, avgRide: 27.86, period: "daily" },
  ];

  const mockPaymentData = [
    { method: "Credit Card", transactions: 1250, amount: 31250, percentage: 50, color: "#3B82F6" },
    { method: "Apple Pay", transactions: 850, amount: 21250, percentage: 33, color: "#10B981" },
    { method: "Google Pay", transactions: 425, amount: 10625, percentage: 17, color: "#F59E0B" },
  ];

  const mockFailedTransactions = [
    {
      id: "FT001",
      userId: "U12345",
      userName: "John Doe",
      userEmail: "john.doe@email.com",
      amount: 15.50,
      reason: "Insufficient funds",
      timestamp: "2024-01-15T10:30:00Z",
      paymentMethod: "Credit Card",
      bookingId: "BOOK-001",
      retryAttempts: 2
    },
    {
      id: "FT002",
      userId: "U12346",
      userName: "Sarah Miller",
      userEmail: "sarah.miller@email.com",
      amount: 22.75,
      reason: "Card expired",
      timestamp: "2024-01-15T08:15:00Z",
      paymentMethod: "Credit Card",
      bookingId: "BOOK-002",
      retryAttempts: 1
    },
    {
      id: "FT003",
      userId: "U12347",
      userName: "Mike Rodriguez",
      userEmail: "mike.rodriguez@email.com",
      amount: 8.25,
      reason: "Network error",
      timestamp: "2024-01-15T06:45:00Z",
      paymentMethod: "Apple Pay",
      bookingId: "BOOK-003",
      retryAttempts: 3
    },
  ];

  const mockChargebacks = [
    {
      id: "CB001",
      transactionId: "T98765",
      amount: 45.00,
      reason: "Unauthorized transaction",
      status: "pending",
      dateCreated: "2024-01-14T14:20:00Z",
      dueDate: "2024-01-28T23:59:59Z"
    },
    {
      id: "CB002",
      transactionId: "T98766",
      amount: 32.50,
      reason: "Service not provided",
      status: "resolved",
      dateCreated: "2024-01-12T09:15:00Z",
      resolvedDate: "2024-01-14T16:30:00Z"
    },
  ];

  const mockRefunds = [
    {
      id: "RF001",
      transactionId: "T87654",
      userId: "U12348",
      amount: 18.75,
      reason: "Scooter malfunction",
      status: "completed",
      requestDate: "2024-01-14T11:00:00Z",
      processedDate: "2024-01-14T15:30:00Z"
    },
    {
      id: "RF002",
      transactionId: "T87655",
      userId: "U12349",
      amount: 25.00,
      reason: "Overcharge",
      status: "pending",
      requestDate: "2024-01-15T09:20:00Z"
    },
  ];

  // Export functionality
  const handleExport = async (reportType, format = 'csv') => {
    try {
      const response = await scooterService.exportFinancialReport(reportType, {
        startDate: dateRange?.start,
        endDate: dateRange?.end,
        format,
        paymentMethod: selectedPaymentMethod !== 'all' ? selectedPaymentMethod : undefined,
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setShowExportModal(false);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  // Filter functions for issues data
  const filterIssuesData = (data, type) => {
    return data.filter(item => {
      // Payment method filter
      if (issuesFilters.paymentMethod !== 'all' && item.paymentMethod !== issuesFilters.paymentMethod) {
        return false;
      }

      // Failure reason filter (for failed transactions)
      if (type === 'failed' && issuesFilters.failureReason !== 'all' && item.reason !== issuesFilters.failureReason) {
        return false;
      }

      // Amount range filter
      if (issuesFilters.amountRange.min && item.amount < parseFloat(issuesFilters.amountRange.min)) {
        return false;
      }
      if (issuesFilters.amountRange.max && item.amount > parseFloat(issuesFilters.amountRange.max)) {
        return false;
      }

      // Date range filter
      const itemDate = new Date(item.timestamp || item.dateCreated || item.requestDate);
      if (issuesFilters.dateRange.start && itemDate < new Date(issuesFilters.dateRange.start)) {
        return false;
      }
      if (issuesFilters.dateRange.end && itemDate > new Date(issuesFilters.dateRange.end)) {
        return false;
      }

      return true;
    });
  };

  const currentData = revenueData || mockRevenueData;
  const currentPaymentData = selectedPaymentMethod === 'all'
    ? (paymentBreakdown || mockPaymentData)
    : (paymentBreakdown || mockPaymentData).filter(item =>
        selectedPaymentMethod === 'all' || item.method === selectedPaymentMethod
      );
  const currentFailedTransactions = filterIssuesData(failedTransactions || mockFailedTransactions, 'failed');
  const currentChargebacks = filterIssuesData(chargebacks || mockChargebacks, 'chargebacks');
  const currentRefunds = filterIssuesData(refunds || mockRefunds, 'refunds');

  // Handle date filter changes
  const handleDateFilterChange = (field, value) => {
    setDateFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle transaction detail view
  const handleViewTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (issuesFilters.paymentMethod !== 'all') count++;
    if (issuesFilters.failureReason !== 'all') count++;
    if (issuesFilters.amountRange.min || issuesFilters.amountRange.max) count++;
    if (issuesFilters.dateRange.start || issuesFilters.dateRange.end) count++;
    return count;
  };

  // Apply filters function
  const applyFilters = () => {
    console.log('Applying filters:', issuesFilters);
    setFiltersApplied(true);
    setTimeout(() => setFiltersApplied(false), 2000);
  };

  // Clear filters function
  const clearAllFilters = () => {
    setIssuesFilters({
      paymentMethod: "all",
      failureReason: "all",
      amountRange: { min: "", max: "" },
      dateRange: { start: "", end: "" }
    });
    setFiltersApplied(false);
    console.log('All filters cleared');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Enter to apply filters
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        applyFilters();
      }
      // Ctrl/Cmd + Shift + C to clear filters
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        clearAllFilters();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [issuesFilters]);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* View Type Selector */}
            <div className="bg-gray-50 p-2 rounded-full border border-gray-200">
              <div className="flex space-x-1">
                {[
                  { key: "overview", label: "Overview" },
                  { key: "payments", label: "Payments" },
                  { key: "issues", label: "Issues" },
                  { key: "trends", label: "Trends" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setViewType(tab.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      viewType === tab.key
                        ? "bg-blue-600 text-white shadow-md transform scale-105"
                        : "text-gray-600 hover:bg-white hover:text-blue-600 hover:shadow-sm"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Period Selector */}
            <select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>

            {/* Date Range Filters */}
            <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-full border border-gray-200">
              <Calendar className="h-4 w-4 text-gray-500" />
              <input
                type="date"
                value={dateFilters.startDate}
                onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
                className="px-3 py-2 border-0 bg-transparent rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Start Date"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateFilters.endDate}
                onChange={(e) => handleDateFilterChange('endDate', e.target.value)}
                className="px-3 py-2 border-0 bg-transparent rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="End Date"
              />
            </div>

            {/* Payment Method Filter */}
            <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-full border border-gray-200">
              <Filter className={`h-4 w-4 ${selectedPaymentMethod !== 'all' ? 'text-blue-600' : 'text-gray-500'}`} />
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className={`px-3 py-2 border-0 bg-transparent rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  selectedPaymentMethod !== 'all'
                    ? 'text-blue-700'
                    : 'text-gray-700'
                }`}
              >
                <option value="all">All Payment Methods</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Apple Pay">Apple Pay</option>
                <option value="Google Pay">Google Pay</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 p-2 rounded-full border border-gray-200">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setDateFilters({ startDate: "", endDate: "" });
                  setSelectedPaymentMethod("all");
                }}
                className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
              >
                Clear Filters
              </button>

              <button
                onClick={() => refetchRevenue()}
                className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>

              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Tab */}
      {viewType === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  ${currentData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    formatter={(value, name) => [`$${value}`, name]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Average Revenue/Day</p>
                    <p className="text-xl font-bold text-green-600">
                      ${(currentData.reduce((sum, item) => sum + item.revenue, 0) / currentData.length).toFixed(2)}
                    </p>
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Total Transactions</p>
                    <p className="text-xl font-bold text-blue-600">
                      {currentPaymentData.reduce((sum, item) => sum + item.transactions, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Failed Transactions</p>
                    <p className="text-xl font-bold text-red-600">{currentFailedTransactions.length}</p>
                  </div>
                </div>
                <span className="text-sm text-red-600">
                  ${currentFailedTransactions.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <RefreshCw className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Pending Refunds</p>
                    <p className="text-xl font-bold text-yellow-600">
                      {currentRefunds.filter(r => r.status === 'pending').length}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-yellow-600">
                  ${currentRefunds.filter(r => r.status === 'pending').reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Payments Tab */}
      {viewType === "payments" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
              {selectedPaymentMethod !== 'all' && (
                <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Filtered: {selectedPaymentMethod}
                </span>
              )}
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentPaymentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="percentage"
                    label={({ method, percentage }) => `${method}: ${percentage}%`}
                  >
                    {currentPaymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Usage"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Payment Method Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Breakdown</h3>
            <div className="space-y-4">
              {currentPaymentData.map((method) => (
                <div key={method.method} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: method.color }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{method.method}</p>
                      <p className="text-sm text-gray-600">{method.transactions} transactions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${method.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{method.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Issues Tab */}
      {viewType === "issues" && (
        <div className="space-y-6">
          {/* Issues Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filter Issues</h3>
              {getActiveFiltersCount() > 0 && (
                <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Payment Method Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  value={issuesFilters.paymentMethod}
                  onChange={(e) => setIssuesFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Methods</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Apple Pay">Apple Pay</option>
                  <option value="Google Pay">Google Pay</option>
                </select>
              </div>

              {/* Failure Reason Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Failure Reason</label>
                <select
                  value={issuesFilters.failureReason}
                  onChange={(e) => setIssuesFilters(prev => ({ ...prev, failureReason: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Reasons</option>
                  <option value="Insufficient funds">Insufficient funds</option>
                  <option value="Card expired">Card expired</option>
                  <option value="Card declined">Card declined</option>
                  <option value="Network error">Network error</option>
                  <option value="Payment timeout">Payment timeout</option>
                  <option value="Invalid card">Invalid card</option>
                </select>
              </div>

              {/* Amount Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    step="0.01"
                    value={issuesFilters.amountRange.min}
                    onChange={(e) => setIssuesFilters(prev => ({
                      ...prev,
                      amountRange: { ...prev.amountRange, min: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    min="0"
                    step="0.01"
                    value={issuesFilters.amountRange.max}
                    onChange={(e) => setIssuesFilters(prev => ({
                      ...prev,
                      amountRange: { ...prev.amountRange, max: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={issuesFilters.dateRange.start}
                    onChange={(e) => setIssuesFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={issuesFilters.dateRange.end}
                    onChange={(e) => setIssuesFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Filter Action Buttons */}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={applyFilters}
                className={`px-6 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 flex items-center ${
                  filtersApplied
                    ? 'text-white bg-green-600 hover:bg-green-700'
                    : 'text-white bg-blue-600 hover:bg-blue-700'
                }`}
                title="Apply filters (Ctrl+Enter)"
              >
                <Filter className="h-4 w-4 mr-2" />
                {filtersApplied ? 'Filters Applied!' : 'Apply Filters'}
              </button>

              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all duration-200 flex items-center"
                title="Clear all filters (Ctrl+Shift+C)"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear All Filters
              </button>
            </div>
          </motion.div>

          {/* Failed Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Failed Transactions</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                  {currentFailedTransactions.length} failed
                </span>
                <button
                  onClick={() => handleExport('failed-transactions')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentFailedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{transaction.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{transaction.userName}</td>
                      <td className="px-4 py-3 text-sm font-medium text-red-600">${transaction.amount}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{transaction.paymentMethod}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{transaction.reason}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleViewTransactionDetails(transaction)}
                          className="text-blue-600 hover:text-blue-700 mr-2 p-1 rounded hover:bg-blue-50"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}

      {/* Trends Tab */}
      {viewType === "trends" && (
        <div className="space-y-6">
          {/* Revenue vs Rides Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Rides Correlation</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value}`} />
                  <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Revenue ($)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rides"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Rides"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Trend Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue Growth</p>
                  <p className="text-2xl font-bold text-green-600">+12.5%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Month over month
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Revenue/Ride</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${(currentData.reduce((sum, item) => sum + item.avgRide, 0) / currentData.length).toFixed(2)}
                  </p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3.2% vs last period
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-lg border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Payment Success Rate</p>
                  <p className="text-2xl font-bold text-purple-600">97.8%</p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +0.5% improvement
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Export Financial Reports</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'revenue', label: 'Revenue Report' },
                      { key: 'payments', label: 'Payment Breakdown' },
                      { key: 'failed-transactions', label: 'Failed Transactions' },
                      { key: 'chargebacks', label: 'Chargebacks' },
                      { key: 'refunds', label: 'Refunds' },
                      { key: 'comprehensive', label: 'Comprehensive' },
                    ].map((type) => (
                      <button
                        key={type.key}
                        onClick={() => handleExport(type.key)}
                        className="p-3 text-left border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{type.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Format
                  </label>
                  <div className="flex space-x-2">
                    {['csv', 'xlsx', 'pdf'].map((format) => (
                      <button
                        key={format}
                        onClick={() => handleExport('comprehensive', format)}
                        className="flex-1 p-2 text-center border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <span className="text-sm font-medium text-gray-900">{format.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Export includes:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Revenue data for selected period</li>
                    <li>• Payment method breakdowns</li>
                    <li>• Transaction success/failure rates</li>
                    <li>• Chargeback and refund details</li>
                    <li>• Financial trend analysis</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleExport('comprehensive')}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  Export All Reports
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

EnhancedRevenueReports.propTypes = {
  dateRange: PropTypes.object,
};

export default EnhancedRevenueReports;
