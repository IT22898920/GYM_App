import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';
import { 
  FiMenu, 
  FiX, 
  FiHome, 
  FiInfo, 
  FiGrid, 
  FiPhone, 
  FiUser, 
  FiUserPlus,
  FiSearch,
  FiShoppingBag,
  FiBell,
  FiLogOut,
  FiSettings,
  FiChevronDown,
  FiActivity
} from 'react-icons/fi';

function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    setIsLoaded(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  const getUserDashboardLink = () => {
    if (!user) return '/profile';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'gymOwner': return '/gym-owner';
      case 'instructor': return '/instructor';
      default: return '/profile';
    }
  };

  const AuthenticatedUserMenu = () => (
    <div className="relative">
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300 group"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {user?.firstName?.charAt(0) || 'U'}
          </span>
        </div>
        <span className="hidden md:block">{user?.firstName}</span>
        <FiChevronDown className={`h-4 w-4 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
      </button>

      {showUserMenu && (
        <div className="absolute right-0 top-12 w-48 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
          <div className="p-3 border-b border-gray-700">
            <p className="text-white font-medium">{user?.firstName} {user?.lastName}</p>
            <p className="text-gray-400 text-sm capitalize">{user?.role}</p>
          </div>
          
          <div className="py-2">
            <Link
              to={getUserDashboardLink()}
              className="flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
              onClick={() => setShowUserMenu(false)}
            >
              <FiUser className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            
            <Link
              to="/profile"
              className="flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
              onClick={() => setShowUserMenu(false)}
            >
              <FiSettings className="h-4 w-4" />
              <span>Profile Settings</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-red-400 hover:bg-gray-800/50 transition-all duration-300"
            >
              <FiLogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const UnauthenticatedLinks = () => {
    const [showLoginMenu, setShowLoginMenu] = useState(false);
    
    return (
      <>
        <div className="relative">
          <button
            onClick={() => setShowLoginMenu(!showLoginMenu)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300 group hover:scale-105"
          >
            <FiUser className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
              Login
            </span>
            <FiChevronDown className={`h-4 w-4 transition-transform duration-300 ${showLoginMenu ? 'rotate-180' : ''}`} />
          </button>

          {showLoginMenu && (
            <div className="absolute right-0 top-12 w-56 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
              <div className="py-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-blue-400 hover:bg-gray-800/50 transition-all duration-300"
                  onClick={() => setShowLoginMenu(false)}
                >
                  <FiUser className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Customer Login</p>
                    <p className="text-xs text-gray-500">Find gyms & book classes</p>
                  </div>
                </Link>
                
                <Link
                  to="/gym-owner-login"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-emerald-400 hover:bg-gray-800/50 transition-all duration-300"
                  onClick={() => setShowLoginMenu(false)}
                >
                  <FiHome className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Gym Owner</p>
                    <p className="text-xs text-gray-500">Manage your gym business</p>
                  </div>
                </Link>
                
                <Link
                  to="/instructor-login"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-purple-400 hover:bg-gray-800/50 transition-all duration-300"
                  onClick={() => setShowLoginMenu(false)}
                >
                  <FiActivity className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Instructor</p>
                    <p className="text-xs text-gray-500">Teach classes & train clients</p>
                  </div>
                </Link>
                
                <hr className="border-gray-700 my-2" />
                
                <Link
                  to="/admin-login"
                  className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-gray-800/50 transition-all duration-300"
                  onClick={() => setShowLoginMenu(false)}
                >
                  <FiSettings className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Admin Access</p>
                    <p className="text-xs text-gray-500">Platform administration</p>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>
        
        <Link
          to="/signup"
          className="flex items-center space-x-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white px-6 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(31,41,55,0.5)] hover:scale-105 transition-all duration-500 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          <FiUserPlus className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          <span className="relative z-10">Sign Up</span>
        </Link>
      </>
    );
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-gray-950/90 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      } ${
        isLoaded ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="h-10 w-10 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 hover:scale-110 hover:shadow-lg">
                <span className="text-2xl font-bold text-white group-hover:scale-110 transition-transform duration-500">
                  F
                </span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                FitConnect
              </span>
            </Link>
            <div className="flex items-center space-x-6">
              {[
                { to: "/", icon: FiHome, label: "Home" },
                { to: "/about", icon: FiInfo, label: "About" },
                { to: "/services", icon: FiGrid, label: "Services" },
                { to: "/contact", icon: FiPhone, label: "Contact" },
              ].map((item, index) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-gray-400 hover:text-white transition-all duration-300 font-medium flex items-center space-x-2 group relative"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <item.icon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
              <FiSearch className="h-5 w-5 hover:rotate-12" />
            </button>
            
            {/* Use NotificationBell component for authenticated users */}
            {isAuthenticated ? (
              <NotificationBell />
            ) : (
              <button className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 relative">
                <FiBell className="h-5 w-5 hover:rotate-12" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-gray-700 rounded-full text-white text-xs flex items-center justify-center animate-ping">
                  <span className="absolute h-4 w-4 bg-gray-700 rounded-full animate-pulse">
                    2
                  </span>
                </span>
              </button>
            )}
            
            <button className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 relative">
              <FiShoppingBag className="h-5 w-5 hover:rotate-12" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-gray-800 rounded-full text-white text-xs flex items-center justify-center">
                3
              </span>
            </button>
            <div className="h-8 w-px bg-gray-800 transform transition-transform duration-300 hover:scale-y-110"></div>
            <Link
              to="/profile"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-300 group hover:scale-105"
            >
              <FiUser className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
                Profile
              </span>
            </Link>
            {isAuthenticated ? <AuthenticatedUserMenu /> : <UnauthenticatedLinks />}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="h-8 w-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 hover:scale-110">
                <span className="text-xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                  F
                </span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent">
                FitConnect
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              {/* Use NotificationBell component for authenticated users in mobile */}
              {isAuthenticated ? (
                <NotificationBell />
              ) : (
                <button className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 relative">
                  <FiBell className="h-5 w-5 hover:rotate-12" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-gray-700 rounded-full text-white text-xs flex items-center justify-center animate-ping">
                    <span className="absolute h-4 w-4 bg-gray-700 rounded-full animate-pulse">
                      2
                    </span>
                  </span>
                </button>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
              >
                {isMenuOpen ? (
                  <FiX className="h-6 w-6 transform rotate-0 hover:rotate-180 transition-transform duration-300" />
                ) : (
                  <FiMenu className="h-6 w-6 transform hover:rotate-180 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-gray-950 shadow-[0_0_20px_rgba(0,0,0,0.5)] rounded-b-2xl border-t border-gray-800 mt-4">
              <div className="p-4">
                <div className="flex flex-col space-y-4">
                  {[
                    { to: "/", icon: FiHome, label: "Home" },
                    { to: "/about", icon: FiInfo, label: "About" },
                    { to: "/services", icon: FiGrid, label: "Services" },
                    { to: "/contact", icon: FiPhone, label: "Contact" },
                  ].map((item, index) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="text-gray-400 hover:text-white transition-all duration-300 flex items-center space-x-3 group transform hover:translate-x-2"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <item.icon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>{item.label}</span>
                    </Link>
                  ))}

                  <div className="h-px bg-gray-800 my-2 transform transition-transform duration-300 hover:scale-x-110"></div>

                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                        <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {user?.firstName?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user?.firstName} {user?.lastName}</p>
                          <p className="text-gray-400 text-sm capitalize">{user?.role}</p>
                        </div>
                      </div>
                      
                      <Link
                        to={getUserDashboardLink()}
                        className="text-gray-400 hover:text-white transition-all duration-300 flex items-center space-x-3 group transform hover:translate-x-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiUser className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span>Dashboard</span>
                      </Link>
                      
                      <Link
                        to="/profile"
                        className="text-gray-400 hover:text-white transition-all duration-300 flex items-center space-x-3 group transform hover:translate-x-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FiSettings className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span>Profile Settings</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-red-400 transition-all duration-300 flex items-center space-x-3 group transform hover:translate-x-2 w-full text-left"
                      >
                        <FiLogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <p className="text-gray-500 text-sm font-medium px-1 mb-2">Login Options</p>
                        
                        <Link
                          to="/login"
                          className="text-gray-400 hover:text-blue-400 transition-all duration-300 flex items-center space-x-3 group transform hover:translate-x-2 py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FiUser className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                          <div>
                            <p className="font-medium">Customer</p>
                            <p className="text-xs text-gray-500">Find gyms & book classes</p>
                          </div>
                        </Link>
                        
                        <Link
                          to="/gym-owner-login"
                          className="text-gray-400 hover:text-emerald-400 transition-all duration-300 flex items-center space-x-3 group transform hover:translate-x-2 py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FiHome className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                          <div>
                            <p className="font-medium">Gym Owner</p>
                            <p className="text-xs text-gray-500">Manage your gym business</p>
                          </div>
                        </Link>
                        
                        <Link
                          to="/instructor-login"
                          className="text-gray-400 hover:text-purple-400 transition-all duration-300 flex items-center space-x-3 group transform hover:translate-x-2 py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FiActivity className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                          <div>
                            <p className="font-medium">Instructor</p>
                            <p className="text-xs text-gray-500">Teach classes & train clients</p>
                          </div>
                        </Link>
                      </div>
                      
                      <div className="h-px bg-gray-800 my-3"></div>
                      
                      <Link
                        to="/signup"
                        className="flex items-center space-x-3 bg-gradient-to-r from-gray-800 to-gray-700 text-white px-4 py-2 rounded-full group relative overflow-hidden"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                        <FiUserPlus className="h-5 w-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="relative z-10">Sign Up</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;