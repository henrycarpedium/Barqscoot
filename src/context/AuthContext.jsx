import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      console.log("🔍 Checking authentication status...");
      console.log("📝 Token exists:", !!token);
      console.log("📝 Token value:", token ? `${token.substring(0, 20)}...` : 'null');

      if (token) {
        console.log("🔐 Token found, verifying with server...");
        const response = await authService.getCurrentUser();
        console.log("✅ Auth check successful:", response.data);
        setUser(response.data);
        setIsAuthenticated(true);
        console.log("🎉 User authenticated successfully");
      } else {
        console.log("❌ No token found, user not authenticated");
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Auth check failed:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });

      // Clear invalid token
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUser(null);

      // Set user-friendly error message
      const errorMessage = error.response?.status === 401
        ? "Session expired. Please log in again."
        : "Authentication check failed. Please try logging in.";
      setError(errorMessage);

      console.log("🧹 Cleared authentication state due to error");
    } finally {
      setLoading(false);
      console.log("✅ Auth check completed");
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      console.log("🔐 Starting login process...");
      console.log("📧 Email:", credentials.email);
      console.log("🔑 Password provided:", !!credentials.password);

      const response = await authService.login(credentials);
      console.log("📨 Login response received:", {
        hasToken: !!response.data.token,
        hasAdmin: !!response.data.admin,
        tokenLength: response.data.token?.length
      });

      const { token, admin } = response.data;

      if (token) {
        console.log("💾 Storing token in localStorage...");
        localStorage.setItem("token", token);
        setUser(admin);
        setIsAuthenticated(true);
        console.log("🎉 Login successful! User authenticated:", {
          userId: admin?.id,
          userEmail: admin?.email,
          userName: admin?.name
        });
        return { success: true };
      } else {
        console.error("❌ No token received in response");
        setError("Authentication failed - no token received");
        return { success: false, error: "Authentication failed - no token received" };
      }
    } catch (error) {
      console.error("❌ Login failed:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack
      });

      // Provide user-friendly error messages
      let errorMessage = "Login failed";
      if (error.response?.status === 401) {
        errorMessage = "Invalid email or password";
      } else if (error.response?.status === 403) {
        errorMessage = "Access denied";
      } else if (error.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (error.message.includes('Network Error') || error.code === 'ECONNREFUSED') {
        errorMessage = "Unable to connect to server. Please check your connection.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
      console.log("✅ Login process completed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    isAuthenticated,
    loading,
    user,
    error,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
