import { fetchAcademicYears } from "../api/academicYear.api";
import { fetchGradesByYear } from "../api/grade.api";
import { fetchSectionsByGrade } from "../api/section.api";
import { listStudents } from "../api/enrollment.api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentsPage = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);

  const [filters, setFilters] = useState({
    academicYearId: "",
    gradeId: "",
    sectionId: "",
    name: "",
    admissionNumber: "",
  });

  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /*
    ==============================
    Load Academic Years
    ==============================
  */
  useEffect(() => {
    const loadYears = async () => {
      try {
        const data = await fetchAcademicYears();
        setAcademicYears(data);
      } catch (err) {
        setError("Failed to load academic years");
      }
    };

    loadYears();
  }, []);

  /*
    ==============================
    Load Grades When Year Changes
    ==============================
  */
  useEffect(() => {
    if (!filters.academicYearId) return;

    const loadGrades = async () => {
      try {
        const data = await fetchGradesByYear(filters.academicYearId);
        setGrades(data);
        setSections([]);
        setFilters((prev) => ({ ...prev, gradeId: "", sectionId: "" }));
      } catch (err) {
        setError("Failed to load grades");
      }
    };

    loadGrades();
  }, [filters.academicYearId]);

  /*
    ==============================
    Load Sections When Grade Changes
    ==============================
  */
  useEffect(() => {
    if (!filters.gradeId) return;

    const loadSections = async () => {
      try {
        const data = await fetchSectionsByGrade(filters.gradeId);
        setSections(data);
        setFilters((prev) => ({ ...prev, sectionId: "" }));
      } catch (err) {
        setError("Failed to load sections");
      }
    };

    loadSections();
  }, [filters.gradeId]);

  /*
    ==============================
    Handle Search
    ==============================
  */
  const handleSearch = async () => {
    if (!filters.academicYearId) {
      setError("Academic year is required");
      return;
    }

    try {
      setError("");

      const query = {
        academicYearId: filters.academicYearId,
      };

      if (filters.sectionId) query.sectionId = filters.sectionId;
      if (filters.name) query.name = filters.name;
      if (filters.admissionNumber)
        query.admissionNumber = filters.admissionNumber;

      const data = await listStudents(query);
      setStudents(data);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Students</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginBottom: "20px" }}>
        <select
          value={filters.academicYearId}
          onChange={(e) =>
            setFilters({ ...filters, academicYearId: e.target.value })
          }
        >
          <option value="">Select Academic Year</option>
          {academicYears.map((year) => (
            <option key={year._id} value={year._id}>
              {year.name}
            </option>
          ))}
        </select>

        <select
          value={filters.gradeId}
          onChange={(e) => setFilters({ ...filters, gradeId: e.target.value })}
        >
          <option value="">Select Grade</option>
          {grades.map((grade) => (
            <option key={grade._id} value={grade._id}>
              {grade.name}
            </option>
          ))}
        </select>

        <select
          value={filters.sectionId}
          onChange={(e) =>
            setFilters({ ...filters, sectionId: e.target.value })
          }
        >
          <option value="">Select Section</option>
          {sections.map((section) => (
            <option key={section._id} value={section._id}>
              {section.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />

        <input
          type="text"
          placeholder="Search by admission number"
          value={filters.admissionNumber}
          onChange={(e) =>
            setFilters({ ...filters, admissionNumber: e.target.value })
          }
        />

        <button onClick={handleSearch}>Search</button>
      </div>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Admission Number</th>
            <th>Section</th>
            <th>Enrollment Status</th>
            <th>Identity Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.studentId}>
              <td>{student.fullName}</td>
              <td>{student.admissionNumber}</td>
              <td>{student.sectionId}</td>
              <td>{student.enrollmentStatus}</td>
              <td>{student.identityStatus}</td>
              <td>
                <button
                  onClick={() =>
                    navigate(`/admin/students/${student.studentId}/profile`)
                  }
                >
                  View Profile
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsPage;
