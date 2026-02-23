import { useEffect, useState } from "react";
import { fetchAcademicYears } from "../api/academicYear.api";
import {
  fetchGradesByYear,
  createGrade,
  deactivateGrade,
} from "../api/grade.api";

function GradesPage() {
  const [years, setYears] = useState([]);
  const [selectedYearId, setSelectedYearId] = useState("");
  const [grades, setGrades] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  /*
  =====================================
  Load Academic Years on Page Mount
  =====================================
  */
  const loadAcademicYears = async () => {
    try {
      const data = await fetchAcademicYears();
      setYears(data);

      // Find ACTIVE year (guaranteed by backend)
      const activeYear = data.find((year) => year.status === "ACTIVE");

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
  Load Grades for Selected Year
  =====================================
  */
  const loadGrades = async (academicYearId) => {
    try {
      const data = await fetchGradesByYear(academicYearId);
      setGrades(data);
    } catch (error) {
      console.error("Failed to load grades");
    }
  };

  /*
  =====================================
  On Page Load
  =====================================
  */
  useEffect(() => {
    loadAcademicYears();
  }, []);

  /*
  =====================================
  When Year Changes
  =====================================
  */
  const handleYearChange = async (e) => {
    const yearId = e.target.value;
    setSelectedYearId(yearId);
    loadGrades(yearId);
  };

  /*
  =====================================
  Create Grade
  =====================================
  */
  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await createGrade({
        name,
        academicYearId: selectedYearId,
      });

      setMessage("Grade created successfully");
      setName("");
      loadGrades(selectedYearId);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error creating grade");
      }
    }
  };

  /*
  =====================================
  Deactivate Grade
  =====================================
  */
  const handleDeactivate = async (id) => {
    try {
      await deactivateGrade(id);
      loadGrades(selectedYearId);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      }
    }
  };

  return (
    <div>
      <h2>Grades</h2>

      {/* Academic Year Selector */}
      <div>
        <label>Select Academic Year:</label>
        <br />
        <select value={selectedYearId} onChange={handleYearChange}>
          {years.map((year) => (
            <option key={year._id} value={year._id}>
              {year.name} ({year.status})
            </option>
          ))}
        </select>
      </div>

      <hr />

      <h3>Create Grade</h3>

      <form onSubmit={handleCreate}>
        <div>
          <label>Grade Name:</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit">Create</button>
      </form>

      {message && <p style={{ color: "blue" }}>{message}</p>}

      <hr />

      <h3>All Grades</h3>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <tr key={grade._id}>
              <td>{grade.name}</td>
              <td>{grade.status}</td>
              <td>
                {grade.status === "ACTIVE" ? (
                  <button onClick={() => handleDeactivate(grade._id)}>
                    Deactivate
                  </button>
                ) : (
                  <span>Inactive</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GradesPage;
