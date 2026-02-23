import axiosInstance from "./axiosInstance";

/*
  =====================================
  Student Enrollment API
  =====================================
*/

// FR-SM-04
export const createEnrollment = async (data) => {
  const response = await axiosInstance.post("/enrollments", data);
  return response.data;
};

// FR-SM-05
export const updateEnrollmentClass = async (enrollmentId, sectionId) => {
  const response = await axiosInstance.patch(
    `/enrollments/${enrollmentId}/class`,
    { sectionId },
  );
  return response.data;
};

// FR-SM-08
export const updateEnrollmentStatus = async (enrollmentId, newStatus) => {
  const response = await axiosInstance.patch(
    `/enrollments/${enrollmentId}/status`,
    { enrollmentStatus: newStatus },
  );
  return response.data;
};

// FR-SM-06
export const listStudents = async (params) => {
  const response = await axiosInstance.get("/enrollments", {
    params,
  });
  return response.data;
};
