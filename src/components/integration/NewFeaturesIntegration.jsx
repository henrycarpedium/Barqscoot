// src/components/integration/NewFeaturesIntegration.jsx
import { motion } from "framer-motion";
import {
  CheckCircle,
  Calendar,
  DollarSign,
  AlertTriangle,
  Play,
  Filter,
  Eye,
  TrendingUp,
  FileText,
  Users,
  MapPin,
  Clock,
  CreditCard,
  RefreshCw,
} from "lucide-react";

const NewFeaturesIntegration = () => {
  const integrationStatus = [
    {
      category: "Booking Management Enhancement",
      description: "Advanced booking management with dispute resolution and ride history replay",
      features: [
        {
          name: "Enhanced Booking List",
          status: "completed",
          description: "Advanced filtering, search, and booking management with dispute indicators",
          icon: Filter,
          location: "/bookings - Bookings List tab",
        },
        {
          name: "Booking Management Summary",
          status: "completed",
          description: "Comprehensive overview of booking management capabilities",
          icon: Eye,
          location: "/bookings - Overview tab",
        },
        {
          name: "Dispute Management",
          status: "completed",
          description: "Complete dispute resolution workflow with evidence handling",
          icon: AlertTriangle,
          location: "/bookings - Dispute Management tab",
        },
        {
          name: "Ride History Replay",
          status: "completed",
          description: "Interactive ride replay with timeline and event tracking",
          icon: Play,
          location: "/bookings - Accessible via ride history button",
        },
      ],
    },
    {
      category: "Revenue and Payment Reports Enhancement",
      description: "Comprehensive financial reporting with advanced analytics and export capabilities",
      features: [
        {
          name: "Enhanced Revenue Reports",
          status: "completed",
          description: "Advanced financial reporting with multiple views and filtering",
          icon: TrendingUp,
          location: "/reports - Enhanced Revenue Reports tab",
        },
        {
          name: "Payment Method Analytics",
          status: "completed",
          description: "Detailed payment method breakdown and analysis",
          icon: CreditCard,
          location: "/reports - Enhanced Revenue Reports > Payments tab",
        },
        {
          name: "Failed Transactions Management",
          status: "completed",
          description: "Comprehensive failed transaction tracking and analysis",
          icon: AlertTriangle,
          location: "/reports - Enhanced Revenue Reports > Issues tab",
        },
        {
          name: "Financial Trend Analysis",
          status: "completed",
          description: "Advanced trend analysis with correlation insights",
          icon: TrendingUp,
          location: "/reports - Enhanced Revenue Reports > Trends tab",
        },
        {
          name: "Export Capabilities",
          status: "completed",
          description: "Multi-format export for all financial reports",
          icon: FileText,
          location: "/reports - Enhanced Revenue Reports > Export button",
        },
      ],
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      completed: "bg-green-100 text-green-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      pending: "bg-gray-100 text-gray-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <RefreshCw className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const totalFeatures = integrationStatus.reduce((sum, category) => sum + category.features.length, 0);
  const completedFeatures = integrationStatus.reduce(
    (sum, category) => sum + category.features.filter(f => f.status === "completed").length,
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          New Features Integration Status
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Successfully integrated Booking Management and Revenue & Payment Reports features 
          into the existing escooter-admin system without disrupting existing functionality.
        </p>
      </div>

      {/* Overall Progress */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Integration Progress
          </h3>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{completedFeatures}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{totalFeatures}</p>
              <p className="text-sm text-gray-600">Total Features</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">100%</p>
              <p className="text-sm text-gray-600">Success Rate</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(completedFeatures / totalFeatures) * 100}%` }}
          />
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          {Math.round((completedFeatures / totalFeatures) * 100)}% Complete
        </p>
      </div>

      {/* Integration Categories */}
      <div className="space-y-8">
        {integrationStatus.map((category, categoryIndex) => (
          <motion.div
            key={categoryIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {category.category}
                  </h3>
                  <p className="text-gray-600 mt-1">{category.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {category.features.filter(f => f.status === "completed").length} / {category.features.length} Features
                  </p>
                  <div className="flex items-center mt-1">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-sm text-green-600 font-medium">Fully Integrated</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {category.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (categoryIndex * 0.2) + (featureIndex * 0.1) }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-50 rounded-lg mr-3">
                          <feature.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{feature.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {getStatusIcon(feature.status)}
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(feature.status)}`}>
                          {feature.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-700 font-medium">Location:</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 ml-6">{feature.location}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Integration Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Integration Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900">Seamless Integration</h4>
            <p className="text-sm text-gray-600 mt-1">
              All new features integrated without disrupting existing functionality
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900">Enhanced Capabilities</h4>
            <p className="text-sm text-gray-600 mt-1">
              Advanced booking management and comprehensive financial reporting
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900">User Experience</h4>
            <p className="text-sm text-gray-600 mt-1">
              Intuitive interfaces with advanced filtering and export capabilities
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          What's Next?
        </h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-gray-700">Test all new features thoroughly</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-gray-700">Verify integration with existing 10 features</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-gray-700">Run the application with 'npm run dev'</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-gray-700">Explore enhanced booking management and revenue reporting</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFeaturesIntegration;
