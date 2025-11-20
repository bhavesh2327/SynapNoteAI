import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const { verifyOTP, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {email , name , password} = location.state;

  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) return;

    setLoading(true);
    
    const result = await verifyOTP({ email, otp: otpString });
    
    if (result.success) {
      navigate('/signin');
    }
    
    setLoading(false);
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setTimer(60);
    setCanResend(false);
    
    // Resend OTP by calling signup again
    await signUp({ email, name, password});
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold gradient-text mb-2"
          >
            Verify Your Email
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 mb-2"
          >
            We've sent a 6-digit code to
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-primary-600 font-medium"
          >
            {email}
          </motion.p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="card p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Enter the 6-digit code
            </label>
            
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                  style={{ textAlign: 'center' }}
                />
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full btn-primary py-3 text-lg flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="loading-spinner" />
            ) : (
              <span>Verify Email</span>
            )}
          </motion.button>

          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Resend Code
              </button>
            ) : (
              <p className="text-gray-400">
                Resend in {timer}s
              </p>
            )}
          </div>

          <div className="text-center">
            <Link
              to="/signup"
              className="text-gray-600 hover:text-gray-700 text-sm"
            >
              ← Back to Sign Up
            </Link>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default VerifyOTP;