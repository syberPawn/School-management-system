import { useEffect, useState } from "react";
import { fetchAcademicYears } from "../api/academicYear.api";
import { fetchExamInstances, fetchReportCard } from "../api/examination.api";

const StudentReportCardPage = () => {
  const [academicYear, setAcademicYear] = useState(null);
  const [examInstances, setExamInstances] = useState([]);
  const [selectedExamInstanceId, setSelectedExamInstanceId] = useState("");
  const [reportCard, setReportCard] = useState(null);

  /*
  =====================================
  Load ACTIVE Academic Year
  =====================================
  */
  useEffect(() => {
    const loadActiveYear = async () => {
      try {
        const years = await fetchAcademicYears({ status: "ACTIVE" });
        if (years.length > 0) {
          setAcademicYear(years[0]);
        }
      } catch (error) {
        console.error("Failed to load academic year", error);
      }
    };

    loadActiveYear();
  }, []);

  /*
  =====================================
  Load Exam Instances
  =====================================
  */
  useEffect(() => {
    if (!academicYear) return;

    const loadExamInstances = async () => {
      try {
        const data = await fetchExamInstances(academicYear._id);
        setExamInstances(data);
      } catch (error) {
        console.error("Failed to load exam instances", error);
      }
    };

    loadExamInstances();
  }, [academicYear]);

  /*
  =====================================
  Load Report Card
  =====================================
  */
  useEffect(() => {
    if (!selectedExamInstanceId) {
      setReportCard(null);
      return;
    }

    const loadReportCard = async () => {
      try {
        const data = await fetchReportCard(selectedExamInstanceId);
        setReportCard(data);
      } catch (error) {
        console.error("Failed to load report card", error);
        setReportCard(null);
      }
    };

    loadReportCard();
  }, [selectedExamInstanceId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Report Card</h2>

      <hr />

      {academicYear && (
        <div>
          <strong>Active Academic Year:</strong> {academicYear.name}
        </div>
      )}

      <hr />

      {/* Exam Selection */}
      <div>
        <label>Select Exam:</label>
        <br />
        <select
          value={selectedExamInstanceId}
          onChange={(e) => setSelectedExamInstanceId(e.target.value)}
        >
          <option value="">-- Select Exam --</option>
          {examInstances.map((exam) => (
            <option key={exam._id} value={exam._id}>
              {exam.type} - {new Date(exam.examDate).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      <hr />

      {reportCard && (
        <div>
          <h3>Student Details</h3>
          <p>
            <strong>Name:</strong> {reportCard.student.fullName}
          </p>
          <p>
            <strong>Admission Number:</strong>{" "}
            {reportCard.student.admissionNumber}
          </p>
          <p>
            <strong>Section:</strong> {reportCard.section.name}
          </p>

          <hr />

          <h3>Exam Details</h3>
          <p>
            <strong>Exam Type:</strong> {reportCard.examInstance.type}
          </p>
          <p>
            <strong>Exam Date:</strong>{" "}
            {new Date(reportCard.examInstance.examDate).toLocaleDateString()}
          </p>

          <hr />

          <h3>Subject Marks</h3>

          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Subject ID</th>
                <th>Marks Obtained</th>
                <th>Maximum Marks</th>
              </tr>
            </thead>
            <tbody>
              {reportCard.subjects.map((subject) => (
                <tr key={subject.subjectId}>
                  <td>{subject.subjectId}</td>
                  <td>{subject.marksObtained}</td>
                  <td>{subject.maxMarks}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr />

          <h3>Result Summary</h3>
          <p>
            <strong>Total Marks:</strong> {reportCard.totalMarks}
          </p>
          <p>
            <strong>Percentage:</strong> {reportCard.percentage}%
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentReportCardPage;
