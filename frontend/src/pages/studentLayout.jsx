import { useContext } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function StudentLayout() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Student Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <hr />

      {/* Navigation Menu */}
      <div style={{ marginBottom: "20px" }}>
        <Link to="/student/attendance">My Attendance</Link> |{" "}
        <Link to="/student/attendance/percentage">Attendance Percentage</Link>|{" "}
        <Link to="/student/report-card">Report Card</Link> |{" "}
        <Link to="/student/fees">My Fees</Link>|{" "}
        <Link to="/student/notices">Notices</Link>|{" "}
        <Link to="/student/dashboard">Dashboard</Link>
      </div>

      <hr />

      {/* Child Page Render */}
      <Outlet />
    </div>
  );
}

export default StudentLayout;
