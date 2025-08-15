// src/components/support/SupportDashboard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Star,
  Timer,
  MessageSquare,
  Download,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supportService } from "../../services/supportApi";

const SupportDashboard = ({ metrics, isLoading, onTicketSelect }) => {
  const [isExporting, setIsExporting] = useState(false);

  // Fetch recent tickets for the dashboard
  const { data: recentTickets } = useQuery({
    queryKey: ["recent-tickets"],
    queryFn: async () => {
      const response = await supportService.getAllTickets({ limit: 5 });
      return response.data.slice(0, 5); // Get latest 5 tickets
    },
  });

  // Fetch agents data
  const { data: agentsData } = useQuery({
    queryKey: ["support-agents"],
    queryFn: async () => {
      const response = await supportService.getAllAgents();
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12 text-gray-500">
        <AlertCircle className="h-12 w-12 mx-auto mb-4" />
        <p>Unable to load support metrics</p>
      </div>
    );
  }

  // Prepare chart data
  const categoryData = Object.entries(metrics.ticketsByCategory).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }));

  const priorityData = Object.entries(metrics.ticketsByPriority).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }));

  const resolutionTrendData = metrics.resolutionTrend.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-orange-100 text-orange-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Export functionality
  const handleExportDashboard = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const csvData = [];

      // Add dashboard summary
      csvData.push(['Support Dashboard Summary', '', '']);
      csvData.push(['Metric', 'Value', 'Details']);
      csvData.push(['Total Tickets', metrics.totalTickets, 'All time']);
      csvData.push(['Resolved Tickets', metrics.resolvedTickets, `${((metrics.resolvedTickets / metrics.totalTickets) * 100).toFixed(1)}% success rate`]);
      csvData.push(['Average Resolution Time', `${metrics.avgResolutionTime}h`, 'Target: < 4h']);
      csvData.push(['Customer Satisfaction', `${metrics.customerSatisfaction}/5`, 'Customer rating']);

      csvData.push(['', '', '']); // Empty row

      // Add tickets by category
      csvData.push(['Tickets by Category', '', '']);
      csvData.push(['Category', 'Count', 'Percentage']);
      categoryData.forEach(item => {
        const percentage = ((item.value / metrics.totalTickets) * 100).toFixed(1);
        csvData.push([item.name, item.value, `${percentage}%`]);
      });

      csvData.push(['', '', '']); // Empty row

      // Add tickets by priority
      csvData.push(['Tickets by Priority', '', '']);
      csvData.push(['Priority', 'Count', 'Percentage']);
      priorityData.forEach(item => {
        const percentage = ((item.value / metrics.totalTickets) * 100).toFixed(1);
        csvData.push([item.name, item.value, `${percentage}%`]);
      });

      csvData.push(['', '', '']); // Empty row

      // Add resolution trend
      csvData.push(['Resolution Trend (7 days)', '', '']);
      csvData.push(['Date', 'Created', 'Resolved']);
      resolutionTrendData.forEach(item => {
        csvData.push([item.date, item.created, item.resolved]);
      });

      csvData.push(['', '', '']); // Empty row

      // Add team performance
      if (agentsData?.length) {
        csvData.push(['Team Performance', '', '']);
        csvData.push(['Agent Name', 'Role', 'Status', 'Active Tickets', 'Avg Resolution Time']);
        agentsData.forEach(agent => {
          csvData.push([agent.name, agent.role, agent.status, agent.activeTickets, `${agent.avgResolutionTime}h`]);
        });
      }

      const csvContent = csvData.map(row => row.map(field => `"${field}"`).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `support_dashboard_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('✅ Support dashboard exported successfully!');
    } catch (error) {
      console.error('❌ Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Export Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Support Dashboard</h2>
          <p className="text-sm text-gray-600">Overview of support metrics and team performance</p>
        </div>
        <button
          onClick={handleExportDashboard}
          disabled={isExporting}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
        >
          <Download className={`w-4 h-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
          {isExporting ? 'Exporting...' : 'Export Dashboard'}
        </button>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Tickets</p>
              <p className="text-2xl font-bold text-blue-900">{metrics.totalTickets}</p>
              <p className="text-xs text-blue-600 mt-1">All time</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Resolved</p>
              <p className="text-2xl font-bold text-green-900">{metrics.resolvedTickets}</p>
              <p className="text-xs text-green-600 mt-1">
                {((metrics.resolvedTickets / metrics.totalTickets) * 100).toFixed(1)}% success rate
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Avg Resolution</p>
              <p className="text-2xl font-bold text-purple-900">{metrics.avgResolutionTime}h</p>
              <p className="text-xs text-purple-600 mt-1">Target: &lt; 4h</p>
            </div>
            <Timer className="h-8 w-8 text-purple-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-lg border border-yellow-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Satisfaction</p>
              <p className="text-2xl font-bold text-yellow-900">{metrics.customerSatisfaction}/5</p>
              <p className="text-xs text-yellow-600 mt-1">Customer rating</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Resolution Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolution Trend (7 days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={resolutionTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="resolved" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Resolved"
              />
              <Line 
                type="monotone" 
                dataKey="created" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Created"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row: Recent Tickets and Team Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tickets</h3>
          <div className="space-y-3">
            {recentTickets?.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => onTicketSelect(ticket)}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{ticket.id}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 truncate">{ticket.title}</p>
                  <p className="text-xs text-gray-500">{ticket.userName}</p>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Team Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white p-6 rounded-lg border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Performance</h3>
          <div className="space-y-4">
            {agentsData?.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    agent.status === 'online' ? 'bg-green-500' : 
                    agent.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{agent.name}</p>
                    <p className="text-sm text-gray-600">{agent.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{agent.activeTickets} active</p>
                  <p className="text-xs text-gray-500">{agent.avgResolutionTime}h avg</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SupportDashboard;
