import { useEffect, useState, useContext } from "react";
import { fetchTeacherDashboard } from "../api/analytics.api";
import { AuthContext } from "../context/AuthContext";

const TeacherDashboardPage = () => {
  const { userId } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const response = await fetchTeacherDashboard(userId);
      //##########################################################################
      //DEBUG CONSOLE
      //##########################################################################

      console.log("SECTIONS:", response.sections);
      console.log(
        "STUDENT ATTENDANCE:",
        response.sections[0]?.studentAttendance,
      );
      console.log("SUBJECT AVERAGES:", response.sections[0]?.subjectAverages);
      setData(response);
    } catch (error) {
      console.error("Failed to load teacher dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("USER ID IN DASHBOARD:", userId);

    if (userId) {
      loadDashboard();
    }
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data available</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Teacher Dashboard</h1>

      {data.sections.length === 0 ? (
        <p>No assigned sections</p>
      ) : (
        data.sections.map((section) => (
          <div key={section.sectionId} style={sectionStyle}>
            <h2>{section.sectionCode}</h2>

            <p>Attendance: {section.sectionAttendance ?? "N/A"}</p>
            <p>Performance: {section.sectionPerformance ?? "N/A"}</p>

            <h4>Student Attendance</h4>
            {section.studentAttendance.map((s, index) => (
              <p key={index}>
                {s.studentName} — {s.percentage ?? "N/A"}
              </p>
            ))}

            <h4>Subject Averages</h4>
            {section.subjectAverages.map((sub, index) => (
              <p key={index}>
                {sub.subjectName} — {sub.percentage ?? "N/A"}
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

const sectionStyle = {
  border: "1px solid #ccc",
  padding: "15px",
  marginBottom: "20px",
  borderRadius: "8px",
};

export default TeacherDashboardPage;
