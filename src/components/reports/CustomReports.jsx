// src/components/reports/CustomReports.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Plus,
  Download,
  Filter,
  Calendar,
  Users,
  DollarSign,
  Bike,
  Settings,
  Trash2,
  Edit,
  Play
} from "lucide-react";

const CustomReports = ({ dateRange }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);

  // Mock custom reports data
  const customReports = [
    {
      id: 1,
      name: "Weekly Revenue Summary",
      description: "Comprehensive weekly revenue breakdown by zones",
      type: "Revenue",
      schedule: "Weekly",
      lastRun: "2024-01-15",
      status: "Active",
      metrics: ["Revenue", "Rides", "Zones"],
    },
    {
      id: 2,
      name: "User Engagement Analysis",
      description: "Monthly user behavior and engagement patterns",
      type: "User Analytics",
      schedule: "Monthly",
      lastRun: "2024-01-10",
      status: "Active",
      metrics: ["Users", "Sessions", "Retention"],
    },
    {
      id: 3,
      name: "Fleet Utilization Report",
      description: "Daily fleet performance and maintenance tracking",
      type: "Fleet",
      schedule: "Daily",
      lastRun: "2024-01-16",
      status: "Paused",
      metrics: ["Fleet", "Battery", "Maintenance"],
    },
    {
      id: 4,
      name: "City Performance Dashboard",
      description: "Geographic performance analysis by city regions",
      type: "Geographic",
      schedule: "Bi-weekly",
      lastRun: "2024-01-12",
      status: "Active",
      metrics: ["Cities", "Zones", "Performance"],
    },
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate CSV for custom reports
      const timestamp = new Date().toISOString().split('T')[0];

      const headers = "Report Name,Type,Schedule,Status,Last Run,Metrics";
      const csvData = customReports.map(report =>
        `${report.name},${report.type},${report.schedule},${report.status},${report.lastRun},"${report.metrics.join(', ')}"`
      ).join("\n");

      const csvContent = headers + "\n" + csvData;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `custom-reports-${dateRange}-${timestamp}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      console.log("✅ Custom reports exported successfully!");
    } catch (error) {
      console.error("❌ Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSelectReport = (reportId) => {
    setSelectedReports(prev =>
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-50';
      case 'Paused': return 'text-yellow-600 bg-yellow-50';
      case 'Inactive': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Revenue': return DollarSign;
      case 'User Analytics': return Users;
      case 'Fleet': return Bike;
      case 'Geographic': return BarChart3;
      default: return BarChart3;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Custom Reports</h3>
          <p className="text-sm text-gray-600">
            Create and manage custom reports with flexible data filtering for {dateRange}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
            {isExporting ? 'Exporting...' : 'Export Reports'}
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-blue-600">{customReports.length}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Reports</p>
              <p className="text-2xl font-bold text-green-600">
                {customReports.filter(r => r.status === 'Active').length}
              </p>
            </div>
            <Play className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Scheduled Reports</p>
              <p className="text-2xl font-bold text-purple-600">
                {customReports.filter(r => r.schedule !== 'Manual').length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Report Types</p>
              <p className="text-2xl font-bold text-orange-600">
                {new Set(customReports.map(r => r.type)).size}
              </p>
            </div>
            <Filter className="h-8 w-8 text-orange-600" />
          </div>
        </motion.div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">Report Management</h4>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </button>
              <button className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedReports(customReports.map(r => r.id));
                      } else {
                        setSelectedReports([]);
                      }
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Run</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customReports.map((report) => {
                const TypeIcon = getTypeIcon(report.type);
                return (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedReports.includes(report.id)}
                        onChange={() => handleSelectReport(report.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <TypeIcon className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{report.name}</div>
                          <div className="text-sm text-gray-500">{report.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{report.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{report.schedule}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.lastRun}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Play className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomReports;
