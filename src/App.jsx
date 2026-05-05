import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import VerifyEmail from './pages/auth/VerifyEmail';
import Browse from './pages/Browse';
import WorkerProfile from './pages/WorkerProfile';
import PostJob from './pages/PostJob';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Escrow from './pages/Escrow';
import WorkerRegister from './pages/WorkerRegister';

// ── Protected route wrapper ─────────────────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth();
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0d14', color: '#f59e0b', fontSize: 18, fontFamily: 'sans-serif',
      }}>
        ⚡ Loading…
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
// ────────────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Public routes */}
        <Route path="/"           element={<Landing />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/signup"     element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/browse"     element={<Browse />} />
        <Route path="/worker/:id"      element={<WorkerProfile />} />
        <Route path="/register-worker" element={<WorkerRegister />} />

        {/* Protected routes (require login) */}
        <Route path="/post-job"   element={<ProtectedRoute><PostJob /></ProtectedRoute>} />
        <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/chat"       element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/chat/:id"   element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/escrow"     element={<ProtectedRoute><Escrow /></ProtectedRoute>} />

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
