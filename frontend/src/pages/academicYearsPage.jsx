import { useEffect, useState } from "react";
import {
  fetchAcademicYears,
  createAcademicYear,
  activateAcademicYear,
  deactivateAcademicYear,
} from "../api/academicYear.api";

function AcademicYearsPage() {
  const [years, setYears] = useState([]);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [message, setMessage] = useState("");

  const loadYears = async () => {
    try {
      const data = await fetchAcademicYears();
      setYears(data);
    } catch (error) {
      console.error("Failed to load academic years");
    }
  };

  useEffect(() => {
    loadYears();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await createAcademicYear({
        name,
        startDate,
        endDate,
        status,
      });

      setMessage("Academic year created successfully");
      setName("");
      setStartDate("");
      setEndDate("");
      setStatus("ACTIVE");

      loadYears();
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error creating academic year");
      }
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateAcademicYear(id);
      loadYears();
    } catch (error) {
      console.error("Activation failed");
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateAcademicYear(id);
      loadYears();
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      }
    }
  };

  return (
    <div>
      <h2>Academic Years</h2>

      <h3>Create Academic Year</h3>

      <form onSubmit={handleCreate}>
        <div>
          <label>Name:</label>
          <br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Start Date:</label>
          <br />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>End Date:</label>
          <br />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Status:</label>
          <br />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        <br />

        <button type="submit">Create</button>
      </form>

      {message && <p style={{ color: "blue" }}>{message}</p>}

      <hr />

      <h3>All Academic Years</h3>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {years.map((year) => (
            <tr key={year._id}>
              <td>{year.name}</td>
              <td>{new Date(year.startDate).toLocaleDateString()}</td>
              <td>{new Date(year.endDate).toLocaleDateString()}</td>
              <td>{year.status}</td>
              <td>
                {year.status === "ACTIVE" ? (
                  <button onClick={() => handleDeactivate(year._id)}>
                    Deactivate
                  </button>
                ) : (
                  <button onClick={() => handleActivate(year._id)}>
                    Activate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AcademicYearsPage;
