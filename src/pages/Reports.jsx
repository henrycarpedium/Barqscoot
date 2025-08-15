// src/pages/Reports.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FileText,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  Bike,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Lightbulb,
  CreditCard,
} from "lucide-react";
import RevenueReports from "../components/reports/RevenueReports";
import EnhancedRevenueReports from "../components/reports/EnhancedRevenueReports";
import UserAnalytics from "../components/reports/UserAnalytics";
import FleetAnalytics from "../components/reports/FleetAnalytics";
import CustomReports from "../components/reports/CustomReports";
import AnalyticsInsights from "../components/analytics/AnalyticsInsights";
import PaymentAnalytics from "../components/reports/PaymentAnalytics";

const Reports = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("payment-analytics");
  const [dateRange, setDateRange] = useState("30d");
  const [isExportingAll, setIsExportingAll] = useState(false);

  const tabs = [
    {
      id: "revenue",
      label: "Revenue & Payments",
      icon: DollarSign,
      component: RevenueReports,
    },
    {
      id: "enhanced-revenue",
      label: "Enhanced Revenue Reports",
      icon: TrendingUp,
      component: EnhancedRevenueReports,
    },
    {
      id: "payment-analytics",
      label: "Payment Analytics",
      icon: CreditCard,
      component: PaymentAnalytics,
    },
    {
      id: "users",
      label: "User Analytics",
      icon: Users,
      component: UserAnalytics,
    },
    {
      id: "fleet",
      label: "Fleet Analytics",
      icon: Bike,
      component: FleetAnalytics,
    },
    {
      id: "analytics",
      label: "Analytics & Insights",
      icon: LineChart,
      component: AnalyticsInsights,
    },
    {
      id: "custom",
      label: "Custom Reports",
      icon: BarChart3,
      component: CustomReports,
    },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  // Export All functionality
  const handleExportAll = async () => {
    setIsExportingAll(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create comprehensive CSV data for all reports
      const csvData = [];

      // Add header
      csvData.push(['E-Scooter Business - Complete Reports Export', '', '', '']);
      csvData.push(['Generated on:', new Date().toLocaleDateString(), 'Time Range:', dateRange]);
      csvData.push(['', '', '', '']); // Empty row

      // Add summary statistics
      csvData.push(['SUMMARY STATISTICS', '', '', '']);
      csvData.push(['Metric', 'Value', 'Change vs Previous', 'Period']);
      csvData.push(['Total Revenue', '$24,567', '+12.5%', dateRange]);
      csvData.push(['Total Rides', '1,234', '+8.3%', dateRange]);
      csvData.push(['Active Users', '567', '+15.2%', dateRange]);
      csvData.push(['Avg Revenue per Ride', '$19.92', '+3.8%', dateRange]);

      csvData.push(['', '', '', '']); // Empty row

      // Add revenue data
      csvData.push(['REVENUE BREAKDOWN', '', '', '']);
      csvData.push(['Date', 'Revenue', 'Rides', 'Revenue per Ride']);
      // Mock revenue data for the selected date range
      const mockRevenueData = [
        ['2024-01-01', '$850', '42', '$20.24'],
        ['2024-01-02', '$920', '48', '$19.17'],
        ['2024-01-03', '$780', '39', '$20.00'],
        ['2024-01-04', '$1,100', '55', '$20.00'],
        ['2024-01-05', '$950', '47', '$20.21'],
      ];
      mockRevenueData.forEach(row => csvData.push(row));

      csvData.push(['', '', '', '']); // Empty row

      // Add user analytics
      csvData.push(['USER ANALYTICS', '', '', '']);
      csvData.push(['User Type', 'Count', 'Percentage', 'Avg Rides']);
      csvData.push(['Regular Users', '320', '56.4%', '8.2']);
      csvData.push(['Premium Users', '180', '31.7%', '12.5']);
      csvData.push(['New Users', '67', '11.8%', '2.1']);

      csvData.push(['', '', '', '']); // Empty row

      // Add fleet analytics
      csvData.push(['FLEET ANALYTICS', '', '', '']);
      csvData.push(['Metric', 'Value', 'Status', 'Target']);
      csvData.push(['Total Scooters', '150', 'Active', '200']);
      csvData.push(['Available Scooters', '120', 'Good', '80%']);
      csvData.push(['In Maintenance', '15', 'Normal', '<10%']);
      csvData.push(['Average Battery Level', '78%', 'Good', '>70%']);

      csvData.push(['', '', '', '']); // Empty row

      // Add payment analytics
      csvData.push(['PAYMENT ANALYTICS', '', '', '']);
      csvData.push(['Payment Method', 'Transactions', 'Success Rate', 'Total Amount']);
      csvData.push(['Credit Card', '890', '98.5%', '$18,450']);
      csvData.push(['Apple Pay', '234', '99.2%', '$4,680']);
      csvData.push(['Google Pay', '110', '97.8%', '$1,437']);

      const csvContent = csvData.map(row => row.map(field => `"${field}"`).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `complete_reports_export_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('✅ All reports exported successfully!');
    } catch (error) {
      console.error('❌ Export All failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExportingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="h-6 w-6 mr-3 text-blue-600" />
            {t('reports.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('reports.subtitle')}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 3 Months</option>
            <option value="1y">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button
            onClick={handleExportAll}
            disabled={isExportingAll}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            <Download className={`h-4 w-4 mr-2 ${isExportingAll ? 'animate-bounce' : ''}`} />
            {isExportingAll ? t('common.loading') : t('common.exportAll')}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">$24,567</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% vs last period
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
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
              <p className="text-sm text-gray-600">Total Rides</p>
              <p className="text-2xl font-bold text-blue-600">1,234</p>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.3% vs last period
              </p>
            </div>
            <Bike className="h-8 w-8 text-blue-600" />
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
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-purple-600">567</p>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15.2% vs last period
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
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
              <p className="text-sm text-gray-600">Avg Revenue/Ride</p>
              <p className="text-2xl font-bold text-orange-600">$19.92</p>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3.8% vs last period
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {ActiveComponent && <ActiveComponent dateRange={dateRange} />}
        </div>
      </div>
    </div>
  );
};

export default Reports;
