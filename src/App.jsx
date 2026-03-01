import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { useAuth } from './hooks/useAuth';
import PageShell from './components/layout/PageShell';
import Leaderboard from './pages/Leaderboard';
import Schedule from './pages/Schedule';
import RoundDetail from './pages/RoundDetail';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import Spinner from './components/ui/Spinner';

function ProtectedRoute({ children }) {
  const user = useAuth();
  if (user === undefined) return <Spinner />;
  if (user === null) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <TripProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PageShell />}>
            <Route path="/" element={<Schedule />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/rounds/:courseId" element={<RoundDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </TripProvider>
    </AuthProvider>
  );
}
