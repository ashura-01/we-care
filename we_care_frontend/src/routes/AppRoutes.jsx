import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import DoctorList from "../pages/DoctorsList";
import Symptoms from "../pages/Symptoms";
import Hospitals from "../pages/Hospitals";
// 🌟 ADDED: Import the new Map Page
import HospitalMapPage from "../pages/HospitalMapPage"; 
import Blogs from "../pages/Blogs";
import BlogDetail from "../pages/BlogDetail";
import WriteBlog from "../pages/WriteBlog";
import AdminRoutes from "./AdminRoutes";
import SignupChoice from "../pages/SignupChoice";
import PatientSignup from "../pages/PatientSignup";
import DoctorSignup from "../pages/DoctorSignup";
import Login from "../pages/Login";
import DoctorProfile from "../pages/DoctorProfile";
import Settings from "../pages/Settings";
import { ProtectedRoute } from "./ProtectedRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <ProtectedRoute redirectIfAuthenticated={true}>
            <Login />
          </ProtectedRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <ProtectedRoute redirectIfAuthenticated={true}>
            <SignupChoice />
          </ProtectedRoute>
        }
      />

      <Route
        path="/signup/patient"
        element={
          <ProtectedRoute redirectIfAuthenticated={true}>
            <PatientSignup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/signup/doctor"
        element={
          <ProtectedRoute redirectIfAuthenticated={true}>
            <DoctorSignup />
          </ProtectedRoute>
        }
      />

      {/* Public - anyone can read blogs */}
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blogs/:id" element={<BlogDetail />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctors"
        element={
          <ProtectedRoute>
            <DoctorList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/symptoms"
        element={
          <ProtectedRoute>
            <Symptoms />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hospitals"
        element={
          <ProtectedRoute>
            <Hospitals />
          </ProtectedRoute>
        }
      />

      {/* 🌟 ADDED: The new Hospital Map Route */}
      <Route
        path="/hospital-map"
        element={
          <ProtectedRoute>
            <HospitalMapPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Doctor only - write blog (protection also inside component) */}
      <Route
        path="/write-blog"
        element={
          <ProtectedRoute>
            <WriteBlog />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/:id"
        element={
          <ProtectedRoute>
            <DoctorProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;