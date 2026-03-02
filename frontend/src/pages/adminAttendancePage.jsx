import { useEffect, useState } from "react";
import { fetchAcademicYears } from "../api/academicYear.api";
import { fetchGradesByYear } from "../api/grade.api";
import { fetchSectionsByGrade } from "../api/section.api";
import { fetchSectionAttendance } from "../api/attendance.api";
import { fetchSectionAttendancePercentage } from "../api/attendance.api";
import { fetchStudentsByEnrollment } from "../api/enrollment.api";

const AdminAttendancePage = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [academicYearId, setAcademicYearId] = useState("");
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [sectionId, setSectionId] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [percentage, setPercentage] = useState(null);
  const [enrollmentMap, setEnrollmentMap] = useState({});
  const [gradeId, setGradeId] = useState("");

  useEffect(() => {
    if (!academicYearId || !sectionId) {
      setEnrollmentMap({});
      return;
    }

    const loadEnrollments = async () => {
      try {
        const data = await fetchStudentsByEnrollment({
          academicYearId,
          sectionId,
        });

        const map = {};
        data.forEach((item) => {
          map[item.enrollmentId] = item.fullName;
        });

        setEnrollmentMap(map);
      } catch (error) {
        console.error("Failed to load enrollments", error);
        setEnrollmentMap({});
      }
    };

    loadEnrollments();
  }, [academicYearId, sectionId]);
  /*
  =====================================
  Load Academic Years
  =====================================
  */
  useEffect(() => {
    const loadYears = async () => {
      try {
        const data = await fetchAcademicYears();
        setAcademicYears(data);
      } catch (error) {
        console.error("Failed to load academic years", error);
      }
    };

    loadYears();
  }, []);

  /*
  =====================================
  Load Grades when Academic Year changes
  =====================================
  */
  useEffect(() => {
    if (!academicYearId) {
      setGrades([]);
      setSections([]);
      return;
    }

    const loadGrades = async () => {
      try {
        const data = await fetchGradesByYear(academicYearId);
        setGrades(data);
      } catch (error) {
        console.error("Failed to load grades", error);
      }
    };

    loadGrades();
  }, [academicYearId]);

  /*
  =====================================
  Load Sections when Grades change
  =====================================
  */
  useEffect(() => {
    if (!gradeId) {
      setSections([]);
      return;
    }

    const loadSections = async () => {
      try {
        const data = await fetchSectionsByGrade(gradeId);
        setSections(data);
      } catch (error) {
        console.error("Failed to load sections", error);
        setSections([]);
      }
    };

    loadSections();
  }, [gradeId]);

  /*
  =====================================
  Load Attendance
  =====================================
  */
  useEffect(() => {
    if (!academicYearId || !sectionId) {
      setAttendance([]);
      return;
    }

    const loadAttendance = async () => {
      try {
        const data = await fetchSectionAttendance(academicYearId, sectionId);
        setAttendance(data);
      } catch (error) {
        console.error("Failed to load attendance", error);
        setAttendance([]);
      }
    };

    loadAttendance();
  }, [academicYearId, sectionId]);

  /*
=====================================
Load Section Percentage
=====================================
*/
  useEffect(() => {
    if (!academicYearId || !sectionId) {
      setPercentage(null);
      return;
    }

    const loadPercentage = async () => {
      try {
        const result = await fetchSectionAttendancePercentage(
          sectionId,
          academicYearId,
        );
        setPercentage(result);
      } catch (error) {
        console.error("Failed to load section percentage", error);
        setPercentage(null);
      }
    };

    loadPercentage();
  }, [academicYearId, sectionId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Section Attendance View</h2>

      <div>
        <label>Academic Year:</label>
        <select
          value={academicYearId}
          onChange={(e) => {
            setAcademicYearId(e.target.value);
            setGradeId("");
            setSectionId("");
          }}
        >
          <option value="">Select Academic Year</option>
          {academicYears.map((year) => (
            <option key={year._id} value={year._id}>
              {year.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Grade:</label>
        <select
          value={gradeId}
          onChange={(e) => {
            setGradeId(e.target.value);
            setSectionId("");
          }}
          disabled={!academicYearId}
        >
          <option value="">Select Grade</option>
          {grades.map((grade) => (
            <option key={grade._id} value={grade._id}>
              {grade.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Section:</label>
        <select
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
          disabled={!academicYearId}
        >
          <option value="">Select Section</option>
          {sections.map((section) => (
            <option key={section._id} value={section._id}>
              {section.name}
            </option>
          ))}
        </select>
      </div>

      <hr />

      <hr />

      {percentage === null ? (
        <div>Section Attendance Percentage: No data available.</div>
      ) : (
        <div>
          <strong>Section Attendance Percentage:</strong>{" "}
          {percentage.toFixed(2)}%
        </div>
      )}

      <hr />

      {attendance.length === 0 ? (
        <div>No attendance records found.</div>
      ) : (
        Object.entries(
          attendance.reduce((acc, entry) => {
            const dateKey = new Date(entry.date).toLocaleDateString();

            if (!acc[dateKey]) {
              acc[dateKey] = [];
            }

            acc[dateKey].push(entry);
            return acc;
          }, {}),
        ).map(([date, entries]) => (
          <div key={date} style={{ marginBottom: "20px" }}>
            <h4>Date: {date}</h4>

            {entries.map((entry) => (
              <div key={entry._id}>
                Student:{" "}
                {enrollmentMap[entry.enrollmentId] || entry.enrollmentId} |
                Status: {entry.status}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminAttendancePage;
