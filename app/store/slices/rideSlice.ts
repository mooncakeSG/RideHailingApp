import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface CarType {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface RideState {
  pickup: Location | null;
  dropoff: Location | null;
  status: 'idle' | 'searching' | 'accepted' | 'in-progress' | 'completed';
  currentRideId: string | null;
  estimatedPrice: number | null;
  selectedCarType: CarType | null;
  driverLocation: Location | null;
  isLoading: boolean;
  error: string | null;
}

const carTypes: CarType[] = [
  {
    id: '1',
    name: 'Standard',
    price: 50,
    image: 'https://example.com/standard-car.jpg',
    description: 'Comfortable and reliable',
  },
  {
    id: '2',
    name: 'Luxury',
    price: 100,
    image: 'https://example.com/luxury-car.jpg',
    description: 'Premium comfort and style',
  },
  {
    id: '3',
    name: 'Stance',
    price: 150,
    image: 'https://example.com/stance-car.jpg',
    description: 'Sporty and stylish',
  },
];

const initialState: RideState = {
  pickup: null,
  dropoff: null,
  status: 'idle',
  currentRideId: null,
  estimatedPrice: null,
  selectedCarType: null,
  driverLocation: null,
  isLoading: false,
  error: null,
};

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setPickup: (state, action: PayloadAction<Location>) => {
      state.pickup = action.payload;
      state.error = null;
    },
    setDropoff: (state, action: PayloadAction<Location>) => {
      state.dropoff = action.payload;
      state.error = null;
    },
    setRideStatus: (state, action: PayloadAction<RideState['status']>) => {
      state.status = action.payload;
    },
    setCurrentRideId: (state, action: PayloadAction<string | null>) => {
      state.currentRideId = action.payload;
    },
    setEstimatedPrice: (state, action: PayloadAction<number | null>) => {
      state.estimatedPrice = action.payload;
    },
    setSelectedCarType: (state, action: PayloadAction<CarType | null>) => {
      state.selectedCarType = action.payload;
      state.error = null;
    },
    setDriverLocation: (state, action: PayloadAction<Location | null>) => {
      state.driverLocation = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearRide: (state) => {
      return initialState;
    },
  },
});

export const {
  setPickup,
  setDropoff,
  setRideStatus,
  setCurrentRideId,
  setEstimatedPrice,
  setSelectedCarType,
  setDriverLocation,
  setLoading,
  setError,
  clearRide,
} = rideSlice.actions;

// Async thunks
export const requestRide = () => async (dispatch: any, getState: any) => {
  const { pickup, dropoff, selectedCarType } = getState().ride;

  if (!pickup || !dropoff || !selectedCarType) {
    dispatch(setError('Please select pickup, dropoff, and car type'));
    return;
  }

  try {
    dispatch(setLoading(true));
    // Replace with your actual API call
    const response = await fetch('YOUR_API_URL/request-ride', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pickup,
        dropoff,
        carType: selectedCarType.id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to request ride');
    }

    dispatch(setCurrentRideId(data.rideId));
    dispatch(setRideStatus('searching'));
  } catch (error: any) {
    dispatch(setError(error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateDriverLocation = (location: Location) => async (dispatch: any) => {
  dispatch(setDriverLocation(location));
};

export default rideSlice.reducer; 