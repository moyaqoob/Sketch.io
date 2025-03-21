import axios from 'axios';
import { HTTP_URL } from '@/config';

interface SignupData {
  name: string;
  email: string;
  password: string;
}

export const signupUser = async ({ name, email, password }: SignupData) => {
  try {
    const response = await axios.post(`${HTTP_URL}/auth/signup`, {
      name,
      email,
      password,
    });

    return response.data;
  } catch {
    console.log('Internal server errr');
  }
};

interface SigninData {
  email: string;
  password: string;
}

export const signinUser = async ({ email, password }: SigninData) => {
  try {
    const response = await axios.post(`${HTTP_URL}/auth/signin`, {
      email,
      password,
    });

    return response.data;
  } catch {
    console.log('Internal server errr');
  }
};
