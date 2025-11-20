import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  BookOpen, 
  Plus,
  Search,
  Home
} from 'lucide-react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/notes', icon: BookOpen, label: 'Notes' },
    { to: '/notes/new', icon: Plus, label: 'New Note' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center"
            >
              <BookOpen className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold gradient-text">
              SynapNote
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === to
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user?.name}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/signin"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            {isAuthenticated && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 py-4"
            >
              {navItems.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                    location.pathname === to
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navbar;