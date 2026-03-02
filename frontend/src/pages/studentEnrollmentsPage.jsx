

// export default StudentEnrollmentsPage;
import { useEffect, useState } from "react";
import { fetchAcademicYears } from "../api/academicYear.api";
import { fetchGradesByYear } from "../api/grade.api";
import { fetchSectionsByGrade } from "../api/section.api";
import {
  fetchStudentsByEnrollment,
  createEnrollment,
  updateEnrollmentStatus,
  updateEnrollmentClass,
} from "../api/enrollment.api";
import { fetchStudents } from "../api/student.api";

function StudentEnrollmentsPage() {
  const [years, setYears] = useState([]);
  const [selectedYearId, setSelectedYearId] = useState("");

  const [grades, setGrades] = useState([]);
  const [selectedGradeId, setSelectedGradeId] = useState("");

  const [sections, setSections] = useState([]);
  const [selectedSectionId, setSelectedSectionId] = useState("");

  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const [message, setMessage] = useState("");

  const [searchName, setSearchName] = useState("");
  const [searchAdmissionNumber, setSearchAdmissionNumber] = useState("");
  const [enrollmentList, setEnrollmentList] = useState([]);

  const loadEnrollmentList = async () => {
    if (!selectedYearId) return;

    try {
      const params = {
        academicYearId: selectedYearId,
      };

      if (selectedSectionId) {
        params.sectionId = selectedSectionId;
      }

      if (searchName) {
        params.name = searchName;
      }

      if (searchAdmissionNumber) {
        params.admissionNumber = searchAdmissionNumber;
      }

      const data = await fetchStudentsByEnrollment(params);
      setEnrollmentList(data);
    } catch (error) {
      console.error("Failed to load enrollment list");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadEnrollmentList();
  };

  const handleStatusChange = async (enrollmentId, newStatus) => {
    try {
      await updateEnrollmentStatus(enrollmentId, newStatus);
      loadEnrollmentList();
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Error updating status");
      }
    }
  };

  const handleClassChange = async (enrollmentId, newSectionId) => {
    try {
      await updateEnrollmentClass(enrollmentId, newSectionId);
      loadEnrollmentList();
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Error updating class");
      }
    }
  };

  /*
  =====================================
  Load Academic Years
  =====================================
  */
  const loadAcademicYears = async () => {
    try {
      const data = await fetchAcademicYears();
      setYears(data);

      const activeYear = data.find((y) => y.status === "ACTIVE");

      if (activeYear) {
        setSelectedYearId(activeYear._id);
        loadGrades(activeYear._id);
      }
    } catch (error) {
      console.error("Failed to load academic years");
    }
  };

  /*
  =====================================
  Load Grades by Year
  =====================================
  */
  const loadGrades = async (yearId) => {
    try {
      const data = await fetchGradesByYear(yearId);
      setGrades(data);
      setSections([]);
      setSelectedGradeId("");
      setSelectedSectionId("");
    } catch (error) {
      console.error("Failed to load grades");
    }
  };

  /*
  =====================================
  Load Sections by Grade
  =====================================
  */
  const loadSections = async (gradeId) => {
    try {
      const data = await fetchSectionsByGrade(gradeId);
      setSections(data);
      setSelectedSectionId("");
    } catch (error) {
      console.error("Failed to load sections");
    }
  };

  /*
  =====================================
  Load Student Users
  =====================================
  */
  const loadStudents = async () => {
    try {
      const data = await fetchStudents();
      console.log("Students API Response:", data);
      setStudents(data);
    } catch (error) {
      console.error("Students Load Error:", error.response || error);
    }
  };

  useEffect(() => {
    loadAcademicYears();
    loadStudents();
  }, []);

  /*
  =====================================
  Handlers
  =====================================
  */
  const handleYearChange = (e) => {
    const yearId = e.target.value;
    setSelectedYearId(yearId);
    loadGrades(yearId);
  };

  const handleGradeChange = (e) => {
    const gradeId = e.target.value;
    setSelectedGradeId(gradeId);
    loadSections(gradeId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      console.log("Submitting Enrollment:", {
        studentId: selectedStudentId,
        academicYearId: selectedYearId,
        sectionId: selectedSectionId,
      });
      await createEnrollment({
        studentId: selectedStudentId,
        academicYearId: selectedYearId,
        sectionId: selectedSectionId,
      });

      setMessage("Enrollment created successfully");
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error creating enrollment");
      }
    }
  };

  return (
    <div>
      <h2>Student Enrollment Management</h2>

      <form onSubmit={handleSubmit}>
        {/* Academic Year */}
        <div>
          <label>Select Academic Year:</label>
          <br />
          <select value={selectedYearId} onChange={handleYearChange} required>
            <option value="">-- Select Year --</option>
            {years.map((year) => (
              <option key={year._id} value={year._id}>
                {year.name} ({year.status})
              </option>
            ))}
          </select>
        </div>

        <br />

        {/* Grade */}
        <div>
          <label>Select Grade:</label>
          <br />
          <select value={selectedGradeId} onChange={handleGradeChange} required>
            <option value="">-- Select Grade --</option>
            {grades.map((grade) => (
              <option key={grade._id} value={grade._id}>
                {grade.name}
              </option>
            ))}
          </select>
        </div>

        <br />

        {/* Section */}
        <div>
          <label>Select Section:</label>
          <br />
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            required
          >
            <option value="">-- Select Section --</option>
            {sections.map((section) => (
              <option key={section._id} value={section._id}>
                {section.name}
              </option>
            ))}
          </select>
        </div>

        <br />

        {/* Student */}
        <div>
          <label>Select Student:</label>
          <br />
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            required
          >
            <option value="">-- Select Student --</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.fullName} ({student.admissionNumber})
              </option>
            ))}
          </select>
        </div>

        <br />

        <button type="submit">Create Enrollment</button>
      </form>

      <hr />

      <h3>Student Enrollment List</h3>

      <form onSubmit={handleSearch}>
        <div>
          <label>Search by Name:</label>
          <br />
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Search by Admission Number:</label>
          <br />
          <input
            type="text"
            value={searchAdmissionNumber}
            onChange={(e) => setSearchAdmissionNumber(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">Search</button>
      </form>

      <br />

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Admission Number</th>
            <th>Section</th>
            <th>Enrollment Status</th>
            <th>Identity Status</th>
            <th>Profile</th>
          </tr>
        </thead>
        <tbody>
          {enrollmentList.map((item) => (
            <tr key={item.studentId}>
              <td>{item.fullName}</td>
              <td>{item.admissionNumber}</td>
              <td>
                {item.enrollmentStatus === "ACTIVE" ? (
                  <select
                    value={item.sectionId}
                    onChange={(e) =>
                      handleClassChange(item.enrollmentId, e.target.value)
                    }
                  >
                    {sections.map((section) => (
                      <option key={section._id} value={section._id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  item.sectionId
                )}
              </td>
              <td>
                <select
                  value={item.enrollmentStatus}
                  onChange={(e) =>
                    handleStatusChange(item.enrollmentId, e.target.value)
                  }
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PROMOTED">PROMOTED</option>
                  <option value="REPEATING">REPEATING</option>
                  <option value="WITHDRAWN">WITHDRAWN</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </td>
              <td>{item.identityStatus}</td>
              <td>
                <a href={`/admin/students/${item.studentId}`}>View</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {message && <p style={{ color: "blue" }}>{message}</p>}
    </div>
  );
}

export default StudentEnrollmentsPage;
