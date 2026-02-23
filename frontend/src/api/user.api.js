import axiosInstance from "./axiosInstance";

/*
  =====================================
  User API
  =====================================
*/

export const fetchAllUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};
