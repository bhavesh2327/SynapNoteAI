import { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.data.success) {
        dispatch({ type: 'SET_USER', payload: response.data.user });
      }
    } catch (error) {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const signUp = async (userData) => {
    try {
      const response = await authAPI.signUp(userData);
      if (response.data.success) {
        toast.success('Check mailBox for OTP , if not found then given email is invalid');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Sign up failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const verifyOTP = async (otpData) => {
    try {
      const response = await authAPI.verifyOTP(otpData);
      if (response.data.success) {
        toast.success('Email verified successfully!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'OTP verification failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const signIn = async (credentials) => {
    try {
      const response = await authAPI.signIn(credentials);
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
        toast.success('Welcome back!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Sign in failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authAPI.forgotPassword({ email });
      if (response.data.success) {
        toast.success('Password reset email sent!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      return { success: false, message };
    }
  };

  const resetPassword = async (resetData) => {
    try {
      const response = await authAPI.resetPassword(resetData);
      if (response.data.success) {
        toast.success('Password reset successfully!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully!');
  };

  const value = {
    ...state,
    signUp,
    verifyOTP,
    signIn,
    forgotPassword,
    resetPassword,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};