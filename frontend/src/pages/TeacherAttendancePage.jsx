import { useEffect, useState, useContext } from "react";
import { fetchAcademicYears } from "../api/academicYear.api";
import { fetchTeacherAssignments } from "../api/teacherAssignment.api";
import { fetchStudentsByEnrollment } from "../api/enrollment.api";
import { recordAttendance } from "../api/attendance.api";
import { AuthContext } from "../context/AuthContext";

const TeacherAttendancePage = () => {
  const { userId } = useContext(AuthContext);

  const [academicYear, setAcademicYear] = useState(null);
  const [assignedSectionId, setAssignedSectionId] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [attendanceDate, setAttendanceDate] = useState("");

  /*
  =====================================
  Load ACTIVE Academic Year
  =====================================
  */
  useEffect(() => {
    const loadActiveYear = async () => {
      try {
        const years = await fetchAcademicYears({ status: "ACTIVE" });

        if (years.length > 0) {
          setAcademicYear(years[0]);
        }
      } catch (error) {
        console.error("Failed to load academic year", error);
      }
    };

    loadActiveYear();
  }, []);

  /*
  =====================================
  Load Teacher Class Assignment
  =====================================
  */
  useEffect(() => {
    if (!academicYear || !userId) return;

    const loadAssignment = async () => {
      try {
        const data = await fetchTeacherAssignments(userId, academicYear._id);
        console.log("Teacher Assignment Response:", data);

        if (data.classAssignments.length > 0) {
          setAssignedSectionId(data.classAssignments[0].sectionId);
        } else {
          setAssignedSectionId(null);
        }
      } catch (error) {
        console.error("Failed to load teacher assignment", error);
        setAssignedSectionId(null);
      }
    };

    loadAssignment();
  }, [academicYear, userId]);

  /*
  =====================================
  Load Active Enrollments (Students)
  =====================================
  */
  useEffect(() => {
    if (!academicYear || !assignedSectionId) {
      setStudents([]);
      return;
    }

    const loadStudents = async () => {
      try {
        const data = await fetchStudentsByEnrollment({
          academicYearId: academicYear._id,
          sectionId: assignedSectionId,
          enrollmentStatus: "ACTIVE",
        });

        setStudents(data);

        const initialAttendance = {};
        data.forEach((enrollment) => {
          initialAttendance[enrollment.enrollmentId] = "PRESENT";
        });

        setAttendanceMap(initialAttendance);
      } catch (error) {
        console.error("Failed to load students", error);
        setStudents([]);
      }
    };

    loadStudents();
  }, [academicYear, assignedSectionId]);

  const handleStatusChange = (enrollmentId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [enrollmentId]: status,
    }));
  };

  /*
  =====================================
  Submit Attendance
  =====================================
  */
  const handleSubmitAttendance = async () => {
    if (!attendanceDate) {
      alert("Please select attendance date");
      return;
    }

    try {
      const studentAttendanceList = students.map((enrollment) => ({
        enrollmentId: enrollment.enrollmentId,
        status: attendanceMap[enrollment.enrollmentId],
      }));

      await recordAttendance({
        teacherId: userId,
        academicYearId: academicYear._id,
        sectionId: assignedSectionId,
        attendanceDate,
        studentAttendanceList,
      });

      alert("Attendance recorded successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Attendance submission failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Attendance Management</h2>

      <hr />

      {academicYear && (
        <div>
          <strong>Active Academic Year:</strong> {academicYear.name}
        </div>
      )}

      <hr />

      {students.length === 0 ? (
        <div>No active students found.</div>
      ) : (
        <div>
          <h3>Mark Attendance</h3>

          <div style={{ marginBottom: "15px" }}>
            <label>Date: </label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
          </div>

          {students.map((enrollment) => (
            <div key={enrollment.enrollmentId} style={{ marginBottom: "10px" }}>
              <span>Student: {enrollment.fullName}</span>
              <div>
                <label>
                  <input
                    type="radio"
                    name={enrollment.enrollmentId}
                    value="PRESENT"
                    checked={
                      attendanceMap[enrollment.enrollmentId] === "PRESENT"
                    }
                    onChange={() =>
                      handleStatusChange(enrollment.enrollmentId, "PRESENT")
                    }
                  />
                  Present
                </label>

                <label style={{ marginLeft: "10px" }}>
                  <input
                    type="radio"
                    name={enrollment.enrollmentId}
                    value="ABSENT"
                    checked={
                      attendanceMap[enrollment.enrollmentId] === "ABSENT"
                    }
                    onChange={() =>
                      handleStatusChange(enrollment.enrollmentId, "ABSENT")
                    }
                  />
                  Absent
                </label>
              </div>
            </div>
          ))}

          <button onClick={handleSubmitAttendance}>Submit Attendance</button>
        </div>
      )}
    </div>
  );
};

export default TeacherAttendancePage;
