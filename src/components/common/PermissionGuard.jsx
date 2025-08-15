// Simple permission guard component
import React from 'react';
import { usePermissions } from '../../services/permissionService';
import { Lock } from 'lucide-react';

// Admin-only guard
export const AdminOnlyGuard = ({ children, showError = true }) => {
  const { isAdmin } = usePermissions();
  
  if (isAdmin()) {
    return children;
  }
  
  if (showError) {
    return (
      <div className="flex items-center justify-center p-3 bg-gray-100 rounded-lg">
        <Lock className="h-4 w-4 text-gray-500 mr-2" />
        <span className="text-sm text-gray-600">Admin Only</span>
      </div>
    );
  }
  
  return null;
};

// Surge permission guard
export const SurgePermissionGuard = ({ children, showError = true }) => {
  const { canManualSurge } = usePermissions();
  
  if (canManualSurge()) {
    return children;
  }
  
  if (showError) {
    return (
      <div className="flex items-center justify-center p-3 bg-gray-100 rounded-lg">
        <Lock className="h-4 w-4 text-gray-500 mr-2" />
        <span className="text-sm text-gray-600">Admin Only</span>
      </div>
    );
  }
  
  return null;
};

// User role display
export const RoleDisplay = ({ className = "" }) => {
  const { user, getRoleDisplayName } = usePermissions();
  
  if (!user) return null;
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
        <span className="text-xs font-medium text-blue-600">
          {user.name.split(' ').map(n => n[0]).join('')}
        </span>
      </div>
      <div className="text-sm">
        <div className="font-medium text-gray-900">{user.name}</div>
        <div className="text-xs text-blue-600">{getRoleDisplayName()}</div>
      </div>
    </div>
  );
};

export default AdminOnlyGuard;
