import { useState } from "react";
import { createStudent } from "../api/student.api";

function StudentIdentitiesPage() {
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("MALE");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [message, setMessage] = useState("");

  /*
  =====================================
  Create Student Identity
  =====================================
  */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await createStudent({
        fullName,
        dateOfBirth,
        gender,
        admissionNumber,
      });

      setMessage("Student created successfully");
      setFullName("");
      setDateOfBirth("");
      setAdmissionNumber("");
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error creating student");
      }
    }
  };

  return (
    <div>
      <h2>Student Identity Management</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <br />
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Date of Birth:</label>
          <br />
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Gender:</label>
          <br />
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>

        <br />

        <div>
          <label>Admission Number:</label>
          <br />
          <input
            type="text"
            value={admissionNumber}
            onChange={(e) => setAdmissionNumber(e.target.value)}
            required
          />
        </div>

        <br />

        <button type="submit">Create Student</button>
      </form>

      {message && <p style={{ color: "blue" }}>{message}</p>}
    </div>
  );
}

export default StudentIdentitiesPage;
