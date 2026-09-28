import { Routes, Route } from 'react-router-dom';
import HomePage       from './pages/HomePage.jsx';
import TruckDetailPage from './pages/TruckDetailPage.jsx';
import ReviewsPage    from './pages/ReviewsPage.jsx';
import LoginPage      from './pages/LoginPage.jsx';
import RegisterPage   from './pages/RegisterPage.jsx';
import AdminLayout    from './pages/admin/AdminLayout.jsx';
import AdminTrucks    from './pages/admin/AdminTrucks.jsx';
import AdminReviews   from './pages/admin/AdminReviews.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/"            element={<HomePage />} />
      <Route path="/truck/:id"   element={<TruckDetailPage />} />
      <Route path="/reviews"     element={<ReviewsPage />} />
      <Route path="/login"       element={<LoginPage />} />
      <Route path="/register"    element={<RegisterPage />} />

      {/* Admin panel — requires role=admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index          element={<AdminTrucks />} />
        <Route path="trucks"  element={<AdminTrucks />} />
        <Route path="reviews" element={<AdminReviews />} />
      </Route>
    </Routes>
  );
}
