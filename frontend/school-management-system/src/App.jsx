import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './utils/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Success from './pages/Success';
import Login from './pages/Login';
import Academics from './pages/Academics';
import Admissions from './pages/Admissions';
import CampusLife from './pages/CampusLife';
import Contact from './pages/Contact';
import Unauthorized from './pages/Unauthorized';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

// Admin Portal Pages
import AdminDashboard from './pages/admin/Dashboard';
import AddStudent from './pages/admin/AddStudent';
import AdminAttendance from './pages/admin/Attendance';
import AdminGrades from './pages/admin/Grades';
import AdminInvoices from './pages/admin/Invoices';
import AdminAdmissions from './pages/admin/AdminAdmissions';
import AdminVisits from './pages/admin/AdminVisits';
import AdminStudents from './pages/admin/AdminStudent';
import AdminClasses from './pages/admin/AdminClasses'; // #6 NEW
import AdminAnnouncement from './pages/admin/AdminAnnouncement'; // #6 NEW

// Student Portal Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentAttendance from './pages/student/Attendance';
import StudentReportCard from './pages/student/ReportCard';
import StudentInvoices from './pages/student/Invoices';

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* ==================== 1. PUBLIC ROUTES ==================== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/academics" element={<Academics />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/campus-life" element={<CampusLife />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/success" element={<Success />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to={user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                replace
              />
            ) : (
              <Login />
            )
          }
        />
      </Route>

      {/* ==================== 2. PROTECTED ADMIN ROUTES ==================== */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-student" element={<AddStudent />} />
          <Route path="/admin/attendance" element={<AdminAttendance />} />
          <Route path="/admin/grades" element={<AdminGrades />} />
          <Route path="/admin/invoices" element={<AdminInvoices />} />
          <Route path="/admin/admissions" element={<AdminAdmissions />} />
          <Route path="/admin/visits" element={<AdminVisits />} />
          <Route path="/admin/students" element={<AdminStudents />} />

          {/* #6 NEW ROUTES */}
          <Route path="/admin/classes" element={<AdminClasses />} />
          <Route path="/admin/announcements" element={<AdminAnnouncement />} />

          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Route>

      {/* ==================== 3. PROTECTED STUDENT ROUTES ==================== */}
      <Route element={<ProtectedRoute allowedRole="student" />}>
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/attendance" element={<StudentAttendance />} />
          <Route path="/student/report-card" element={<StudentReportCard />} />
          <Route path="/student/invoices" element={<StudentInvoices />} />
          <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
        </Route>
      </Route>

      {/* ==================== 4. CATCH-ALL FALLBACK ==================== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}