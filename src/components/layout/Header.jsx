// src/components/layout/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { Menu, Bell, Globe, Shield, Settings, LogOut, User, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";

const Header = ({ onMenuClick }) => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (language) => {
    changeLanguage(language);
    setShowLanguageMenu(false);
  };

  const handleProfileMenuClick = (action) => {
    setShowProfileMenu(false);
    if (action === 'settings') {
      navigate('/settings');
    } else if (action === 'sign-out') {
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 z-30">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100">
              <Menu className="h-6 w-6 text-gray-600" />
            </motion.button>
            <div className="ml-4">
              <h1 className="text-xl font-semibold text-teal-700">
                {t('header.title')}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
              ref={languageDropdownRef}>
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 focus:outline-none">
                <Globe className="h-5 w-5 text-gray-600 mr-1" />
                <span className="text-sm font-medium text-gray-700 mr-1">
                  {currentLanguage === 'ar' ? 'العربية' : 'English'}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </button>

              <AnimatePresence>
                {showLanguageMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">

                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        currentLanguage === 'en' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}>
                      <span className="mr-3">🇺🇸</span>
                      English
                    </button>

                    <button
                      onClick={() => handleLanguageChange('ar')}
                      className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        currentLanguage === 'ar' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}>
                      <span className="mr-3">🇸🇦</span>
                      العربية
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>



            <motion.div whileTap={{ scale: 0.95 }} className="relative">
              <Link
                to="/notifications"
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center">
                <Bell className="h-5 w-5 text-gray-600 hover:text-gray-800" />
                <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 rounded-full border-2 border-white shadow-sm"></span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative flex items-center"
              ref={dropdownRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center focus:outline-none">
                <img
                  src="https://static.vecteezy.com/system/resources/previews/024/183/502/non_2x/male-avatar-portrait-of-a-young-man-with-a-beard-illustration-of-male-character-in-modern-color-style-vector.jpg"
                  alt="Profile"
                  className="h-8 w-8 rounded-full"
                />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">

                    {/* Admin User Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{t('header.profile.adminUser')}</p>
                          <p className="text-xs text-gray-500">{t('header.profile.email')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button
                        onClick={() => handleProfileMenuClick('settings')}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <Settings className="h-4 w-4 mr-3 text-gray-400" />
                        {t('header.profile.settings')}
                      </button>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={() => handleProfileMenuClick('sign-out')}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="h-4 w-4 mr-3 text-red-500" />
                        {t('header.profile.signOut')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
