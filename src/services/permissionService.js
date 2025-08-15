// Simple permission service for admin controls

// User roles
export const ROLES = {
  ADMIN: 'admin',
  PRICING_MANAGER: 'pricing_manager',
  VIEWER: 'viewer'
};

// Current user (mock - in real app this comes from auth)
let currentUser = {
  id: 'admin-001',
  name: 'Administrator',
  email: 'admin@escooter.sa',
  role: ROLES.ADMIN
};

// Permission functions
const isAdmin = () => {
  return currentUser?.role === ROLES.ADMIN;
};

const canManualSurge = () => {
  return currentUser?.role === ROLES.ADMIN || currentUser?.role === ROLES.PRICING_MANAGER;
};

const canManageRules = () => {
  return currentUser?.role === ROLES.ADMIN || currentUser?.role === ROLES.PRICING_MANAGER;
};

const getRoleDisplayName = () => {
  const names = {
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.PRICING_MANAGER]: 'Pricing Manager',
    [ROLES.VIEWER]: 'Viewer'
  };
  return names[currentUser?.role] || 'Unknown';
};

// Change user role (for testing)
const setCurrentUser = (user) => {
  currentUser = { ...user };
  console.log('🔄 User role changed to:', getRoleDisplayName());
};

// React hook
export const usePermissions = () => {
  return {
    user: currentUser,
    isAdmin,
    canManualSurge,
    canManageRules,
    getRoleDisplayName,
    setCurrentUser
  };
};

export const permissionService = {
  getCurrentUser: () => currentUser,
  setCurrentUser,
  isAdmin,
  canManualSurge,
  canManageRules,
  getRoleDisplayName,
  ROLES
};

export default permissionService;
