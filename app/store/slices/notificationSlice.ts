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

interface Notification {
  id: string;
  title: string;
  body: string;
  data?: {
    rideId?: string;
    type?: 'ride_request' | 'ride_status' | 'payment' | 'system';
    pickupLocation?: string;
    dropoffLocation?: string;
    fare?: number;
    distance?: number;
    eta?: string;
  };
  timestamp: number;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
  fcmToken: string | null;
  isPermissionGranted: boolean;
  error: string | null;
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  fcmToken: null,
  isPermissionGranted: false,
  error: null,
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
      state.unreadCount = 0;
    },
    setFcmToken: (state, action: PayloadAction<string>) => {
      state.fcmToken = action.payload;
    },
    setPermissionStatus: (state, action: PayloadAction<boolean>) => {
      state.isPermissionGranted = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  setFcmToken,
  setPermissionStatus,
  setError,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer; 