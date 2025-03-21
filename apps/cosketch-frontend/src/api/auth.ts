import axios from 'axios';
import { HTTP_URL } from '@/config';

interface AuthError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const signupUser = async (userData: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const response = await axios.post(`${HTTP_URL}/auth/signup`, userData);
    return response.data;
  } catch (error) {
    const err = error as AuthError;
    if (err.response) {
      throw new Error('Signup failed. Please try again.');
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
  } catch (error) {
    const err = error as AuthError;
    if (err.response) {
      throw new Error('Sign-in failed. Please check your credentials.');
    } else {
      throw new Error('Network error. Please check your connection.');
    }
  }
};

export const authorize = async (userData: { token: string }) => {
  try {
    const response = await axios.get(`${HTTP_URL}/auth/me`, {
      headers: {
        Authorization: userData.token,
      },
    });

    return response.data;
  } catch {
    throw new Error('Authorization failed');
  }
};
