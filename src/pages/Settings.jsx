// src/pages/Settings.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Globe,
  Bell,
  CreditCard,
  Key,
  Save,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Download,
  Upload,
  Search,
  Filter,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  MapPin
} from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddRole, setShowAddRole] = useState(false);
  const [showAddLanguage, setShowAddLanguage] = useState(false);

  // Mock data for different settings
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "BarqScoot",
    supportEmail: "support@barqscoot.com",
    timezone: "UTC-5",
    currency: "USD",
    maintenanceMode: false,
    autoBackup: true,
    emailNotifications: true
  });

  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Super Admin",
      description: "Full system access",
      permissions: ["all"],
      userCount: 2,
      createdAt: "2024-01-01"
    },
    {
      id: 2,
      name: "Fleet Manager",
      description: "Manage scooters and fleet operations",
      permissions: ["scooters", "fleet", "geofencing"],
      userCount: 5,
      createdAt: "2024-01-05"
    },
    {
      id: 3,
      name: "Support Agent",
      description: "Handle customer support and incidents",
      permissions: ["incidents", "users", "notifications"],
      userCount: 8,
      createdAt: "2024-01-10"
    },
    {
      id: 4,
      name: "Analyst",
      description: "View reports and analytics",
      permissions: ["reports", "analytics"],
      userCount: 3,
      createdAt: "2024-01-15"
    }
  ]);

  const [languages, setLanguages] = useState([
    {
      code: "en",
      name: "English",
      nativeName: "English",
      isDefault: true,
      completeness: 100,
      lastUpdated: "2024-01-20"
    },
    {
      code: "ar",
      name: "Arabic",
      nativeName: "العربية",
      isDefault: false,
      completeness: 85,
      lastUpdated: "2024-01-18"
    },
    {
      code: "es",
      name: "Spanish",
      nativeName: "Español",
      isDefault: false,
      completeness: 92,
      lastUpdated: "2024-01-19"
    },
    {
      code: "fr",
      name: "French",
      nativeName: "Français",
      isDefault: false,
      completeness: 78,
      lastUpdated: "2024-01-17"
    }
  ]);



  const [pricingRules, setPricingRules] = useState([
    {
      id: 1,
      name: "Peak Hours Surge",
      description: "Increased pricing during rush hours",
      basePrice: 2.00,
      surgeMultiplier: 1.5,
      conditions: {
        timeRange: "07:00-09:00, 17:00-19:00",
        daysOfWeek: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        zones: ["downtown", "business_district"]
      },
      isActive: true,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Weekend Special",
      description: "Reduced pricing for weekend leisure rides",
      basePrice: 2.00,
      surgeMultiplier: 0.8,
      conditions: {
        timeRange: "10:00-16:00",
        daysOfWeek: ["saturday", "sunday"],
        zones: ["park_areas", "recreational"]
      },
      isActive: true,
      createdAt: "2024-01-10"
    },
    {
      id: 3,
      name: "High Demand Areas",
      description: "Dynamic pricing based on scooter availability",
      basePrice: 2.00,
      surgeMultiplier: 2.0,
      conditions: {
        availabilityThreshold: 10,
        zones: ["airport", "train_station", "university"]
      },
      isActive: false,
      createdAt: "2024-01-08"
    }
  ]);

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "security", label: "Security & Roles", icon: Shield },
    { id: "localization", label: "Multilingual", icon: Globe },
    { id: "pricing", label: "Dynamic Pricing", icon: DollarSign },
    { id: "api", label: "API & Integrations", icon: Key },
  ];



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <SettingsIcon className="h-6 w-6 mr-3 text-gray-600" />
          Settings
        </h1>
        <p className="text-gray-600 mt-1">
          Configure system settings and preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-gray-500 text-gray-900"
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

        <div className="p-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={generalSettings.companyName}
                      onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="UTC-5">UTC-5 (Eastern)</option>
                      <option value="UTC-6">UTC-6 (Central)</option>
                      <option value="UTC-7">UTC-7 (Mountain)</option>
                      <option value="UTC-8">UTC-8 (Pacific)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={generalSettings.currency}
                      onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="AED">AED - UAE Dirham</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                      <p className="text-xs text-gray-500">Temporarily disable user access for maintenance</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={generalSettings.maintenanceMode}
                      onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})}
                      className="toggle"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Auto Backup</label>
                      <p className="text-xs text-gray-500">Automatically backup system data daily</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={generalSettings.autoBackup}
                      onChange={(e) => setGeneralSettings({...generalSettings, autoBackup: e.target.checked})}
                      className="toggle"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                      <p className="text-xs text-gray-500">Send system notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={generalSettings.emailNotifications}
                      onChange={(e) => setGeneralSettings({...generalSettings, emailNotifications: e.target.checked})}
                      className="toggle"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security & Roles */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Roles & Permissions</h3>
                <button
                  onClick={() => setShowAddRole(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{role.name}</h4>
                        <p className="text-sm text-gray-600">{role.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1 text-gray-600 hover:text-blue-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Users:</span>
                        <span className="font-medium">{role.userCount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">{new Date(role.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Permissions:</span>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {role.permissions.map((permission, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Multilingual Settings */}
          {activeTab === "localization" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Language Management</h3>
                <button
                  onClick={() => setShowAddLanguage(true)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Language
                </button>
              </div>

              <div className="space-y-4">
                {languages.map((language) => (
                  <motion.div
                    key={language.code}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                            {language.name} ({language.nativeName})
                            {language.isDefault && (
                              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Default
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600">Code: {language.code.toUpperCase()}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {language.completeness}% Complete
                          </div>
                          <div className="text-xs text-gray-500">
                            Updated: {new Date(language.lastUpdated).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${language.completeness}%` }}
                          />
                        </div>

                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg">
                            <Upload className="h-4 w-4" />
                          </button>
                          {!language.isDefault && (
                            <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Pricing */}
          {activeTab === "pricing" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Dynamic Pricing Rules</h3>
                <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Pricing Rule
                </button>
              </div>

              <div className="space-y-4">
                {pricingRules.map((rule) => (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{rule.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {rule.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{rule.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Base Price:</span>
                            <p className="text-gray-600">${rule.basePrice.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Multiplier:</span>
                            <p className="text-gray-600">{rule.surgeMultiplier}x</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Final Price:</span>
                            <p className="text-gray-600 font-semibold">
                              ${(rule.basePrice * rule.surgeMultiplier).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Created:</span>
                            <p className="text-gray-600">{new Date(rule.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <span className="text-sm font-medium text-gray-700">Conditions:</span>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {rule.conditions.timeRange && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Time: {rule.conditions.timeRange}
                              </span>
                            )}
                            {rule.conditions.daysOfWeek && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                Days: {rule.conditions.daysOfWeek.join(', ')}
                              </span>
                            )}
                            {rule.conditions.zones && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Zones: {rule.conditions.zones.join(', ')}
                              </span>
                            )}
                            {rule.conditions.availabilityThreshold && (
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                                Availability: &lt; {rule.conditions.availabilityThreshold} scooters
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-6">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg">
                          {rule.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}



          {/* API & Integrations */}
          {activeTab === "api" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">API & Integrations</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Base URL
                      </label>
                      <input
                        type="text"
                        value="https://api.barqscoot.com/v1"
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rate Limiting
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500">
                        <option>1000 requests/hour</option>
                        <option>5000 requests/hour</option>
                        <option>10000 requests/hour</option>
                        <option>Unlimited</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">API Logging</label>
                        <p className="text-xs text-gray-500">Log all API requests and responses</p>
                      </div>
                      <input type="checkbox" defaultChecked className="toggle" />
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Webhook Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webhook URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://your-app.com/webhook"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Events
                      </label>
                      <div className="space-y-2">
                        {['ride.started', 'ride.completed', 'scooter.maintenance', 'user.registered'].map((event) => (
                          <label key={event} className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm text-gray-700">{event}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">API Keys</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Production API Key</div>
                      <div className="text-sm text-gray-600 font-mono">pk_live_••••••••••••••••••••••••••••••••</div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                        Regenerate
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">Test API Key</div>
                      <div className="text-sm text-gray-600 font-mono">pk_test_••••••••••••••••••••••••••••••••</div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                        Regenerate
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;