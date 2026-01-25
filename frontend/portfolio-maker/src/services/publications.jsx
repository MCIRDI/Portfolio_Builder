import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Token ${token}`, // Django expects: Token <key>
    },
  };
};

// CREATE
export const createPublication = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/publications/create/`,
      data,
      authHeader(),
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { error: "No response from server" };
    } else {
      throw { error: error.message };
    }
  }
};

export const getUserPublications = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/publications/user/${userId}/`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      throw { error: "No response from server" };
    } else {
      throw { error: error.message };
    }
  }
};

export const updatePublication = async (id, data) => {
    try {
        const response = await axios.patch(
            `${API_URL}/publications/update/${id}/`, 
            data,
            authHeader(),
        );
        return response.data;
    } catch (error) {
        alert("error!")
        throw error;
    }
};

export const deletePublication = (id) => {
  return axios.delete(`${API_URL}/publications/delete/${id}/`, authHeader());
};
