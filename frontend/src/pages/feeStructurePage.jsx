import { useEffect, useState } from "react";

import { fetchAcademicYears } from "../api/academicYear.api";
import { fetchGradesByYear } from "../api/grade.api";

import { createFeeStructure } from "../api/fee.api";

function FeeStructurePage() {
  const [academicYears, setAcademicYears] = useState([]);
  const [grades, setGrades] = useState([]);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");

  const [message, setMessage] = useState("");

  const loadAcademicYears = async () => {
    try {
      const data = await fetchAcademicYears();
      setAcademicYears(data);
    } catch (error) {
      console.error("Failed to load academic years");
    }
  };

  const loadGrades = async (academicYearId) => {
    try {
      const data = await fetchGradesByYear(academicYearId);
      setGrades(data);
    } catch (error) {
      console.error("Failed to load grades");
    }
  };

  useEffect(() => {
    loadAcademicYears();
  }, []);

  const handleYearChange = (e) => {
    const yearId = e.target.value;
    setSelectedYear(yearId);

    if (yearId) {
      loadGrades(yearId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await createFeeStructure({
        academicYearId: selectedYear,
        gradeId: selectedGrade,
        monthlyAmount: Number(monthlyAmount),
      });

      setMessage("Fee structure created successfully");

      setSelectedGrade("");
      setMonthlyAmount("");
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error creating fee structure");
      }
    }
  };

  return (
    <div>
      <h2>Fee Management</h2>

      <h3>Create Fee Structure</h3>

      <form onSubmit={handleSubmit}>
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
          <label>Select Grade:</label>
          <br />
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            required
          >
            <option value="">-- Select Grade --</option>

            {grades.map((grade) => (
              <option key={grade._id} value={grade._id}>
                {grade.name}
              </option>
            ))}
          </select>
        </div>

        <br />

        <div>
          <label>Monthly Fee Amount:</label>
          <br />
          <input
            type="number"
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit">Create Fee Structure</button>
      </form>

      {message && <p style={{ color: "blue" }}>{message}</p>}
    </div>
  );
}

export default FeeStructurePage;
