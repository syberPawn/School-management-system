import { useContext } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AdminLayout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <hr />

      {/* Navigation Menu */}
      <div style={{ marginBottom: "20px" }}>
        <Link to="/admin/users">Users</Link> |{" "}
        <Link to="/admin/academic-years">Academic Years</Link> |{" "}
        <Link to="/admin/grades">Grades</Link> |{" "}
        <Link to="/admin/sections">Sections</Link> |{" "}
        <Link to="/admin/subjects">Subjects</Link> |{" "}
        <Link to="/admin/curriculum">Curriculum</Link> |{" "}
        <Link to="/admin/students">Students</Link> |{" "}
        <Link to="/admin/enrollments">Enrollments</Link>
      </div>

      <hr />

      {/* Child Page Render */}
      <Outlet />
    </div>
  );
}

export default AdminLayout;
