import { useEffect, useState } from "react";
import { fetchAllUsers } from "../api/user.api";
import { createStudent } from "../api/student.api";
import { useNavigate } from "react-router-dom";

const CreateStudentPage = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    userId: "",
    fullName: "",
    dateOfBirth: "",
    gender: "",
    admissionNumber: "",
  });

  /*
    ==============================
    Load STUDENT Users
    ==============================
  */
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchAllUsers();

        // Filter only STUDENT role
        const studentUsers = data.filter((user) => user.role === "STUDENT");

        setUsers(studentUsers);
      } catch (err) {
        setError("Failed to load users");
      }
    };

    loadUsers();
  }, []);

  /*
    ==============================
    Handle Submit
    ==============================
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await createStudent(form);

      navigate("/admin/students");
    } catch (err) {
      setError(err.response?.data?.message || "Creation failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Student</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>User (STUDENT role): </label>
          <select
            required
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Full Name: </label>
          <input
            required
            type="text"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>

        <div>
          <label>Date of Birth: </label>
          <input
            required
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
          />
        </div>

        <div>
          <label>Gender: </label>
          <select
            required
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">Select</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>

        <div>
          <label>Admission Number: </label>
          <input
            required
            type="text"
            value={form.admissionNumber}
            onChange={(e) =>
              setForm({ ...form, admissionNumber: e.target.value })
            }
          />
        </div>

        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateStudentPage;
