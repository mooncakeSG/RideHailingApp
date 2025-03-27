import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface RideRequest {
  id: string;
  pickup: Location;
  dropoff: Location;
  fare: number;
  distance: number;
  isHazardZone: boolean;
  status: 'pending' | 'accepted' | 'completed';
  estimatedTime: string;
  createdAt: string;
}

interface DriverState {
  isApproved: boolean;
  earnings: number;
  completedTrips: number;
  currentRide: RideRequest | null;
  rideRequests: RideRequest[];
  documents: {
    idCard: string | null;
    driversLicense: string | null;
    profilePhoto: string | null;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: DriverState = {
  isApproved: false,
  earnings: 0,
  completedTrips: 0,
  currentRide: null,
  rideRequests: [],
  documents: {
    idCard: null,
    driversLicense: null,
    profilePhoto: null,
  },
  isLoading: false,
  error: null,
};

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    setApprovalStatus: (state, action: PayloadAction<boolean>) => {
      state.isApproved = action.payload;
    },
    updateEarnings: (state, action: PayloadAction<number>) => {
      state.earnings += action.payload;
    },
    incrementCompletedTrips: (state) => {
      state.completedTrips += 1;
    },
    setCurrentRide: (state, action: PayloadAction<RideRequest | null>) => {
      state.currentRide = action.payload;
    },
    setRideRequests: (state, action: PayloadAction<RideRequest[]>) => {
      state.rideRequests = action.payload;
    },
    addRideRequest: (state, action: PayloadAction<RideRequest>) => {
      state.rideRequests.push(action.payload);
    },
    updateRideStatus: (
      state,
      action: PayloadAction<{ rideId: string; status: RideRequest['status'] }>
    ) => {
      const { rideId, status } = action.payload;
      const ride = state.rideRequests.find((r) => r.id === rideId);
      if (ride) {
        ride.status = status;
      }
      if (state.currentRide?.id === rideId) {
        state.currentRide.status = status;
      }
    },
    setDocuments: (
      state,
      action: PayloadAction<{
        idCard?: string;
        driversLicense?: string;
        profilePhoto?: string;
      }>
    ) => {
      state.documents = { ...state.documents, ...action.payload };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setApprovalStatus,
  updateEarnings,
  incrementCompletedTrips,
  setCurrentRide,
  setRideRequests,
  addRideRequest,
  updateRideStatus,
  setDocuments,
  setLoading,
  setError,
} = driverSlice.actions;

// Async thunks
export const checkDriverApproval = (driverId: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    // Replace with your actual API call
    const response = await fetch(`YOUR_API_URL/check-approval/${driverId}`);
    const data = await response.json();
    dispatch(setApprovalStatus(data.isApproved));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const acceptRide = (rideId: string, driverId: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    // Replace with your actual API call
    const response = await fetch('YOUR_API_URL/accept-ride', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rideId, driverId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to accept ride');
    }

    dispatch(updateRideStatus({ rideId, status: 'accepted' }));
    dispatch(setCurrentRide(data.ride));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const completeRide = (rideId: string, fare: number) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    // Replace with your actual API call
    const response = await fetch('YOUR_API_URL/complete-ride', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rideId, fare }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to complete ride');
    }

    dispatch(updateRideStatus({ rideId, status: 'completed' }));
    dispatch(updateEarnings(fare));
    dispatch(incrementCompletedTrips());
    dispatch(setCurrentRide(null));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const uploadDocument = (
  documentType: 'idCard' | 'driversLicense' | 'profilePhoto',
  file: string
) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    // Replace with your actual API call
    const response = await fetch('YOUR_API_URL/upload-document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ documentType, file }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload document');
    }

    dispatch(setDocuments({ [documentType]: data.url }));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export default driverSlice.reducer; 