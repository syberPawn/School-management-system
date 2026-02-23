import { useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function UsersPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("TEACHER");
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post("/users", {
        username,
        password,
        role,
      });

      setMessage("User created successfully!");
      setUsername("");
      setPassword("");
      setRole("TEACHER");

      fetchUsers(); // refresh list
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error creating user");
      }
    }
  };

  const handleDeactivate = async (userId) => {
    try {
      await axios.patch(`/users/${userId}/deactivate`);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user");
    }
  };

  const handleReactivate = async (userId) => {
    try {
      await axios.patch(`/users/${userId}`, {
        status: "ACTIVE",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error reactivating user");
    }
  };

  const handlePasswordUpdate = async (userId) => {
    const newPassword = prompt("Enter new password:");

    if (!newPassword) return;

    try {
      await axios.patch(`/users/${userId}`, {
        password: newPassword,
      });
      alert("Password updated");
    } catch (error) {
      console.error("Error updating password");
    }
  };

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={handleLogout}>Logout</button>

      <h2>Admin Dashboard</h2>

      <h3>Create User</h3>

      <form onSubmit={handleCreateUser}>
        <div>
          <label>Username:</label>
          <br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Password:</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <br />

        <div>
          <label>Role:</label>
          <br />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="TEACHER">TEACHER</option>
            <option value="STUDENT">STUDENT</option>
          </select>
        </div>

        <br />

        <button type="submit">Create User</button>
      </form>

      {message && <p style={{ marginTop: "15px", color: "blue" }}>{message}</p>}

      <hr />

      <h3>All Users</h3>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                {user.status === "ACTIVE" ? (
                  <>
                    <button onClick={() => handleDeactivate(user._id)}>
                      Deactivate
                    </button>
                    <button
                      onClick={() => handlePasswordUpdate(user._id)}
                      style={{ marginLeft: "5px" }}
                    >
                      Change Password
                    </button>
                  </>
                ) : (
                  <button onClick={() => handleReactivate(user._id)}>
                    Reactivate
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

export default UsersPage;
