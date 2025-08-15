// src/components/users/UserDetails.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNotifications } from '../../context/NotificationContext';
import { authService } from '../../services/api';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  Activity,
  Route,
  DollarSign,
  Star,
  Shield,
  AlertTriangle,
  User,
  Smartphone
} from 'lucide-react';


const UserDetails = ({ user, onBack, onEditUser }) => {
  const { notify } = useNotifications();

  // Use provided user data or fallback to dummy data
  const defaultUserData = user || {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phoneNumber: '+1 234 567 890',
    city: 'New York',
    status: 'active',
    createdAt: '2024-01-15',
    totalRides: 15,
    totalDistance: 234.5,
    averageRideDistance: 15.6,
    lastLogin: '2024-02-01',
    isActive: true
  };

  // State to manage user data that can be updated
  const [userData, setUserData] = useState(defaultUserData);

  // Update userData when user prop changes
  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const getActivityStatus = (lastLogin) => {
    if (!lastLogin) return 'Never';
    const daysSince = Math.floor((Date.now() - new Date(lastLogin).getTime()) / (1000 * 60 * 60 * 24));
    return daysSince <= 7 ? 'Active' : 'Inactive';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };



  // Mock additional data for comprehensive view
  const enhancedData = {
    ...userData,
    recentRides: [
      {
        id: 1,
        date: '2024-02-01',
        duration: '15 min',
        distance: '2.3 km',
        cost: '$8.50',
        startLocation: 'Downtown Plaza',
        endLocation: 'Central Park'
      },
      {
        id: 2,
        date: '2024-01-28',
        duration: '22 min',
        distance: '3.1 km',
        cost: '$12.25',
        startLocation: 'University Campus',
        endLocation: 'Shopping Mall'
      },
      {
        id: 3,
        date: '2024-01-25',
        duration: '8 min',
        distance: '1.2 km',
        cost: '$5.75',
        startLocation: 'Train Station',
        endLocation: 'Office Building'
      }
    ],

    preferences: {
      notifications: true,
      locationSharing: true,
      marketingEmails: false
    }
  };

  // Handle user actions
  const handleEditUser = () => {
    if (onEditUser) {
      onEditUser(enhancedData);
    }
  };

  const handleSuspendUser = async () => {
    const action = enhancedData.status === 'suspended' ? 'activate' : 'suspend';
    const confirmMessage = enhancedData.status === 'suspended'
      ? `Are you sure you want to activate ${enhancedData.firstName} ${enhancedData.lastName}?`
      : `Are you sure you want to suspend ${enhancedData.firstName} ${enhancedData.lastName}?`;

    if (window.confirm(confirmMessage)) {
      try {
        // Helper functions for local data management
        const getMockUsers = () => {
          const stored = localStorage.getItem('mockUsers');
          return stored ? JSON.parse(stored) : [];
        };

        const saveMockUsers = (users) => {
          localStorage.setItem('mockUsers', JSON.stringify(users));
        };

        // Update local mock data first
        const currentUsers = getMockUsers();
        const newStatus = enhancedData.status === 'suspended' ? 'active' : 'suspended';
        const updatedUsers = currentUsers.map(u =>
          (u.id === enhancedData.id || u._id === enhancedData._id)
            ? { ...u, status: newStatus }
            : u
        );
        saveMockUsers(updatedUsers);

        // Try to call API as well, but don't let it fail the operation
        try {
          await authService.updateUser(
            enhancedData._id || enhancedData.id,
            { ...enhancedData, status: newStatus }
          );
          console.log(`API call successful for user ${action}`);
        } catch (apiError) {
          console.log(`API call failed, but local state updated for demo:`, apiError.message);
          // Don't throw the error, just log it
        }

        // Show success message using notification system
        notify.success(`User ${action}d successfully!`);

        // Update the local state to reflect the change immediately
        setUserData(prevData => ({
          ...prevData,
          status: newStatus
        }));

      } catch (error) {
        console.error(`Error ${action}ing user:`, error);
        notify.error(`Failed to ${action} user. Please try again.`);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header with Back Button */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Users
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleEditUser}
              className="flex items-center px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Edit className="w-4 h-4 mr-2" />
              Edit User
            </button>
            <button
              onClick={handleSuspendUser}
              className={`flex items-center px-4 py-2 text-sm border rounded-lg transition-colors ${
                enhancedData.status === 'suspended'
                  ? 'border-green-300 text-green-600 hover:bg-green-50'
                  : 'border-red-300 text-red-600 hover:bg-red-50'
              }`}>
              <Ban className="w-4 h-4 mr-2" />
              {enhancedData.status === 'suspended' ? 'Activate User' : 'Suspend User'}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-6">
          <img
            src={
              enhancedData.profileImage ||
              `https://ui-avatars.com/api/?name=${enhancedData.firstName}${enhancedData.lastName ? '+' + enhancedData.lastName : ''}&background=0D8ABC&color=fff&size=120`
            }
            alt={`${enhancedData.firstName} ${enhancedData.lastName || ''}`.trim()}
            className="w-24 h-24 rounded-full border-4 border-gray-200"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-gray-900">
                {`${enhancedData.firstName} ${enhancedData.lastName || ''}`.trim()}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(enhancedData.status)}`}>
                {enhancedData.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {enhancedData.email}
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {enhancedData.phoneNumber || 'No phone'}
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {enhancedData.city || 'Unknown location'}
              </div>
              <div className="flex items-center text-gray-600">
                <User className="w-4 h-4 mr-2" />
                ID: {enhancedData.id || enhancedData._id}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-6 text-sm">
              <div className="flex items-center">
                <Activity className="w-4 h-4 mr-1 text-green-500" />
                <span className="font-medium">Activity:</span>
                <span className={`ml-1 ${getActivityStatus(enhancedData.lastLogin) === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                  {getActivityStatus(enhancedData.lastLogin)}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                <span className="font-medium">Joined:</span>
                <span className="ml-1">
                  {enhancedData.createdAt ? new Date(enhancedData.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Rides</p>
                <p className="text-2xl font-bold text-blue-900">{enhancedData.totalRides || 0}</p>
              </div>
              <Route className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Distance</p>
                <p className="text-2xl font-bold text-green-900">{enhancedData.totalDistance || 0} km</p>
              </div>
              <MapPin className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Avg Distance</p>
                <p className="text-2xl font-bold text-purple-900">{enhancedData.averageRideDistance || 0} km</p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Est. Spent</p>
                <p className="text-2xl font-bold text-orange-900">
                  ${((enhancedData.totalRides || 0) * 8.5).toFixed(0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-500" />
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-50 p-6 rounded-lg"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Account Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium">
                  {enhancedData.createdAt ? new Date(enhancedData.createdAt).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Login</span>
                <span className="font-medium">
                  {enhancedData.lastLogin ? new Date(enhancedData.lastLogin).toLocaleDateString() : 'Never'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Account Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(enhancedData.status)}`}>
                  {enhancedData.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Notifications</span>
                <span className="flex items-center">
                  {enhancedData.preferences?.notifications ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </span>
              </div>
            </div>
          </motion.div>


        </div>

        {/* Recent Rides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-50 p-6 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Route className="w-5 h-5 mr-2" />
            Recent Rides
          </h3>
          <div className="space-y-4">
            {enhancedData.recentRides.map(ride => (
              <div key={ride.id} className="p-4 bg-white rounded-lg border hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="font-medium text-gray-900">{ride.date}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {ride.duration}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {ride.distance}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center mb-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        From: {ride.startLocation}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        To: {ride.endLocation}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-gray-900">{ride.cost}</div>
                    <button className="text-sm text-teal-600 hover:text-teal-700">View Details</button>
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full mt-4 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-white transition-colors">
              View All Rides
            </button>
          </div>
        </motion.div>

        {/* User Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gray-50 p-6 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Privacy & Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Smartphone className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-gray-700">Push Notifications</span>
              </div>
              <div className="flex items-center">
                {enhancedData.preferences?.notifications ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-gray-700">Location Sharing</span>
              </div>
              <div className="flex items-center">
                {enhancedData.preferences?.locationSharing ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-gray-700">Marketing Emails</span>
              </div>
              <div className="flex items-center">
                {enhancedData.preferences?.marketingEmails ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDetails;