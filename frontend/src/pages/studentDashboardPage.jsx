import { useEffect, useState, useContext } from "react";
import { fetchStudentDashboard } from "../api/analytics.api";
import { AuthContext } from "../context/AuthContext";

const StudentDashboardPage = () => {
  const { userId } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const response = await fetchStudentDashboard(userId);
      setData(response);
    } catch (error) {
      console.error("Failed to load student dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadDashboard();
    }
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data available</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Student Dashboard</h1>

      <p>Attendance: {data.attendancePercentage ?? "N/A"}%</p>

      <h2>Exams</h2>

      {data.exams.map((exam) => (
        <div key={exam.examInstanceId} style={cardStyle}>
          <h3>{exam.type}</h3>

          {exam.subjects.length === 0 ? (
            <p>No marks available</p>
          ) : (
            exam.subjects.map((s, index) => (
              <p key={index}>
                {s.subjectName} — {s.marksObtained}/{s.maxMarks}
              </p>
            ))
          )}

          <p>Total: {exam.totalMarks ?? "N/A"}</p>
          <p>Percentage: {exam.percentage ?? "N/A"}</p>
        </div>
      ))}

      <h2>Comparison</h2>
      <p>
        {data.comparison === null
          ? "Not available"
          : `Change: ${data.comparison}`}
      </p>
    </div>
  );
};

const cardStyle = {
  border: "1px solid #ccc",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "8px",
};

export default StudentDashboardPage;
