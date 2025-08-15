import axios from 'axios';

// Base URLs for our services
const AUTH_BASE_URL = 'http://16.24.143.197:8091/api';
const SCOOTER_BASE_URL = 'http://16.24.143.197:8080/api';

// Development mode flag - set to true when API is not available
const DEVELOPMENT_MODE = true;

// Mock authentication for development
const mockAuth = {
  login: async (credentials) => {
    console.log('🔧 DEVELOPMENT MODE: Using mock authentication');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials
    if (credentials.email === 'admin@barqscoot.com' && credentials.password === 'AdminPass123') {
      const mockResponse = {
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          admin: {
            id: 1,
            email: 'admin@barqscoot.com',
            name: 'Admin User',
            role: 'admin'
          }
        }
      };
      console.log('✅ Mock login successful:', mockResponse.data);
      return mockResponse;
    } else {
      console.log('❌ Mock login failed: Invalid credentials');
      throw new Error('Invalid credentials');
    }
  },

  getCurrentUser: async () => {
    console.log('🔧 DEVELOPMENT MODE: Using mock getCurrentUser');
    await new Promise(resolve => setTimeout(resolve, 500));

    const mockResponse = {
      data: {
        id: 1,
        email: 'admin@barqscoot.com',
        name: 'Admin User',
        role: 'admin'
      }
    };
    console.log('✅ Mock getCurrentUser successful:', mockResponse.data);
    return mockResponse;
  }
};

