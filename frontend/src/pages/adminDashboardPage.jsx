import { useEffect, useState } from "react";
import { fetchAdminOverview } from "../api/analytics.api";

const cardStyle = {
  flex: 1,
  padding: "15px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  textAlign: "center",
};

const sectionStyle = {
  marginBottom: "20px",
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "8px",
};

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const response = await fetchAdminOverview();
      setData(response);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!data) return <p>No data available</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>

      {/* ================= SUMMARY CARDS ================= */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={cardStyle}>
          <h3>Total Students</h3>
          <p>{data.totalActiveStudents}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Teachers</h3>
          <p>{data.totalActiveTeachers}</p>
        </div>

        <div style={cardStyle}>
          <h3>Present Today</h3>
          <p>{data.totalPresentStudents ?? "N/A"}</p>
        </div>
      </div>

      {/* ================= GENDER ================= */}
      <div style={sectionStyle}>
        <h2>Gender Distribution</h2>
        <p>Male: {data.genderDistribution.male}</p>
        <p>Female: {data.genderDistribution.female}</p>
        <p>Other: {data.genderDistribution.other}</p>
      </div>

      {/* ================= ATTENDANCE ================= */}
      <div style={sectionStyle}>
        <h2>Top Attendance Sections</h2>
        {data.attendanceRank.top.length === 0 ? (
          <p>No data</p>
        ) : (
          data.attendanceRank.top.map((s) => (
            <p key={s.sectionId}>
              {s.sectionCode} — {s.percentage}%
            </p>
          ))
        )}
      </div>

      {/* ================= PERFORMANCE ================= */}
      <div style={sectionStyle}>
        <h2>Top Performance Sections</h2>
        {data.performanceRank.top.length === 0 ? (
          <p>No data</p>
        ) : (
          data.performanceRank.top.map((s) => (
            <p key={s.sectionId}>
              {s.sectionCode} — {s.percentage}%
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
