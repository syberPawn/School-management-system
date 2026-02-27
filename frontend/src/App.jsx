import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./pages/AdminLayout";
import UsersPage from "./pages/UsersPage";
import AcademicYearsPage from "./pages/AcademicYearsPage";
import GradesPage from "./pages/GradesPage";
import SectionsPage from "./pages/SectionsPage";
import SubjectsPage from "./pages/SubjectsPage";
import CurriculumPage from "./pages/CurriculumPage";
import StudentIdentitiesPage from "./pages/StudentIdentitiesPage";
import StudentEnrollmentsPage from "./pages/StudentEnrollmentsPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import TeacherAssignmentPage from "./pages/teacherAssignmentPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Admin Layout Route */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="users" element={<UsersPage />} />
        <Route path="academic-years" element={<AcademicYearsPage />} />
        <Route path="grades" element={<GradesPage />} />
        <Route path="sections" element={<SectionsPage />} />
        <Route path="subjects" element={<SubjectsPage />} />
        <Route path="curriculum" element={<CurriculumPage />} />
        <Route path="students" element={<StudentIdentitiesPage />} />
        <Route path="enrollments" element={<StudentEnrollmentsPage />} />
        <Route path="teacher-assignments" element={<TeacherAssignmentPage />} />
        <Route path="students/:id" element={<StudentProfilePage />} />
      </Route>

      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <h1>Teacher Dashboard</h1>
          </ProtectedRoute>
        }
      />

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <h1>Student Dashboard</h1>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Login />} />
      <Route
        path="/admin/grades"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="users" element={<UsersPage />} />
        <Route path="academic-years" element={<AcademicYearsPage />} />
        <Route path="grades" element={<GradesPage />} />
      </Route>
    </Routes>
  );
}

export default App;
