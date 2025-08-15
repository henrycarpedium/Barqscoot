// src/components/support/TicketList.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Timer,
  Loader,
  RefreshCw,
  Edit,
  Eye,
  UserCheck,
  Trash2,
  MessageSquare,
  CheckCircle2,
  XCircle,
  RotateCcw,
  X,
  Download,
} from "lucide-react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supportService } from "../../services/supportApi";
import NewTicketForm from "./NewTicketForm";

const TicketList = ({ onTicketSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const queryClient = useQueryClient();
  const searchInputRef = React.useRef(null);

  // Fetch tickets with filters
  const {
    data: tickets = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["support-tickets", filterStatus, filterPriority, filterCategory, searchTerm],
    queryFn: async () => {
      const filters = {};
      if (filterStatus) filters.status = filterStatus;
      if (filterPriority) filters.priority = filterPriority;
      if (filterCategory) filters.category = filterCategory;
      if (searchTerm) filters.search = searchTerm;

      const response = await supportService.getAllTickets(filters);
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch agents for assignment
  const { data: agents = [] } = useQuery({
    queryKey: ["support-agents"],
    queryFn: async () => {
      const response = await supportService.getAllAgents();
      return response.data;
    },
  });

  // Update ticket status mutation
  const updateTicketMutation = useMutation({
    mutationFn: async ({ ticketId, updateData }) => {
      return await supportService.updateTicket(ticketId, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["support-tickets"]);
      setOpenDropdown(null);
    },
    onError: (error) => {
      console.error("Error updating ticket:", error);
      alert("Failed to update ticket. Please try again.");
    }
  });

  // Assign ticket mutation
  const assignTicketMutation = useMutation({
    mutationFn: async ({ ticketId, agentId }) => {
      return await supportService.assignTicket(ticketId, agentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["support-tickets"]);
      setOpenDropdown(null);
    },
    onError: (error) => {
      console.error("Error assigning ticket:", error);
      alert("Failed to assign ticket. Please try again.");
    }
  });

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300); // 300ms delay

    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClearSearch();
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Invalidate and refetch the tickets
      await queryClient.invalidateQueries(["support-tickets"]);
      await refetch();

      // Show success feedback
      console.log("Tickets refreshed successfully");
    } catch (error) {
      console.error("Error refreshing tickets:", error);
      alert("Failed to refresh tickets. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleNewTicket = () => {
    setShowNewTicketForm(true);
  };

  const handleCloseNewTicketForm = () => {
    setShowNewTicketForm(false);
  };

  // Action handlers
  const handleViewTicket = (ticket, e) => {
    e.stopPropagation();
    onTicketSelect(ticket);
    setOpenDropdown(null);
  };

  const handleUpdateStatus = (ticket, newStatus, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to change ticket ${ticket.id} status to ${newStatus}?`)) {
      updateTicketMutation.mutate({
        ticketId: ticket.id,
        updateData: { status: newStatus }
      });
    }
  };

  const handleAssignTicket = (ticket, agentId, e) => {
    e.stopPropagation();
    const agent = agents.find(a => a.id === agentId);
    if (window.confirm(`Are you sure you want to assign ticket ${ticket.id} to ${agent?.name}?`)) {
      assignTicketMutation.mutate({
        ticketId: ticket.id,
        agentId: agentId
      });
    }
  };

  const handleDeleteTicket = (ticket, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ticket ${ticket.id}? This action cannot be undone.`)) {
      // Note: We would need a deleteTicket API function for this
      alert("Delete functionality would be implemented with a deleteTicket API call");
      setOpenDropdown(null);
    }
  };

  // Export functionality
  const handleExportTickets = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const csvHeaders = [
        'Ticket ID',
        'Title',
        'Description',
        'Customer Name',
        'Customer Email',
        'Status',
        'Priority',
        'Category',
        'Assigned To',
        'Created Date',
        'Updated Date',
        'Last Response'
      ];

      const csvData = tickets.map(ticket => [
        ticket.id,
        ticket.title,
        ticket.description || 'N/A',
        ticket.userName,
        ticket.userEmail || 'N/A',
        ticket.status,
        ticket.priority,
        ticket.category,
        ticket.assignedTo || 'Unassigned',
        ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A',
        ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleDateString() : 'N/A',
        ticket.lastResponse ? formatTimeAgo(ticket.lastResponse) : 'No response'
      ]);

      const csvContent = [
        csvHeaders.join(','),
        ...csvData.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `support_tickets_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('✅ Support tickets exported successfully!');
    } catch (error) {
      console.error('❌ Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Ctrl/Cmd + R to refresh
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        handleRefresh();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

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
        return <AlertCircle className="h-4 w-4" />;
      case "in_progress":
        return <Timer className="h-4 w-4" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Support Tickets</h2>
          <p className="text-sm text-gray-600">
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} found
                {searchTerm && (
                  <span className="ml-2 text-blue-600">
                    • Searching for "{searchTerm}"
                  </span>
                )}
                {(filterStatus || filterPriority || filterCategory) && (
                  <span className="ml-2 text-green-600">
                    • Filters applied
                  </span>
                )}
              </>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportTickets}
            disabled={isExporting}
            className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors"
          >
            <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg transition-colors ${
              isRefreshing
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={handleNewTicket}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search tickets by title, description, user... (Ctrl+K to focus, Esc to clear)"
            value={searchInput}
            onChange={handleSearch}
            onKeyDown={handleSearchKeyDown}
            className="pl-10 pr-12 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {searchInput && searchInput !== searchTerm && (
            <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
              <Loader className="h-4 w-4 text-blue-500 animate-spin" />
            </div>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="account">Account</option>
                <option value="sales">Sales</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setFilterStatus("");
                setFilterPriority("");
                setFilterCategory("");
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Tickets List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading tickets...</span>
        </div>
      ) : isError ? (
        <div className="text-center py-12 text-red-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>Error loading tickets. Please try again.</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>No tickets found matching your criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <motion.tr
                    key={ticket.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    onClick={() => onTicketSelect(ticket)}
                    className="cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(ticket.status)}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {ticket.id}
                          </div>
                          <div className="text-sm text-gray-600 truncate max-w-xs">
                            {ticket.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {ticket.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${ticket.userName}&background=0D8ABC&color=fff`}
                          alt={ticket.userName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {ticket.userName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {ticket.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          ticket.status
                        )}`}
                      >
                        {ticket.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {ticket.assignedToName ? (
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">
                            {ticket.assignedToName}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatTimeAgo(ticket.updatedAt)}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <div className="relative dropdown-container">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(openDropdown === ticket.id ? null : ticket.id);
                          }}
                          className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdown === ticket.id && (
                          <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                            <div className="py-1">
                              {/* View Details */}
                              <button
                                onClick={(e) => handleViewTicket(ticket, e)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <Eye className="w-4 h-4 mr-3" />
                                View Details
                              </button>

                              {/* Status Actions */}
                              {ticket.status !== 'in_progress' && (
                                <button
                                  onClick={(e) => handleUpdateStatus(ticket, 'in_progress', e)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <Timer className="w-4 h-4 mr-3" />
                                  Mark In Progress
                                </button>
                              )}

                              {ticket.status !== 'resolved' && (
                                <button
                                  onClick={(e) => handleUpdateStatus(ticket, 'resolved', e)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-3" />
                                  Mark Resolved
                                </button>
                              )}

                              {ticket.status !== 'closed' && (
                                <button
                                  onClick={(e) => handleUpdateStatus(ticket, 'closed', e)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <XCircle className="w-4 h-4 mr-3" />
                                  Close Ticket
                                </button>
                              )}

                              {ticket.status === 'closed' && (
                                <button
                                  onClick={(e) => handleUpdateStatus(ticket, 'open', e)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <RotateCcw className="w-4 h-4 mr-3" />
                                  Reopen Ticket
                                </button>
                              )}

                              {/* Divider */}
                              <div className="border-t border-gray-100 my-1"></div>

                              {/* Assignment */}
                              {agents.length > 0 && (
                                <div className="px-4 py-2">
                                  <div className="text-xs font-medium text-gray-500 mb-2">Assign to Agent</div>
                                  {agents.map((agent) => (
                                    <button
                                      key={agent.id}
                                      onClick={(e) => handleAssignTicket(ticket, agent.id, e)}
                                      className={`flex items-center w-full px-2 py-1 text-sm rounded transition-colors ${
                                        ticket.assignedTo === agent.id
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'text-gray-700 hover:bg-gray-100'
                                      }`}
                                    >
                                      <UserCheck className="w-3 h-3 mr-2" />
                                      {agent.name}
                                      {ticket.assignedTo === agent.id && (
                                        <span className="ml-auto text-xs">(Current)</span>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* Divider */}
                              <div className="border-t border-gray-100 my-1"></div>

                              {/* Delete */}
                              <button
                                onClick={(e) => handleDeleteTicket(ticket, e)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 mr-3" />
                                Delete Ticket
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Ticket Form Modal */}
      {showNewTicketForm && (
        <NewTicketForm
          onClose={handleCloseNewTicketForm}
          onTicketCreated={(newTicket) => {
            // Optionally handle the newly created ticket
            console.log("New ticket created:", newTicket);
          }}
        />
      )}
    </div>
  );
};

export default TicketList;
