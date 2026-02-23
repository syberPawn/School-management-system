import axiosInstance from "./axiosInstance";

/*
  =====================================
  Student Identity API
  =====================================
*/

// FR-SM-01
export const createStudent = async (data) => {
  const response = await axiosInstance.post("/students", data);
  return response.data;
};

// FR-SM-02
export const updateStudent = async (studentId, data) => {
  const response = await axiosInstance.patch(`/students/${studentId}`, data);
  return response.data;
};

// FR-SM-03
export const deactivateStudent = async (studentId) => {
  const response = await axiosInstance.patch(
    `/students/${studentId}/deactivate`,
  );
  return response.data;
};

// FR-SM-07
export const getStudentById = async (studentId) => {
  const response = await axiosInstance.get(`/students/${studentId}`);
  return response.data;
};

export const getStudentProfile = async (studentId) => {
  const response = await axiosInstance.get(`/students/${studentId}/profile`);
  return response.data;
};
