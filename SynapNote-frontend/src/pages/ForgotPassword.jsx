import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft } from 'lucide-react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await forgotPassword(email);
    
    if (result.success) {
      setSent(true);
    }
    
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full text-center"
        >
          <div className="card p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            
            <Link to="/signin" className="btn-primary inline-block">
              Back to Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold gradient-text mb-2"
          >
            Reset Password
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600"
          >
            Enter your email address and we'll send you a link to reset your password
          </motion.p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="card p-8 space-y-6"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-11"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="loading-spinner" />
            ) : (
              <span>Send Reset Link</span>
            )}
          </motion.button>

          <div className="text-center">
            <Link
              to="/signin"
              className="flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default ForgotPassword;