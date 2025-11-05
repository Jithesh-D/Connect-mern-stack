import axios from "axios";

const API_URL = "http://localhost:3001/api/contributions";

export const addContribution = async (contributionData) => {
  try {
    const response = await axios.post(API_URL, contributionData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to add contribution");
  }
};

export const getContributions = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch contributions");
  }
};

export const updateContribution = async (id, contributionData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, contributionData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to update contribution");
  }
};

export const deleteContribution = async (id, email) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      data: { email }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to delete contribution");
  }
};
