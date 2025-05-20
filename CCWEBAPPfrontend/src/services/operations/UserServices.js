import axios from 'axios';
import { profileEndpoints, endpoints } from '../api';

/**
 * Check if the user's profile is completed
 * @param {string} token - The authentication token
 * @returns {Promise<boolean>} - Returns true if profile is completed, false otherwise
 */
export const checkProfileCompletion = async (token) => {
  try {
    if (!token) {
      console.error('No authentication token found');
      return false;
    }

    // console.log('Checking profile completion with token:', token.substring(0, 10) + '...');

    const response = await axios.get(profileEndpoints.CHECK_PROFILE_COMPLETION_API, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      timeout: 10000 // 10 second timeout
    });
    
    if (response.status === 200) {
      // console.log('Profile completion response:', response.data);
      return response.data.isCompleted;
    }
    
    console.error('Unexpected response status:', response.status);
    return false;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    return false;
  }
};

/**
 * Update profile completion status in Redux store
 * @param {boolean} isCompleted - Whether the profile is completed
 */
export const updateProfileCompletionStatus = (isCompleted) => {
  store.dispatch(setProfileComplete(isCompleted));
};

/**
 * Logout user from the system
 * @param {string} token - The authentication token
 * @returns {Promise<Object>} - Returns the logout response
 */
export const logoutUser = async (token) => {
  try {
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(endpoints.LOGOUT_API, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};
