import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface Ride {
  id: string;
  status: string;
  driver: string;
  passenger: string;
  fare: string;
  eta: string;
  pickup: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  dropoff: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
}

export const fetchAvailableRides = async (): Promise<Ride[]> => {
  try {
    const response = await api.get('/rides/available');
    return response.data;
  } catch (error) {
    console.error('Error fetching rides:', error);
    return [];
  }
};

export const acceptRide = async (rideId: string): Promise<void> => {
  try {
    await api.post(`/rides/${rideId}/accept`);
  } catch (error) {
    console.error('Error accepting ride:', error);
    throw error;
  }
};

export const updateRideStatus = async (rideId: string, status: string): Promise<void> => {
  try {
    await api.put(`/rides/${rideId}/status`, { status });
  } catch (error) {
    console.error('Error updating ride status:', error);
    throw error;
  }
};

export const getRideDetails = async (rideId: string): Promise<Ride> => {
  try {
    const response = await api.get(`/rides/${rideId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ride details:', error);
    throw error;
  }
};

export default api; 