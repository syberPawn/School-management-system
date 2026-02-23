import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentProfile } from "../api/student.api";

const StudentProfilePage = () => {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getStudentProfile(id);
        setProfile(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      }
    };

    loadProfile();
  }, [id]);

  if (error) {
    return <p style={{ color: "red", padding: "20px" }}>{error}</p>;
  }

  if (!profile) {
    return <p style={{ padding: "20px" }}>Loading...</p>;
  }

  const { identity, activeEnrollment } = profile;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Student Profile</h2>

      <h3>Identity</h3>
      <p>
        <strong>Full Name:</strong> {identity.fullName}
      </p>
      <p>
        <strong>Date of Birth:</strong>{" "}
        {new Date(identity.dateOfBirth).toLocaleDateString()}
      </p>
      <p>
        <strong>Gender:</strong> {identity.gender}
      </p>
      <p>
        <strong>Admission Number:</strong> {identity.admissionNumber}
      </p>
      <p>
        <strong>Identity Status:</strong> {identity.identityStatus}
      </p>

      <h3>Active Enrollment</h3>
      {activeEnrollment ? (
        <>
          <p>
            <strong>Academic Year:</strong> {activeEnrollment.academicYearId}
          </p>
          <p>
            <strong>Section:</strong> {activeEnrollment.sectionId}
          </p>
          <p>
            <strong>Status:</strong> {activeEnrollment.enrollmentStatus}
          </p>
        </>
      ) : (
        <p>No active enrollment</p>
      )}
    </div>
  );
};

export default StudentProfilePage;
