import axios from 'axios';
import { HTTP_URL } from '@/config';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Unauthorized: No auth token found.');

  return { Authorization: token };
};

// Create Room
export const createRoom = async (name: string) => {
  try {
    const response = await axios.post(
      `${HTTP_URL}/room/create-room`,
      { roomName: name },
      { headers: getAuthHeaders() },
    );

    await new Promise(resolve => setTimeout(resolve, 3000));
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Room creation failed.');
    }
    throw new Error('Unexpected error occurred while creating the room.');
  }
};

// Join Room
export const joinRoom = async (roomId: string) => {
  try {
    const response = await axios.post(
      `${HTTP_URL}/room/join`,
      { roomId },
      { headers: getAuthHeaders() },
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to join room.');
    }
    throw new Error('Unexpected error occurred while joining the room.');
  }
};

// Delete Room
export const deleteRoom = async (roomId: string) => {
  try {
    const response = await axios.delete(`${HTTP_URL}/room/delete/${roomId}`, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to delete room.');
    }
    throw new Error('Unexpected error occurred while deleting the room.');
  }
};

// Get Rooms
export const getRooms = async () => {
  try {
    const response = await axios.get(`${HTTP_URL}/room/rooms`, {
      headers: getAuthHeaders(),
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    return response.data;
  } catch (error: unknown) {
    // console.error('Error fetching rooms:', error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.warn('Unauthorized! Redirecting to login...');
      }
      throw new Error(error.response?.data?.error || 'Failed to fetch rooms.');
    }

    throw new Error('Unexpected error occurred while fetching rooms.');
  }
};
