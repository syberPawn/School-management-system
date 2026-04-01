import { useEffect, useState, useContext } from "react";
import { fetchAcademicYears } from "../api/academicYear.api";
import { fetchTeacherAssignments } from "../api/teacherAssignment.api";
import { fetchExamInstances } from "../api/examination.api";
import { AuthContext } from "../context/AuthContext";
import { fetchStudentsByEnrollment } from "../api/enrollment.api";
import { submitSubjectMarks } from "../api/examination.api";

const TeacherMarksPage = () => {
  const { userId } = useContext(AuthContext);

  const [academicYear, setAcademicYear] = useState(null);
  const [subjectAssignments, setSubjectAssignments] = useState([]);
  const [examInstances, setExamInstances] = useState([]);

  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedExamInstanceId, setSelectedExamInstanceId] = useState("");

  const [students, setStudents] = useState([]);
  const [marksMap, setMarksMap] = useState({});

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
  Load Teacher Assignments
  =====================================
  */
  useEffect(() => {
    if (!academicYear || !userId) return;

    const loadAssignments = async () => {
      try {
        const data = await fetchTeacherAssignments(userId, academicYear._id);
        setSubjectAssignments(data.subjectAssignments || []);
      } catch (error) {
        console.error("Failed to load teacher assignments", error);
      }
    };

    loadAssignments();
  }, [academicYear, userId]);

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
Load Students For Selected Section
=====================================
*/
  useEffect(() => {
    if (!academicYear || !selectedSectionId) {
      setStudents([]);
      return;
    }

    const loadStudents = async () => {
      try {
        const data = await fetchStudentsByEnrollment({
          academicYearId: academicYear._id,
          sectionId: selectedSectionId,
          enrollmentStatus: "ACTIVE",
        });

        setStudents(data);

        const initialMarks = {};
        data.forEach((enrollment) => {
          initialMarks[enrollment.enrollmentId] = "";
        });

        setMarksMap(initialMarks);
      } catch (error) {
        console.error("Failed to load students", error);
        setStudents([]);
      }
    };

    loadStudents();
  }, [academicYear, selectedSectionId]);

  /*
=====================================
Submit Marks
=====================================
*/
  const handleSubmitMarks = async () => {
    if (!selectedSectionId || !selectedSubjectId || !selectedExamInstanceId) {
      alert("Please select section, subject, and exam instance");
      return;
    }

    const marksArray = students.map((enrollment) => {
      const value = marksMap[enrollment.enrollmentId];

      if (value === "" || value === null) {
        throw new Error("All students must have marks entered");
      }

      return {
        enrollmentId: enrollment.enrollmentId,
        marksObtained: Number(value),
      };
    });

    try {
      await submitSubjectMarks({
        examInstanceId: selectedExamInstanceId,
        sectionId: selectedSectionId,
        subjectId: selectedSubjectId,
        teacherId: userId,
        marks: marksArray,
      });

      alert("Marks submitted successfully");

      // Reset marks
      const resetMarks = {};
      students.forEach((enrollment) => {
        resetMarks[enrollment.enrollmentId] = "";
      });
      setMarksMap(resetMarks);
    } catch (error) {
      alert(error.response?.data?.message || "Marks submission failed");
    }
  };

  /*
  =====================================
  Derived Unique Sections
  =====================================
  */
  const uniqueSections = [
    ...new Map(
      subjectAssignments.map((a) => [a.sectionId?._id, a.sectionId]),
    ).values(),
  ];

const filteredSubjects = subjectAssignments.filter(
  (a) => a.sectionId?._id === selectedSectionId,
);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Marks Submission</h2>

      <hr />

      {academicYear && (
        <div>
          <strong>Active Academic Year:</strong> {academicYear.name}
        </div>
      )}

      <hr />

      {subjectAssignments.length === 0 ? (
        <div>No subject assignments found.</div>
      ) : (
        <div>
          <h3>Select Details</h3>

          {/* Section Selection */}
          <div>
            <label>Section:</label>
            <br />
            <select
              value={selectedSectionId}
              onChange={(e) => {
                setSelectedSectionId(e.target.value);
                setSelectedSubjectId("");
              }}
            >
              <option value="">-- Select Section --</option>
              {uniqueSections.map((section) => (
                <option key={section?._id} value={section?._id}>
                  {section?.name}
                </option>
              ))}
            </select>
          </div>

          <br />

          {/* Subject Selection */}
          <div>
            <label>Subject:</label>
            <br />
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              disabled={!selectedSectionId}
            >
              <option value="">-- Select Subject --</option>

              {[
                ...new Map(
                  filteredSubjects.map((a) => [a.subjectId?._id, a]),
                ).values(),
              ].map((assignment) => (
                <option
                  key={assignment.subjectId?._id}
                  value={assignment.subjectId?._id}
                >
                  {assignment.subjectId?.name}
                </option>
              ))}
            </select>
          </div>

          <br />

          {/* Exam Instance Selection */}
          <div>
            <label>Exam Instance:</label>
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

          {students.length > 0 &&
            selectedSubjectId &&
            selectedExamInstanceId && (
              <div>
                <h3>Enter Marks</h3>

                {students.map((enrollment) => (
                  <div
                    key={enrollment.enrollmentId}
                    style={{ marginBottom: "10px" }}
                  >
                    <span>Student: {enrollment.fullName}</span>

                    <div>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={marksMap[enrollment.enrollmentId] || ""}
                        onChange={(e) =>
                          setMarksMap((prev) => ({
                            ...prev,
                            [enrollment.enrollmentId]: e.target.value,
                          }))
                        }
                        placeholder="Enter marks (0-100)"
                      />
                    </div>
                  </div>
                ))}
                <br />
                <button onClick={handleSubmitMarks}>Submit Marks</button>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default TeacherMarksPage;
