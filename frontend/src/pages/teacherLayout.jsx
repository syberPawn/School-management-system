import { useContext } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function TeacherLayout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Teacher Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <hr />

      {/* Navigation Menu */}
      <div style={{ marginBottom: "20px" }}>
        <Link to="/teacher/attendance">Record Attendance</Link>|{" "}
        <Link to="/teacher/attendance/view">View Attendance</Link>|{" "}
        <Link to="/teacher/attendance/percentage">Section Percentage</Link>|{" "}
        <Link to="/teacher/marks">Submit Marks</Link>|{" "}
        <Link to="/teacher/marks/view">View Marks</Link>
      </div>

      <hr />

      {/* Child Page Render */}
      <Outlet />
    </div>
  );
}

export default TeacherLayout;
