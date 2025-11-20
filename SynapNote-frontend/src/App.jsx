import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import NoteDetail from './pages/NoteDetail';
import CreateNote from './pages/CreateNote';
import EditNote from './pages/EditNote';
import AuthRoute from './components/AuthRoute';
function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <Router>
          <div className="min-h-screen">
            <Navbar />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signin" element={
                <AuthRoute>
                  <SignIn />
                </AuthRoute>
              } />
              <Route path="/signup" element={
                <AuthRoute>
                  <SignUp />
                </AuthRoute>
              } />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/notes" element={
                <ProtectedRoute>
                  <Notes />
                </ProtectedRoute>
              } />
              
              <Route path="/notes/new" element={
                <ProtectedRoute>
                  <CreateNote />
                </ProtectedRoute>
              } />
              
              <Route path="/notes/:id" element={
                <ProtectedRoute>
                  <NoteDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/notes/:id/edit" element={
                <ProtectedRoute>
                  <EditNote />
                </ProtectedRoute>
              } />
            </Routes>
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#374151',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                },
              }}
            />
          </div>
        </Router>
      </NotesProvider>
    </AuthProvider>
  );
}

export default App;