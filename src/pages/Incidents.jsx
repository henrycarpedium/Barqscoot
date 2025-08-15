// src/pages/Incidents.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Filter,
  Search,
  Clock,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Calendar,
  Zap,
  Settings,
  FileText,
  X,
  Send,
  RefreshCw
} from "lucide-react";

const Incidents = () => {
  const [activeTab, setActiveTab] = useState("open");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock incidents data
  const incidents = [
    {
      id: "INC-001",
      title: "Scooter Battery Malfunction",
      description: "User reported that scooter SC-045 stopped working mid-ride due to battery failure",
      type: "technical",
      priority: "high",
      status: "open",
      reportedBy: "John Smith",
      reporterEmail: "john.smith@email.com",
      scooterId: "SC-045",
      location: "Downtown Plaza, NYC",
      coordinates: "40.7128,-74.0060",
      createdAt: "2024-01-20T10:30:00Z",
      updatedAt: "2024-01-20T14:15:00Z",
      assignedTo: "Tech Support Team",
      estimatedResolution: "2024-01-21T16:00:00Z",
      comments: [
        {
          id: 1,
          author: "Support Agent",
          message: "Incident received. Dispatching technician to location.",
          timestamp: "2024-01-20T10:35:00Z"
        },
        {
          id: 2,
          author: "Field Technician",
          message: "Scooter located. Battery appears to be completely drained. Replacing battery unit.",
          timestamp: "2024-01-20T14:15:00Z"
        }
      ]
    },
    {
      id: "INC-002",
      title: "Improper Parking Complaint",
      description: "Multiple scooters blocking wheelchair access on Main Street sidewalk",
      type: "parking",
      priority: "medium",
      status: "in_progress",
      reportedBy: "City Council",
      reporterEmail: "complaints@city.gov",
      scooterId: "Multiple",
      location: "Main Street, Block 400",
      coordinates: "40.7589,-73.9851",
      createdAt: "2024-01-19T15:45:00Z",
      updatedAt: "2024-01-20T09:20:00Z",
      assignedTo: "Field Operations",
      estimatedResolution: "2024-01-20T18:00:00Z",
      comments: [
        {
          id: 1,
          author: "Operations Manager",
          message: "Dispatching team to relocate scooters to designated parking areas.",
          timestamp: "2024-01-19T16:00:00Z"
        }
      ]
    },
    {
      id: "INC-003",
      title: "User Account Billing Issue",
      description: "User charged twice for the same ride on January 18th",
      type: "billing",
      priority: "low",
      status: "resolved",
      reportedBy: "Sarah Johnson",
      reporterEmail: "sarah.j@email.com",
      scooterId: "SC-023",
      location: "University Campus",
      coordinates: "40.7505,-73.9934",
      createdAt: "2024-01-18T12:20:00Z",
      updatedAt: "2024-01-19T11:30:00Z",
      assignedTo: "Billing Support",
      resolvedAt: "2024-01-19T11:30:00Z",
      comments: [
        {
          id: 1,
          author: "Billing Agent",
          message: "Duplicate charge confirmed. Processing refund.",
          timestamp: "2024-01-18T14:30:00Z"
        },
        {
          id: 2,
          author: "Billing Agent",
          message: "Refund processed successfully. User notified via email.",
          timestamp: "2024-01-19T11:30:00Z"
        }
      ]
    },
    {
      id: "INC-004",
      title: "Vandalism Report",
      description: "Scooter found with damaged display screen and scratched body",
      type: "vandalism",
      priority: "high",
      status: "open",
      reportedBy: "Field Agent",
      reporterEmail: "field@barqscoot.com",
      scooterId: "SC-078",
      location: "Central Park Area",
      coordinates: "40.7614,-73.9776",
      createdAt: "2024-01-20T08:15:00Z",
      updatedAt: "2024-01-20T08:15:00Z",
      assignedTo: "Security Team",
      estimatedResolution: "2024-01-22T12:00:00Z",
      comments: []
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "technical":
        return <Zap className="h-4 w-4" />;
      case "parking":
        return <MapPin className="h-4 w-4" />;
      case "billing":
        return <FileText className="h-4 w-4" />;
      case "vandalism":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState("");

  // First apply search, priority, and type filters (but not tab filter)
  const baseFilteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !filterPriority || incident.priority === filterPriority;
    const matchesType = !filterType || incident.type === filterType;

    return matchesSearch && matchesPriority && matchesType;
  });

  // Calculate tab counts based on filtered incidents
  const tabs = [
    { id: "all", label: "All Incidents", count: baseFilteredIncidents.length },
    { id: "open", label: "Open", count: baseFilteredIncidents.filter(i => i.status === "open").length },
    { id: "in_progress", label: "In Progress", count: baseFilteredIncidents.filter(i => i.status === "in_progress").length },
    { id: "resolved", label: "Resolved", count: baseFilteredIncidents.filter(i => i.status === "resolved").length }
  ];

  // Then apply tab filter to get final filtered incidents
  const filteredIncidents = baseFilteredIncidents.filter(incident => {
    const matchesTab = activeTab === "all" || incident.status === activeTab;
    return matchesTab;
  });

  const stats = {
    total: baseFilteredIncidents.length,
    open: baseFilteredIncidents.filter(i => i.status === "open").length,
    inProgress: baseFilteredIncidents.filter(i => i.status === "in_progress").length,
    resolved: baseFilteredIncidents.filter(i => i.status === "resolved").length,
    highPriority: baseFilteredIncidents.filter(i => i.priority === "high").length,
    avgResolutionTime: "4.2 hours"
  };

  // Handler functions for buttons
  const handleViewIncident = (incident) => {
    setSelectedIncident(incident);
  };

  const handleCommentIncident = (incident) => {
    setSelectedIncident(incident);
    setShowCommentModal(true);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      console.log("Adding comment:", newComment, "to incident:", selectedIncident.id);
      setNewComment("");
      setShowCommentModal(false);
      setSelectedIncident(null);
    }
  };

  // Refresh functionality
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("✅ Incidents refreshed successfully");
    } catch (error) {
      console.error("❌ Error refreshing incidents:", error);
      alert("Failed to refresh incidents. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterPriority("");
    setFilterType("");
    console.log("🧹 All filters cleared");
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <AlertTriangle className="h-6 w-6 mr-3 text-red-600" />
            Incident Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track and resolve user-reported incidents and support tickets
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg transition-colors ${
              isRefreshing
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Incidents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-gray-600" />
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
              <p className="text-sm text-gray-600">Open</p>
              <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
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
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
            </div>
            <Settings className="h-8 w-8 text-yellow-600" />
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
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Resolution</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgResolutionTime}</p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All Types</option>
              <option value="technical">Technical</option>
              <option value="parking">Parking</option>
              <option value="billing">Billing</option>
              <option value="vandalism">Vandalism</option>
            </select>

            {(searchTerm || filterPriority || filterType) && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Incidents List */}
        <div className="p-6">
          <div className="space-y-4">
            {filteredIncidents.map((incident, index) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(incident.type)}
                        <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
                      </div>
                      <span className="text-sm text-gray-500">#{incident.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(incident.priority)}`}>
                        {incident.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                        {incident.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">{incident.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{incident.reportedBy}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{incident.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {new Date(incident.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{incident.comments.length} comments</span>
                      </div>
                    </div>

                    {incident.scooterId && incident.scooterId !== "Multiple" && (
                      <div className="mt-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Scooter: {incident.scooterId}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewIncident(incident);
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCommentIncident(incident);
                      }}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Add Comment"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredIncidents.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No incidents found</h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* View Incident Modal */}
      <AnimatePresence>
        {selectedIncident && !showCommentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedIncident(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Incident Details</h3>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Incident Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(selectedIncident.type)}
                        <h2 className="text-2xl font-bold text-gray-900">{selectedIncident.title}</h2>
                      </div>
                      <span className="text-lg text-gray-500">#{selectedIncident.id}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedIncident.priority)}`}>
                        {selectedIncident.priority} Priority
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedIncident.status)}`}>
                        {selectedIncident.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Incident Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                      <p className="text-gray-900">{selectedIncident.description}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Location</h4>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{selectedIncident.location}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Reported By</h4>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{selectedIncident.reportedBy}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{selectedIncident.reporterEmail}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Created</h4>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">
                          {new Date(selectedIncident.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Last Updated</h4>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">
                          {new Date(selectedIncident.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Assigned To</h4>
                      <span className="text-gray-900">{selectedIncident.assignedTo}</span>
                    </div>

                    {selectedIncident.scooterId && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Scooter ID</h4>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {selectedIncident.scooterId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Comments Section */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Comments ({selectedIncident.comments.length})</h4>
                  <div className="space-y-4">
                    {selectedIncident.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{comment.author}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.message}</p>
                      </div>
                    ))}
                    {selectedIncident.comments.length === 0 && (
                      <p className="text-gray-500 italic">No comments yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Comment Modal */}
      <AnimatePresence>
        {showCommentModal && selectedIncident && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => {
              setShowCommentModal(false);
              setSelectedIncident(null);
              setNewComment("");
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Comment to #{selectedIncident.id}
                </h3>
                <button
                  onClick={() => {
                    setShowCommentModal(false);
                    setSelectedIncident(null);
                    setNewComment("");
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">{selectedIncident.title}</h4>
                  <p className="text-sm text-gray-600">{selectedIncident.description}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Comment
                    </label>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      placeholder="Enter your comment here..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowCommentModal(false);
                        setSelectedIncident(null);
                        setNewComment("");
                      }}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Add Comment
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Incidents;