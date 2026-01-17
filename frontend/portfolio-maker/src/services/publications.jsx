import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const authHeader = () => {
  const token = localStorage.getItem("token"); // or wherever you store it
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createPublication = (data) => {
  return axios.post(`${API_URL}/publications/create/`, data, authHeader());
};

export const getUserPublications = (userId) => {
  return axios.get(`${API_URL}/publications/user/${userId}/`);
};

export const updatePublication = (id, data) => {
  return axios.put(`${API_URL}/publications/update/${id}/`, data, authHeader());
};

export const deletePublication = (id) => {
  return axios.delete(`${API_URL}/publications/delete/${id}/`, authHeader());
};
