import axios from 'axios';
import { HTTP_URL } from '@/config';

export const signupUser = async (userData: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const response = await axios.post(`${HTTP_URL}/auth/signup`, userData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data.message || 'Signup failed. Please try again.',
      );
    } else {
      throw new Error('Network error. Please check your connection.');
    }
  }
};

export const signinUser = async (userData: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${HTTP_URL}/auth/signin`, userData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data.message ||
          'Sign-in failed. Please check your credentials.',
      );
    } else {
      throw new Error('Network error. Please check your connection.');
    }
  }
};
