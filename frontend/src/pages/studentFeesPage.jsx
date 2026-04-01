import { useEffect, useState, useContext } from "react";

import { fetchStudentFeeStatus } from "../api/fee.api";
import { AuthContext } from "../context/AuthContext";

function StudentFeesPage() {
  const { authLoading } = useContext(AuthContext);
  console.log("Auth loading:", authLoading);

  const [fees, setFees] = useState([]);
  const [message, setMessage] = useState("");

  const loadFees = async () => {
    console.log("loadFees triggered");

    try {
      const userId = localStorage.getItem("userId");

      console.log("Calling API with enrollmentId:", userId);

      const data = await fetchStudentFeeStatus();

      console.log("API Response:", data);

      setFees(data);
    } catch (error) {
      console.error("Failed to load fee status", error);

      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Error loading fee status");
      }
    }
  };

 useEffect(() => {
   if (!authLoading) {
     loadFees();
   }
 }, [authLoading]);

  return (
    <div>
      <h2>My Fees</h2>

      {message && <p style={{ color: "red" }}>{message}</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Month</th>
            <th>Status</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {fees.map((fee) => (
            <tr key={fee.month}>
              <td>{fee.month}</td>
              <td>{fee.status}</td>
              <td>{fee.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentFeesPage;
