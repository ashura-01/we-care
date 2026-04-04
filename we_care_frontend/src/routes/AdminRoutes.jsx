import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard.jsx";
import { useAuth } from "../contexts/AuthContext";

const AdminRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen text-[#2C6975] font-semibold">Loading...</div>;

  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default AdminRoutes;