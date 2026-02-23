import { useEffect, useState } from "react";
import {
  fetchSubjects,
  createSubject,
  deactivateSubject,
  activateSubject,
} from "../api/subject.api";

function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const loadSubjects = async () => {
    try {
      const data = await fetchSubjects();
      setSubjects(data);
    } catch (error) {
      console.error("Failed to load subjects");
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await createSubject({ name });

      setMessage("Subject created successfully");
      setName("");
      loadSubjects();
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error creating subject");
      }
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await deactivateSubject(id);
      loadSubjects();
    } catch (error) {
      console.error("Deactivation failed");
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateSubject(id);
      loadSubjects();
    } catch (error) {
      console.error("Activation failed");
    }
  };

  return (
    <div>
      <h2>Subjects</h2>

      <h3>Create Subject</h3>

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

        <button type="submit">Create</button>
      </form>

      {message && <p style={{ color: "blue" }}>{message}</p>}

      <hr />

      <h3>All Subjects</h3>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject._id}>
              <td>{subject.name}</td>
              <td>{subject.status}</td>
              <td>
                {subject.status === "ACTIVE" ? (
                  <button onClick={() => handleDeactivate(subject._id)}>
                    Deactivate
                  </button>
                ) : (
                  <button onClick={() => handleActivate(subject._id)}>
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

export default SubjectsPage;
