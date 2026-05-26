import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SymptomPage from './pages/SymptomPage';
import EmergencyPage from './pages/EmergencyPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import TrackerPage from './pages/TrackerPage';
import HabitPage from './pages/HabitPage';
import MedicinePage from './pages/MedicinePage';
import DietPage from './pages/DietPage';
import AlertsPage from './pages/AlertsPage';
import FirstAidPage from './pages/FirstAidPage';
import MentalHealthPage from './pages/MentalHealthPage';
import TrendsPage from './pages/TrendsPage';
import DoctorPage from './pages/DoctorPage';
import PredictionPage from './pages/PredictionPage';
import './index.css';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div>
          <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 12 }}>🌿</div>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div>
          <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 12 }}>🌿</div>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <ErrorBoundary>
              <Layout />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<ErrorBoundary><DashboardPage /></ErrorBoundary>} />
        <Route path="/symptoms" element={<ErrorBoundary><SymptomPage /></ErrorBoundary>} />
        <Route path="/emergency" element={<ErrorBoundary><EmergencyPage /></ErrorBoundary>} />
        <Route path="/reports" element={<ErrorBoundary><ReportsPage /></ErrorBoundary>} />
        <Route path="/profiles" element={<ErrorBoundary><ProfilePage /></ErrorBoundary>} />
        <Route path="/tracker" element={<ErrorBoundary><TrackerPage /></ErrorBoundary>} />
        <Route path="/habits" element={<ErrorBoundary><HabitPage /></ErrorBoundary>} />
        <Route path="/medicine" element={<ErrorBoundary><MedicinePage /></ErrorBoundary>} />
        <Route path="/diet" element={<ErrorBoundary><DietPage /></ErrorBoundary>} />
        <Route path="/alerts" element={<ErrorBoundary><AlertsPage /></ErrorBoundary>} />
        <Route path="/first-aid" element={<ErrorBoundary><FirstAidPage /></ErrorBoundary>} />
        <Route path="/mental-health" element={<ErrorBoundary><MentalHealthPage /></ErrorBoundary>} />
        <Route path="/trends" element={<ErrorBoundary><TrendsPage /></ErrorBoundary>} />
        <Route path="/doctors" element={<ErrorBoundary><DoctorPage /></ErrorBoundary>} />
        <Route path="/prediction" element={<ErrorBoundary><PredictionPage /></ErrorBoundary>} />
      </Route>
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <LanguageProvider>
            <AppRoutes />
          </LanguageProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
