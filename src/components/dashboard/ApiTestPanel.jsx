import { useState } from "react";
import ApiTester from "../../services/apiTester";

const ApiTestPanel = () => {
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const runApiTests = async () => {
    setTesting(true);
    setTestResults(null);

    try {
      const tester = new ApiTester();
      const results = await tester.runAllTests();
      setTestResults(results);
      setShowResults(true);
    } catch (error) {
      console.error("Test execution failed:", error);
    } finally {
      setTesting(false);
    }
  };

  const renderTestResults = () => {
    if (!testResults) return null;

    const { results, testResults: logs } = testResults;
    const passed = Object.values(results).filter(Boolean).length;
    const total = Object.keys(results).length;

    return (
      <div className="mt-6 space-y-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Test Results Summary
          </h3>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{total}</div>
              <div className="text-sm text-gray-500">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{passed}</div>
              <div className="text-sm text-gray-500">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {total - passed}
              </div>
              <div className="text-sm text-gray-500">Failed</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Test Suite Results:</h4>
            {Object.entries(results).map(([name, passed]) => (
              <div
                key={name}
                className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">{name}</span>
                <span
                  className={`text-sm font-medium ${
                    passed ? "text-green-600" : "text-red-600"
                  }`}>
                  {passed ? "✅ PASSED" : "❌ FAILED"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Detailed Logs
          </h3>
          <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">
                <span className="text-gray-400 text-xs">{log.timestamp}</span>
                <span
                  className={`ml-2 text-sm ${
                    log.type === "success"
                      ? "text-green-400"
                      : log.type === "error"
                      ? "text-red-400"
                      : "text-white"
                  }`}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            API Integration Testing
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Test all backend API integrations and authentication flows
          </p>
        </div>
        <button
          onClick={runApiTests}
          disabled={testing}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
          {testing ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running Tests...
            </>
          ) : (
            "Run API Tests"
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Auth Service</h3>
          <p className="text-xs text-blue-600 mt-1">
            Admin authentication & user management
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">
            Scooter Management
          </h3>
          <p className="text-xs text-green-600 mt-1">
            CRUD operations for scooters
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800">
            Ride Management
          </h3>
          <p className="text-xs text-yellow-600 mt-1">
            Booking and ride tracking
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800">
            IoT Integration
          </h3>
          <p className="text-xs text-purple-600 mt-1">
            Telemetry and maintenance
          </p>
        </div>
      </div>

      {showResults && renderTestResults()}
    </div>
  );
};

export default ApiTestPanel;
