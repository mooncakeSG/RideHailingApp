import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'passenger' | 'driver' | 'admin';
  token: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;

// Async thunks
export const loginUser = (email: string, password: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    // Replace with your actual API call
    const response = await fetch('YOUR_API_URL/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    await AsyncStorage.setItem('userToken', data.token);
    dispatch(setUser(data.user));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const registerUser = (userData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'passenger' | 'driver';
}) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    // Replace with your actual API call
    const response = await fetch('YOUR_API_URL/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    await AsyncStorage.setItem('userToken', data.token);
    dispatch(setUser(data.user));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const logoutUser = () => async (dispatch: any) => {
  try {
    await AsyncStorage.removeItem('userToken');
    dispatch(logout());
  } catch (error: any) {
    dispatch(setError(error.message));
  }
};

export default authSlice.reducer; 