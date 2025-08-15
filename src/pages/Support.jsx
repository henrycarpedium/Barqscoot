// src/pages/Support.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Headphones, 
  Ticket, 
  Clock, 
  Users, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Timer,
  Star
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supportService } from "../services/supportApi";
import SupportDashboard from "../components/support/SupportDashboard";
import TicketList from "../components/support/TicketList";
import TicketDetails from "../components/support/TicketDetails";

const Support = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Fetch support metrics
  const { data: metricsData, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["support-metrics"],
    queryFn: async () => {
      const response = await supportService.getMetrics();
      return response.data;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch tickets for quick stats
  const { data: ticketsData, isLoading: isLoadingTickets } = useQuery({
    queryKey: ["support-tickets-overview"],
    queryFn: async () => {
      const response = await supportService.getAllTickets();
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Headphones },
    { id: "tickets", label: "All Tickets", icon: Ticket },
  ];

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    setActiveTab("ticket-details");
  };

  const handleBackToTickets = () => {
    setSelectedTicket(null);
    setActiveTab("tickets");
  };

  // Calculate quick stats
  const openTickets = ticketsData?.filter(t => t.status === 'open')?.length || 0;
  const inProgressTickets = ticketsData?.filter(t => t.status === 'in_progress')?.length || 0;
  const unassignedTickets = ticketsData?.filter(t => !t.assignedTo)?.length || 0;
  const highPriorityTickets = ticketsData?.filter(t => t.priority === 'high')?.length || 0;

  // Quick stats data
  const quickStats = [
    {
      title: "Open Tickets",
      value: isLoadingTickets ? "..." : openTickets.toString(),
      icon: AlertCircle,
      color: "orange",
      trend: "+3 today",
    },
    {
      title: "In Progress",
      value: isLoadingTickets ? "..." : inProgressTickets.toString(),
      icon: Timer,
      color: "blue",
      trend: "2 updated",
    },
    {
      title: "Unassigned",
      value: isLoadingTickets ? "..." : unassignedTickets.toString(),
      icon: Users,
      color: "red",
      trend: "Needs attention",
    },
    {
      title: "High Priority",
      value: isLoadingTickets ? "..." : highPriorityTickets.toString(),
      icon: TrendingUp,
      color: "purple",
      trend: "1 urgent",
    },
  ];

  const colorClasses = {
    orange: "bg-orange-50 text-orange-700",
    blue: "bg-blue-50 text-blue-700",
    red: "bg-red-50 text-red-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Headphones className="h-6 w-6 mr-3 text-blue-600" />
            {t('support.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('support.subtitle')}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {metricsData && (
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center text-green-600">
                <Star className="h-4 w-4 mr-1" />
                <span>{metricsData.customerSatisfaction}/5 {t('support.customerSatisfaction')}</span>
              </div>
              <div className="flex items-center text-blue-600">
                <Clock className="h-4 w-4 mr-1" />
                <span>{metricsData.avgResolutionTime}h {t('support.avgResponseTime')}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <h3 className="text-2xl font-semibold mt-2">{stat.value}</h3>
                  <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
                </div>
                <div className={`p-3 rounded-full ${colorClasses[stat.color]}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      {!selectedTicket && (
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
            {activeTab === "dashboard" && (
              <SupportDashboard 
                metrics={metricsData} 
                isLoading={isLoadingMetrics}
                onTicketSelect={handleTicketSelect}
              />
            )}
            {activeTab === "tickets" && (
              <TicketList onTicketSelect={handleTicketSelect} />
            )}
          </div>
        </div>
      )}

      {/* Ticket Details View */}
      {selectedTicket && (
        <TicketDetails 
          ticket={selectedTicket} 
          onBack={handleBackToTickets}
        />
      )}
    </div>
  );
};

export default Support;