// Create axios instances for each service
export const authApi = axios.create({
  baseURL: AUTH_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

export const scooterApi = axios.create({
  baseURL: SCOOTER_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// Token management
const getToken = () => {
  const token = localStorage.getItem('token');
  console.log('Getting token:', token ? 'Token exists' : 'No token');
  return token;
};

// Request interceptors to add auth tokens
authApi.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // Ensure proper Bearer token format and trim any whitespace
      const cleanToken = token.trim();
      config.headers.Authorization = `Bearer ${cleanToken}`;
      // Add admin token header
      config.headers['X-Admin-Token'] = 'true';
      // Add additional headers for debugging
      config.headers['X-Request-Type'] = 'admin';
      console.log('Added token to request headers:', {
        url: config.url,
        tokenLength: cleanToken.length,
        headers: config.headers,
        token: cleanToken // Log the actual token for debugging
      });
    } else {
      console.log('No token available for request:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

scooterApi.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // Ensure proper Bearer token format and trim any whitespace
      const cleanToken = token.trim();
      config.headers.Authorization = `Bearer ${cleanToken}`;
      // Add admin token header
      config.headers['X-Admin-Token'] = 'true';
      console.log('Added token to request headers:', {
        url: config.url,
        tokenLength: cleanToken.length,
        headers: config.headers
      });
    } else {
      console.log('No token available for request:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptors for error handling
const handleResponse = (response) => {
  console.log('API Response:', {
    url: response.config.url,
    status: response.status,
    data: response.data
  });
  return response;
};

const handleError = (error) => {
  console.error('API Error:', {
    url: error.config?.url,
    status: error.response?.status,
    data: error.response?.data,
    message: error.message
  });

  // Handle unauthorized access
  if (error.response?.status === 401) {
    console.log('Unauthorized access, token might be invalid');
    // Don't redirect immediately, let the auth context handle it
    return Promise.reject(error);
  }

  return Promise.reject(error);
};

// Apply error handling interceptors
authApi.interceptors.response.use(handleResponse, handleError);
scooterApi.interceptors.response.use(handleResponse, handleError);

// Auth API services
export const authService = {
  // Admin Authentication
  createAdmin: (adminData) =>
    authApi.post('/admin/create', adminData),

  login: async (credentials) => {
    try {
      console.log('🔐 Attempting login with credentials:', { email: credentials.email });

      // Use mock authentication in development mode
      if (DEVELOPMENT_MODE) {
        console.log('🔧 Development mode enabled - using mock authentication');
        return await mockAuth.login(credentials);
      }

      console.log('🌐 Production mode - calling real API');
      const response = await authApi.post('/admin/login', credentials);

      // Store token immediately after successful login
      if (response.data.token) {
        const token = response.data.token.trim();
        localStorage.setItem('token', token);
        console.log('✅ Stored token after login:', {
          tokenLength: token.length,
          token: token // Log the actual token for debugging
        });
      }
      return response;
    } catch (error) {
      console.error('❌ Login error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        developmentMode: DEVELOPMENT_MODE
      });

      // If API is not available and we're not in development mode, suggest enabling it
      if (error.code === 'ECONNREFUSED' || error.message.includes('connect')) {
        console.error('🚨 API server appears to be unavailable. Consider enabling DEVELOPMENT_MODE in api.js');
      }

      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      console.log('👤 Getting current user...');

      // Use mock authentication in development mode
      if (DEVELOPMENT_MODE) {
        console.log('🔧 Development mode enabled - using mock getCurrentUser');
        return await mockAuth.getCurrentUser();
      }

      console.log('🌐 Production mode - calling real API');
      const response = await authApi.get('/admin/me');
      console.log('✅ getCurrentUser response:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });
      return response;
    } catch (error) {
      console.error('❌ getCurrentUser error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        headers: error.response?.headers,
        developmentMode: DEVELOPMENT_MODE
      });

      // If API is not available and we're not in development mode, suggest enabling it
      if (error.code === 'ECONNREFUSED' || error.message.includes('connect')) {
        console.error('🚨 API server appears to be unavailable. Consider enabling DEVELOPMENT_MODE in api.js');
      }

      throw error;
    }
  },

  // User management
  getAllUsers: () =>
    authApi.get('/users'),

  getUserById: (userId) =>
    authApi.get(`/users/${userId}`),

  createUser: (userData) =>
    authApi.post('/auth/signup', userData),

  updateUser: (userId, userData) =>
    authApi.put(`/users/${userId}`, userData),

  deleteUser: (userId) =>
    authApi.delete(`/users/${userId}`),

  // OTP Management
  sendOTP: (phoneData) =>
    authApi.post('/auth/send-otp', phoneData),

  verifyOTP: (otpData) =>
    authApi.post('/auth/verify-otp', otpData),
};

// Scooter API services
export const scooterService = {
  // Scooter management
  getAllScooters: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.minBattery) params.append('minBattery', filters.minBattery);
    return scooterApi.get(`/scooters/?${params}`);
  },

  getScooterById: (scooterId) =>
    scooterApi.get(`/scooters/${scooterId}`),

  createScooter: (scooterData) =>
    scooterApi.post('/scooters/admin/', scooterData),

  updateScooter: (scooterId, scooterData) =>
    scooterApi.put(`/scooters/admin/${scooterId}`, scooterData),

  updateScooterStatus: (scooterId, status) =>
    scooterApi.put(`/scooters/admin/${scooterId}/status`, { status }),

  deleteScooter: (scooterId) =>
    scooterApi.delete(`/scooters/admin/${scooterId}`),

  // Ride/Booking management
  getAllRides: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    return scooterApi.get(`/rides/all?${params}`);
  },

  getRideById: (rideId) =>
    scooterApi.get(`/rides/${rideId}`),

  endRide: (rideId) =>
    scooterApi.put(`/rides/${rideId}/end`),

  // IoT Management
  getLatestTelemetry: (scooterId) =>
    scooterApi.get(`/iot/telemetry/${scooterId}`),

  getTelemetryHistory: (scooterId, startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);
    return scooterApi.get(`/iot/telemetry/${scooterId}/history?${params}`);
  },

  getMaintenanceRequired: () =>
    scooterApi.get('/iot/maintenance/required'),

  getLowBatteryScooters: () =>
    scooterApi.get('/iot/battery/low'),

  getSystemHealth: () =>
    scooterApi.get('/iot/health'),
};

// Support service import
export { supportService } from './supportApi';

// Pricing service import
export { pricingService } from './pricingApi';

export default { authService, scooterService };
