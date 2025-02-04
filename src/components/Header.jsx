import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Home, Info, Package, ChevronDown, LayoutDashboard, Bell, Search, ShoppingCart } from 'lucide-react';
import LoginModal from "./LoginModal";
import Cart from "./Cart";
import PaymentTab from "./PaymentTab";

const Header = ({ user, onLogin, onLogout, setShowDashboard, notifications }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isNameInputOpen, setNameInputOpen] = useState(false);
  const [tempName, setTempName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  // const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const profileMenu = document.querySelector('.profile-menu');
      if (isProfileMenuOpen && profileMenu && !profileMenu.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);


  const handleLoginSuccess = () => {
    setModalOpen(false);
    setNameInputOpen(true);
  };

  const handleDashboardClick = () => {
    setShowDashboard(true);
    setProfileMenuOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setProfileMenuOpen(false);
  };

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      onLogin(tempName);
      setNameInputOpen(false);
      setTempName("");
    }
  };

  const openLoginModal = () => {
    setLoginModalOpen(true);
  };

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/about", label: "About", icon: Info },
    { path: "/product", label: "Product", icon: Package },
  ];

  return (
    <>
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/80 backdrop-blur-md'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MyApp
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 
                    ${location.pathname === path
                      ? 'bg-blue-100 text-blue-700 scale-105'
                      : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
                    }`}
                  onClick={() => setShowDashboard(false)}
                >
                  {label}
                </Link>
              ))}

              {/* Search and Cart */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSearchOpen(!isSearchOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Search className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                >
                  <ShoppingCart className="h-5 w-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </button>

                <nav className="flex items-center space-x-4">
                  <div className="relative" ref={notificationRef}>
                    {/* Bell Icon Button */}
                    <button
                      onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                      className="p-2 rounded-full relative hover:bg-gray-100"
                    >
                      <Bell className="h-6 w-6 text-gray-600" />
                      {notifications && notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                          {notifications.length}
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown */}
                    {isNotificationOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg p-4 z-50">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-sm font-semibold">Notifications</h3>
                          <button
                            onClick={() => setIsNotificationOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications && notifications.length > 0 ? (
                            notifications.map((notification, index) => (
                              <div
                                key={index}
                                className="py-3 px-4 border-b last:border-0 hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-start">
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-800">{notification.message}</p>
                                    <span className="text-xs text-gray-500 mt-1">
                                      {notification.timestamp}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-4">
                              No new notifications
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </nav>
              </div>
              {/* <PaymentTab addPaymentNotification={addPaymentNotification} /> */}

              {user ? (
                <div className="relative ml-3 profile-menu">
                  <button
                    onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 bg-white px-3 py-2 rounded-full border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
                      {user.charAt(0).toUpperCase()}
                    </div>
                    <span>{user}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 transform transition-all duration-200 origin-top">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-500 border-b">
                          Signed in as<br />
                          <span className="font-medium text-gray-900">{user}</span>
                        </div>
                        {/* <button
                          onClick={handleDashboardClick}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Dashboard
                        </button> */}
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="ml-4 px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Login
                </button>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className={`overflow-hidden transition-all duration-300 ${isSearchOpen ? 'h-16 opacity-100' : 'h-0 opacity-0'
            }`}>
            <div className="py-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-5 py-2 pl-10 pr-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden transform transition-all duration-300 ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          } fixed inset-0 z-50`}>
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="px-4 py-6">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                  MyApp
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {navLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${location.pathname === path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowDashboard(false);
                    }}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {label}
                  </Link>
                ))}
              </div>

              {user ? (
                <div className="mt-8 space-y-4">
                  <div className="px-3 py-2 border-t">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
                        {user.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{user}</div>
                        <div className="text-sm text-gray-500">Logged in</div>
                      </div>
                    </div>
                  </div>
                  {/* <button
                    onClick={() => {
                      navigate('/dashboard');
                      handleDashboardClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
                  >
                    <LayoutDashboard className="h-5 w-5 mr-2" />
                    Dashboard
                  </button> */}
                  <button
                    onClick={() => {
                      onLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="mt-8 w-full px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Name Input Modal */}
      {isNameInputOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Username</h2>
            <div className="relative mb-6">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                placeholder="Enter username"
              />
              <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleNameSubmit}
                disabled={!tempName.trim()}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get Started
              </button>
              <button
                onClick={() => setNameInputOpen(false)}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {user && (
        <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
          <div className="transform transition-all duration-300 translate-x-0 bg-white rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Welcome back, {user}!
                </p>
                <p className="text-sm text-gray-500">
                  You have 3 new notifications
                </p>
              </div>
              <button className="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Menu */}
      <div className="fixed bottom-4 left-4 md:bottom-8 md:left-8">
        <div className="bg-white rounded-full shadow-lg p-2">
          <div className="flex flex-col space-y-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Quick Search">
              <Search className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded {/* Quick Actions Menu */}-full transition-colors" title="Shopping Cart">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Help">
              <Info className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className={`h-16 ${isSearchOpen ? 'h-32' : ''}`} />

      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};


export default Header;