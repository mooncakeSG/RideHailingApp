import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface RideProgress {
  rideId: string;
  status: 'accepted' | 'en_route' | 'arrived' | 'trip_started' | 'completed';
  timestamp: number;
  location?: Location;
}

interface LocationState {
  currentLocation: Location | null;
  isTracking: boolean;
  rideProgress: RideProgress | null;
  error: string | null;
}

const initialState: LocationState = {
  currentLocation: null,
  isTracking: false,
  rideProgress: null,
  error: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action: PayloadAction<Location>) => {
      state.currentLocation = action.payload;
    },
    setTrackingStatus: (state, action: PayloadAction<boolean>) => {
      state.isTracking = action.payload;
    },
    updateRideProgress: (state, action: PayloadAction<RideProgress>) => {
      state.rideProgress = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentLocation,
  setTrackingStatus,
  updateRideProgress,
  setError,
} = locationSlice.actions;

export default locationSlice.reducer; 