import { authService, scooterService } from './api';

/**
 * API Testing Utility for Barq Scooter Admin Panel
 * This utility helps test all backend integrations and authentication flows
 */

class ApiTester {
  constructor() {
    this.testResults = [];
    this.adminToken = null;
    this.userToken = null;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const result = { timestamp, message, type };
    this.testResults.push(result);
    console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`);
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Test Admin Authentication Flow
  async testAdminAuth() {
    this.log('Starting Admin Authentication Tests', 'info');

    try {
      // Test 1: Create Admin (if needed)
      this.log('Testing admin creation...', 'info');
      try {
        const createAdminResponse = await authService.createAdmin({
          email: 'admin@barqscoot.com',
          password: 'AdminPass123'
        });
        this.log('Admin created successfully', 'success');
      } catch (error) {
        if (error.response?.status === 409) {
          this.log('Admin already exists (expected)', 'info');
        } else {
          this.log(`Admin creation failed: ${error.message}`, 'error');
        }
      }

      // Test 2: Admin Login
      this.log('Testing admin login...', 'info');
      const loginResponse = await authService.login({
        email: 'admin@barqscoot.com',
        password: 'AdminPass123'
      });

      if (loginResponse.data.token) {
        this.adminToken = loginResponse.data.token;
        localStorage.setItem('token', this.adminToken);
        this.log('Admin login successful', 'success');
      } else {
        throw new Error('No token received from login');
      }

      // Test 3: Get Current User
      this.log('Testing get current user...', 'info');
      const userResponse = await authService.getCurrentUser();
      this.log(`Current user: ${userResponse.data.email}`, 'success');

      return true;
    } catch (error) {
      this.log(`Admin auth test failed: ${error.message}`, 'error');
      return false;
    }
  }

  // Test Scooter Management APIs
  async testScooterManagement() {
    this.log('Starting Scooter Management Tests', 'info');

    try {
      // Test 1: Get All Scooters
      this.log('Testing get all scooters...', 'info');
      const scootersResponse = await scooterService.getAllScooters();
      this.log(`Found ${scootersResponse.data.length || 0} scooters`, 'success');

      // Test 2: Create a test scooter
      this.log('Testing create scooter...', 'info');
      const newScooter = {
        name: `Test-Scooter-${Date.now()}`,
        location: '40.7128,-74.0060',
        lastStation: 'NYC-001',
        batteryLevel: 100,
        status: 'available'
      };

      const createScooterResponse = await scooterService.createScooter(newScooter);
      const scooterId = createScooterResponse.data.id || createScooterResponse.data._id;
      this.log(`Scooter created with ID: ${scooterId}`, 'success');

      // Test 3: Get scooter by ID
      if (scooterId) {
        this.log('Testing get scooter by ID...', 'info');
        const scooterResponse = await scooterService.getScooterById(scooterId);
        this.log(`Retrieved scooter: ${scooterResponse.data.name}`, 'success');

        // Test 4: Update scooter status
        this.log('Testing update scooter status...', 'info');
        await scooterService.updateScooterStatus(scooterId, 'maintenance');
        this.log('Scooter status updated to maintenance', 'success');

        // Test 5: Update scooter station
        this.log('Testing update scooter station...', 'info');
        await scooterService.updateScooterStation(scooterId, 'NYC-002');
        this.log('Scooter station updated', 'success');

        // Test 6: Update maintenance status
        this.log('Testing update maintenance status...', 'info');
        await scooterService.updateMaintenanceStatus(scooterId, 'maintenance', 'Test maintenance note');
        this.log('Maintenance status updated', 'success');

        // Clean up: Delete test scooter
        this.log('Cleaning up: deleting test scooter...', 'info');
        await scooterService.deleteScooter(scooterId);
        this.log('Test scooter deleted', 'success');
      }

      return true;
    } catch (error) {
      this.log(`Scooter management test failed: ${error.message}`, 'error');
      return false;
    }
  }

  // Test Ride Management APIs
  async testRideManagement() {
    this.log('Starting Ride Management Tests', 'info');

    try {
      // Test 1: Get all rides
      this.log('Testing get all rides...', 'info');
      const ridesResponse = await scooterService.getAllRides();
      this.log(`Found ${ridesResponse.data.length || 0} rides`, 'success');

      // Test 2: Get rides with filters
      this.log('Testing get rides with filters...', 'info');
      const filteredRidesResponse = await scooterService.getAllRides({
        status: 'completed',
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      });
      this.log(`Found ${filteredRidesResponse.data.length || 0} filtered rides`, 'success');

      return true;
    } catch (error) {
      this.log(`Ride management test failed: ${error.message}`, 'error');
      return false;
    }
  }

  // Test IoT Management APIs
  async testIoTManagement() {
    this.log('Starting IoT Management Tests', 'info');

    try {
      // Test 1: Get system health
      this.log('Testing get system health...', 'info');
      const healthResponse = await scooterService.getSystemHealth();
      this.log('System health retrieved', 'success');

      // Test 2: Get low battery scooters
      this.log('Testing get low battery scooters...', 'info');
      const lowBatteryResponse = await scooterService.getLowBatteryScooters();
      this.log(`Found ${lowBatteryResponse.data.length || 0} low battery scooters`, 'success');

      // Test 3: Get maintenance required
      this.log('Testing get maintenance required...', 'info');
      const maintenanceResponse = await scooterService.getMaintenanceRequired();
      this.log(`Found ${maintenanceResponse.data.length || 0} scooters requiring maintenance`, 'success');

      return true;
    } catch (error) {
      this.log(`IoT management test failed: ${error.message}`, 'error');
      return false;
    }
  }

  // Test User Management APIs
  async testUserManagement() {
    this.log('Starting User Management Tests', 'info');

    try {
      // Test 1: Get all users
      this.log('Testing get all users...', 'info');
      const usersResponse = await authService.getAllUsers();
      this.log(`Found ${usersResponse.data.length || 0} users`, 'success');

      // Test 2: Create a test user
      this.log('Testing create user...', 'info');
      const newUser = {
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: `+1234567${Date.now().toString().slice(-3)}`,
        email: `testuser${Date.now()}@example.com`,
        dateOfBirth: '1990-01-01T00:00:00Z',
        gender: 'male',
        location: 'New York'
      };

      const createUserResponse = await authService.createUser(newUser);
      this.log('Test user created successfully', 'success');

      return true;
    } catch (error) {
      this.log(`User management test failed: ${error.message}`, 'error');
      return false;
    }
  }

  // Run all tests
  async runAllTests() {
    this.log('Starting Complete API Integration Tests', 'info');
    this.testResults = [];

    const testSuite = [
      { name: 'Admin Authentication', test: () => this.testAdminAuth() },
      { name: 'Scooter Management', test: () => this.testScooterManagement() },
      { name: 'Ride Management', test: () => this.testRideManagement() },
      { name: 'IoT Management', test: () => this.testIoTManagement() },
      { name: 'User Management', test: () => this.testUserManagement() },
    ];

    const results = {};

    for (const { name, test } of testSuite) {
      this.log(`\n=== ${name} ===`, 'info');
      try {
        results[name] = await test();
        if (results[name]) {
          this.log(`✅ ${name} - PASSED`, 'success');
        } else {
          this.log(`❌ ${name} - FAILED`, 'error');
        }
      } catch (error) {
        results[name] = false;
        this.log(`❌ ${name} - ERROR: ${error.message}`, 'error');
      }

      // Add delay between tests
      await this.delay(1000);
    }

    // Summary
    const passed = Object.values(results).filter(Boolean).length;
    const total = Object.keys(results).length;

    this.log(`\n=== TEST SUMMARY ===`, 'info');
    this.log(`Passed: ${passed}/${total}`, passed === total ? 'success' : 'error');

    Object.entries(results).forEach(([name, passed]) => {
      this.log(`${passed ? '✅' : '❌'} ${name}`, passed ? 'success' : 'error');
    });

    return { results, testResults: this.testResults };
  }

  // Generate test report
  generateReport() {
    const passed = this.testResults.filter(r => r.type === 'success').length;
    const failed = this.testResults.filter(r => r.type === 'error').length;
    const total = this.testResults.length;

    return {
      summary: {
        total,
        passed,
        failed,
        success_rate: total > 0 ? ((passed / total) * 100).toFixed(2) : 0
      },
      logs: this.testResults
    };
  }
}

// Export for use in components
export default ApiTester;

// Utility functions for manual testing
export const testAdminLogin = async (email = 'admin@barqscoot.com', password = 'AdminPass123') => {
  try {
    const response = await authService.login({ email, password });
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
};

export const testCreateAdmin = async (email = 'admin@barqscoot.com', password = 'AdminPass123') => {
  try {
    const response = await authService.createAdmin({ email, password });
    console.log('Admin created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Admin creation failed:', error.response?.data || error.message);
    throw error;
  }
};

export const testGetScooters = async () => {
  try {
    const response = await scooterService.getAllScooters();
    console.log('Scooters retrieved:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get scooters failed:', error.response?.data || error.message);
    throw error;
  }
};
