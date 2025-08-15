// src/components/support/TicketDetails.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Clock,
  Tag,
  AlertCircle,
  CheckCircle,
  Timer,
  Send,
  Paperclip,
  Edit,
  UserCheck,
  MessageSquare,
  Calendar,
  Mail,
  Phone,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supportService } from "../../services/supportApi";
import ConfirmationDialog from "./ConfirmationDialog";

const TicketDetails = ({ ticket, onBack }) => {
  const [newResponse, setNewResponse] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [currentTicket, setCurrentTicket] = useState(ticket);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const queryClient = useQueryClient();

  // Update local ticket state when prop changes
  useEffect(() => {
    setCurrentTicket(ticket);
  }, [ticket]);

  // Fetch agents for assignment
  const { data: agents = [] } = useQuery({
    queryKey: ["support-agents"],
    queryFn: async () => {
      const response = await supportService.getAllAgents();
      return response.data;
    },
  });

  // Add response mutation
  const addResponseMutation = useMutation({
    mutationFn: async (responseData) => {
      return await supportService.addResponse(currentTicket.id, responseData);
    },
    onSuccess: (data) => {
      // Update local state immediately
      setCurrentTicket(prev => ({
        ...prev,
        responses: [...(prev.responses || []), data.data],
        updatedAt: new Date().toISOString()
      }));
      queryClient.invalidateQueries(["support-tickets"]);
      setNewResponse("");
    },
  });

  // Assign ticket mutation
  const assignTicketMutation = useMutation({
    mutationFn: async (agentId) => {
      return await supportService.assignTicket(currentTicket.id, agentId);
    },
    onSuccess: (data) => {
      // Update local state immediately
      setCurrentTicket(prev => ({
        ...prev,
        assignedTo: data.data.assignedTo,
        assignedToName: data.data.assignedToName,
        updatedAt: data.data.updatedAt
      }));
      queryClient.invalidateQueries(["support-tickets"]);
      setIsAssigning(false);
      setSelectedAgent("");
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (status) => {
      return await supportService.updateTicket(currentTicket.id, { status });
    },
    onSuccess: (data) => {
      // Update local state immediately
      setCurrentTicket(prev => ({
        ...prev,
        status: data.data.status,
        updatedAt: data.data.updatedAt,
        resolvedAt: data.data.resolvedAt
      }));
      queryClient.invalidateQueries(["support-tickets"]);
      setShowConfirmDialog(false);
      setPendingStatusChange(null);
    },
  });

  const handleAddResponse = () => {
    if (!newResponse.trim()) return;

    addResponseMutation.mutate({
      message: newResponse,
      author: "Current Admin", // In real app, get from auth context
      authorType: "agent",
      attachments: [],
    });
  };

  const handleAssignTicket = () => {
    if (!selectedAgent) return;
    assignTicketMutation.mutate(selectedAgent);
  };

  const handleStatusChange = (status) => {
    // Check if this is a critical status change that needs confirmation
    if (status === 'resolved' && currentTicket.status !== 'resolved') {
      setPendingStatusChange(status);
      setShowConfirmDialog(true);
    } else if (status === 'closed' && currentTicket.status !== 'closed') {
      setPendingStatusChange(status);
      setShowConfirmDialog(true);
    } else {
      // For non-critical changes, update immediately
      updateStatusMutation.mutate(status);
    }
  };

  const handleConfirmStatusChange = () => {
    if (pendingStatusChange) {
      updateStatusMutation.mutate(pendingStatusChange);
    }
  };

  const getConfirmationMessage = () => {
    if (pendingStatusChange === 'resolved') {
      return {
        title: 'Mark Ticket as Resolved',
        message: 'Are you sure you want to mark this ticket as resolved? This action will close the ticket and stop further responses.',
        type: 'warning'
      };
    } else if (pendingStatusChange === 'closed') {
      return {
        title: 'Close Ticket',
        message: 'Are you sure you want to close this ticket? This action cannot be easily undone.',
        type: 'danger'
      };
    }
    return {
      title: 'Confirm Action',
      message: 'Are you sure you want to proceed with this action?',
      type: 'warning'
    };
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: "bg-orange-100 text-orange-800",
      in_progress: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800",
      low: "bg-green-100 text-green-800",
    };
    return styles[priority] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-5 w-5" />;
      case "in_progress":
        return <Timer className="h-5 w-5" />;
      case "resolved":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateResolutionTime = () => {
    if (!currentTicket.resolvedAt) return null;
    const created = new Date(currentTicket.createdAt);
    const resolved = new Date(currentTicket.resolvedAt);
    const diffInHours = Math.round((resolved - created) / (1000 * 60 * 60));
    return diffInHours;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
              {getStatusIcon(currentTicket.status)}
              <span>{currentTicket.id}</span>
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(
                  currentTicket.status
                )}`}
              >
                {currentTicket.status.replace("_", " ")}
              </span>
            </h1>
            <p className="text-gray-600 mt-1">{currentTicket.title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {currentTicket.status !== "resolved" && currentTicket.status !== "closed" && (
            <>
              <select
                onChange={(e) => handleStatusChange(e.target.value)}
                value={currentTicket.status}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={updateStatusMutation.isLoading}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <button
                onClick={() => setIsAssigning(!isAssigning)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                {currentTicket.assignedTo ? "Reassign" : "Assign"}
              </button>
            </>
          )}
          {(currentTicket.status === "resolved" || currentTicket.status === "closed") && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                {currentTicket.status === "resolved" ? "Ticket Resolved" : "Ticket Closed"}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{currentTicket.description}</p>
            {currentTicket.tags && currentTicket.tags.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {currentTicket.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Conversation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Conversation ({currentTicket.responses?.length || 0})
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {currentTicket.responses?.map((response) => (
                <div
                  key={response.id}
                  className={`flex ${
                    response.authorType === "agent" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      response.authorType === "agent"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{response.author}</span>
                      <span
                        className={`text-xs ${
                          response.authorType === "agent"
                            ? "text-blue-200"
                            : "text-gray-500"
                        }`}
                      >
                        {formatDateTime(response.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{response.message}</p>
                    {response.attachments && response.attachments.length > 0 && (
                      <div className="mt-2">
                        {response.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center text-xs text-blue-200"
                          >
                            <Paperclip className="h-3 w-3 mr-1" />
                            {attachment}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Response */}
            {currentTicket.status !== "resolved" && currentTicket.status !== "closed" && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex space-x-4">
                  <textarea
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    placeholder="Type your response..."
                    rows={3}
                    className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={handleAddResponse}
                      disabled={!newResponse.trim() || addResponseMutation.isLoading}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </button>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer</h3>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={`https://ui-avatars.com/api/?name=${currentTicket.userName}&background=0D8ABC&color=fff`}
                alt={currentTicket.userName}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{currentTicket.userName}</p>
                <p className="text-sm text-gray-600">{currentTicket.userEmail}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {currentTicket.userEmail}
              </div>
              <div className="flex items-center text-gray-600">
                <User className="h-4 w-4 mr-2" />
                User ID: {currentTicket.userId}
              </div>
            </div>
          </motion.div>

          {/* Ticket Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Priority:</span>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(
                    currentTicket.priority
                  )}`}
                >
                  {currentTicket.priority}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium text-gray-900">{currentTicket.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium text-gray-900">
                  {formatDateTime(currentTicket.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Updated:</span>
                <span className="font-medium text-gray-900">
                  {formatDateTime(currentTicket.updatedAt)}
                </span>
              </div>
              {currentTicket.resolvedAt && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resolved:</span>
                    <span className="font-medium text-gray-900">
                      {formatDateTime(currentTicket.resolvedAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Resolution Time:</span>
                    <span className="font-medium text-gray-900">
                      {calculateResolutionTime()}h
                    </span>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Assignment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment</h3>
            {isAssigning ? (
              <div className="space-y-3">
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an agent</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} ({agent.role})
                    </option>
                  ))}
                </select>
                <div className="flex space-x-2">
                  <button
                    onClick={handleAssignTicket}
                    disabled={!selectedAgent || assignTicketMutation.isLoading}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Assign
                  </button>
                  <button
                    onClick={() => setIsAssigning(false)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {currentTicket.assignedToName ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{currentTicket.assignedToName}</p>
                      <p className="text-sm text-gray-600">Assigned Agent</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Not assigned</p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setPendingStatusChange(null);
        }}
        onConfirm={handleConfirmStatusChange}
        title={getConfirmationMessage().title}
        message={getConfirmationMessage().message}
        type={getConfirmationMessage().type}
        confirmText="Yes, Continue"
        cancelText="Cancel"
        isLoading={updateStatusMutation.isLoading}
      />
    </div>
  );
};

export default TicketDetails;
