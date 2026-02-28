import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://portfolio-backend.onrender.com";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Token ${token}`, // Django expects: Token <key>
    },
  };
};

function parseApiError(error, fallbackMessage) {
  const responseData = error?.response?.data;

  if (responseData?.error) {
    return responseData.error;
  }

  if (responseData && typeof responseData === "object") {
    const [firstValue] = Object.values(responseData);
    if (Array.isArray(firstValue)) {
      return firstValue[0];
    }
    if (typeof firstValue === "string") {
      return firstValue;
    }
  }

  return error?.message || fallbackMessage;
}

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
    throw new Error(parseApiError(error, "Unable to create project."));
  }
};

export const getUserPublications = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/publications/user/${userId}/`);
    return response.data;
  } catch (error) {
    throw new Error(parseApiError(error, "Unable to load portfolio."));
  }
};

export const getMyPublications = async () => {
  try {
    const response = await axios.get(`${API_URL}/publications/mine/`, authHeader());
    return response.data;
  } catch (error) {
    throw new Error(parseApiError(error, "Unable to load your projects."));
  }
};

export const getPublication = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/publications/${id}/`, authHeader());
    return response.data;
  } catch (error) {
    throw new Error(parseApiError(error, "Unable to load this project."));
  }
};

export const updatePublication = async (id, data) => {
  try {
    const response = await axios.patch(
      `${API_URL}/publications/${id}/`,
      data,
      authHeader(),
    );
    return response.data;
  } catch (error) {
    throw new Error(parseApiError(error, "Unable to update project."));
  }
};

export const deletePublication = async (id) => {
  try {
    await axios.delete(`${API_URL}/publications/${id}/`, authHeader());
  } catch (error) {
    throw new Error(parseApiError(error, "Unable to delete project."));
  }
};

export const getMyProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/publications/profile/mine/`, authHeader());
    return response.data;
  } catch (error) {
    throw new Error(parseApiError(error, "Unable to load portfolio profile."));
  }
};

export const updateMyProfile = async (data) => {
  try {
    const response = await axios.patch(
      `${API_URL}/publications/profile/mine/`,
      data,
      authHeader(),
    );
    return response.data;
  } catch (error) {
    throw new Error(parseApiError(error, "Unable to save portfolio profile."));
  }
};

export const getPublicProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/publications/profile/user/${userId}/`);
    return response.data;
  } catch (error) {
    throw new Error(parseApiError(error, "Unable to load public profile."));
  }
};
