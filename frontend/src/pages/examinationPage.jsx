import { useEffect, useState } from "react";
import { fetchAcademicYears } from "../api/academicYear.api";
import {
  createExamInstances,
  fetchExamInstances,
} from "../api/examination.api";

function ExaminationPage() {
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [halfYearlyDate, setHalfYearlyDate] = useState("");
  const [endTermDate, setEndTermDate] = useState("");
  const [examInstances, setExamInstances] = useState([]);
  const [message, setMessage] = useState("");

  const loadAcademicYears = async () => {
    try {
      const data = await fetchAcademicYears();
      setAcademicYears(data);
    } catch (error) {
      console.error("Failed to load academic years");
    }
  };

  const loadExamInstances = async (academicYearId) => {
    try {
      const data = await fetchExamInstances(academicYearId);
      setExamInstances(data);
    } catch (error) {
      console.error("Failed to load exam instances");
    }
  };

  useEffect(() => {
    loadAcademicYears();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await createExamInstances({
        academicYearId: selectedYear,
        halfYearlyExamDate: halfYearlyDate,
        endTermExamDate: endTermDate,
      });

      setMessage("Exam instances created successfully");
      setHalfYearlyDate("");
      setEndTermDate("");

      loadExamInstances(selectedYear);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error creating exam instances");
      }
    }
  };

  const handleYearChange = (e) => {
    const yearId = e.target.value;
    setSelectedYear(yearId);
    if (yearId) {
      loadExamInstances(yearId);
    }
  };

  return (
    <div>
      <h2>Examination Management</h2>

      <h3>Create Exam Instances</h3>

      <form onSubmit={handleCreate}>
        <div>
          <label>Select Academic Year:</label>
          <br />
          <select value={selectedYear} onChange={handleYearChange} required>
            <option value="">-- Select Academic Year --</option>
            {academicYears.map((year) => (
              <option key={year._id} value={year._id}>
                {year.name} ({year.status})
              </option>
            ))}
          </select>
        </div>

        <br />

        <div>
          <label>Half-Yearly Exam Date:</label>
          <br />
          <input
            type="date"
            value={halfYearlyDate}
            onChange={(e) => setHalfYearlyDate(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>End-Term Exam Date:</label>
          <br />
          <input
            type="date"
            value={endTermDate}
            onChange={(e) => setEndTermDate(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit">Create Exam Instances</button>
      </form>

      {message && <p style={{ color: "blue" }}>{message}</p>}

      <hr />

      <h3>Exam Instances</h3>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Type</th>
            <th>Exam Date</th>
          </tr>
        </thead>
        <tbody>
          {examInstances.map((instance) => (
            <tr key={instance._id}>
              <td>{instance.type}</td>
              <td>{new Date(instance.examDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExaminationPage;
