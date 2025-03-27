import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import rideReducer from './slices/rideSlice';
import authReducer from './slices/authSlice';
import driverReducer from './slices/driverSlice';
import locationReducer from './slices/locationSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    ride: rideReducer,
    auth: authReducer,
    driver: driverReducer,
    location: locationReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 