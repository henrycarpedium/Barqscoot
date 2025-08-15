// src/components/bookings/DisputeManagement.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  DollarSign,
  User,
  Calendar,
  Filter,
  Search,
} from "lucide-react";

const DisputeManagement = () => {
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock dispute data
  const disputes = [
    {
      id: "DISP-001",
      bookingId: "BOOK-003",
      userId: "USER-321",
      userName: "Mike Rodriguez",
      userEmail: "mike.rodriguez@email.com",
      amount: 22.75,
      disputeAmount: 15.00,
      reason: "Overcharge - scooter malfunctioned",
      status: "pending",
      priority: "high",
      createdAt: "2024-01-15T09:45:00Z",
      description: "The scooter stopped working halfway through my ride, but I was charged for the full duration.",
      evidence: ["receipt.pdf", "photo1.jpg"],
      assignedAgent: null,
    },
    {
      id: "DISP-002",
      bookingId: "BOOK-007",
      userId: "USER-258",
      userName: "Robert Kim",
      userEmail: "robert.kim@email.com",
      amount: 18.75,
      disputeAmount: 18.75,
      reason: "Unauthorized charge",
      status: "investigating",
      priority: "medium",
      createdAt: "2024-01-14T08:00:00Z",
      description: "I never used this scooter. This charge appeared on my account without my knowledge.",
      evidence: ["bank_statement.pdf"],
      assignedAgent: "Agent Smith",
    },
    {
      id: "DISP-003",
      bookingId: "BOOK-006",
      userId: "USER-147",
      userName: "Lisa Thompson",
      userEmail: "lisa.thompson@email.com",
      amount: 28.50,
      disputeAmount: 10.00,
      reason: "Service not provided",
      status: "resolved",
      priority: "low",
      createdAt: "2024-01-13T18:30:00Z",
      resolvedAt: "2024-01-14T10:15:00Z",
      description: "Scooter was locked and couldn't be unlocked despite payment.",
      evidence: ["screenshot.png"],
      assignedAgent: "Agent Johnson",
      resolution: "Partial refund of $10.00 issued",
    },
  ];

  const filteredDisputes = disputes.filter((dispute) => {
    const matchesStatus = filterStatus === "all" || dispute.status === filterStatus;
    const matchesSearch = 
      !searchTerm ||
      dispute.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      investigating: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
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

  const handleResolveDispute = (disputeId, resolution) => {
    console.log(`Resolving dispute ${disputeId} with resolution: ${resolution}`);
    // In real implementation, this would call an API
  };

  const handleRejectDispute = (disputeId, reason) => {
    console.log(`Rejecting dispute ${disputeId} with reason: ${reason}`);
    // In real implementation, this would call an API
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Dispute Management</h2>
            <p className="text-gray-600 mt-1">Handle booking disputes and resolve customer issues</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{disputes.filter(d => d.status === 'pending').length}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{disputes.filter(d => d.status === 'investigating').length}</p>
              <p className="text-sm text-gray-600">Investigating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{disputes.filter(d => d.status === 'resolved').length}</p>
              <p className="text-sm text-gray-600">Resolved</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search disputes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Disputes List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dispute Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDisputes.map((dispute) => (
                <motion.tr
                  key={dispute.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ backgroundColor: "#f9fafb" }}
                  className="cursor-pointer"
                  onClick={() => setSelectedDispute(dispute)}
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{dispute.id}</div>
                    <div className="text-sm text-gray-500">{dispute.reason}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(dispute.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{dispute.userName}</div>
                        <div className="text-sm text-gray-500">{dispute.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">${dispute.amount}</div>
                    <div className="text-sm text-red-600">Disputed: ${dispute.disputeAmount}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(dispute.status)}`}>
                      {dispute.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(dispute.priority)}`}>
                      {dispute.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDispute(dispute);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {dispute.status === "pending" && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResolveDispute(dispute.id, "approved");
                            }}
                            className="p-1 text-gray-400 hover:text-green-600"
                            title="Resolve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRejectDispute(dispute.id, "insufficient evidence");
                            }}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispute Details Modal */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Dispute Details</h3>
                <button
                  onClick={() => setSelectedDispute(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Dispute Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Dispute Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Dispute ID:</span>
                        <span className="text-sm text-gray-900">{selectedDispute.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Booking ID:</span>
                        <span className="text-sm text-gray-900">{selectedDispute.bookingId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Amount:</span>
                        <span className="text-sm text-gray-900">${selectedDispute.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Disputed Amount:</span>
                        <span className="text-sm text-red-600">${selectedDispute.disputeAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Status:</span>
                        <span className={`text-sm px-2 py-1 rounded ${getStatusBadge(selectedDispute.status)}`}>
                          {selectedDispute.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">User Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">User ID:</span>
                        <span className="text-sm text-gray-900">{selectedDispute.userId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Name:</span>
                        <span className="text-sm text-gray-900">{selectedDispute.userName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Email:</span>
                        <span className="text-sm text-gray-900">{selectedDispute.userEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">Created:</span>
                        <span className="text-sm text-gray-900">
                          {new Date(selectedDispute.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Description</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {selectedDispute.description}
                  </p>
                </div>

                {/* Evidence */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Evidence</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDispute.evidence.map((file, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {file}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {selectedDispute.status === "pending" && (
                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <button
                      onClick={() => handleRejectDispute(selectedDispute.id, "insufficient evidence")}
                      className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                    >
                      Reject Dispute
                    </button>
                    <button
                      onClick={() => handleResolveDispute(selectedDispute.id, "approved")}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      Resolve Dispute
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DisputeManagement;
