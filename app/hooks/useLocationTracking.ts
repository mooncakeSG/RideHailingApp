import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import { io, Socket } from 'socket.io-client';
import {
  setCurrentLocation,
  setTrackingStatus,
  updateRideProgress,
  setError,
} from '../store/slices/locationSlice';

const SOCKET_URL = 'YOUR_BACKEND_URL'; // Replace with your WebSocket server URL

export const useLocationTracking = (driverId: string) => {
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    socketRef.current = io(SOCKET_URL, {
      query: { driverId },
      transports: ['websocket'],
    });

    // Request location permission
    Geolocation.requestAuthorization('whenInUse');

    // Set up location tracking
    watchIdRef.current = Geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now(),
        };

        // Update Redux store
        dispatch(setCurrentLocation(location));

        // Emit location update through WebSocket
        socketRef.current?.emit('driverLocation', {
          driverId,
          location,
        });
      },
      (error) => {
        dispatch(setError(error.message));
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // Update every 10 meters
        interval: 5000, // Update every 5 seconds
        fastestInterval: 3000,
      }
    );

    // Set up WebSocket event listeners
    socketRef.current.on('rideProgressUpdate', (progress) => {
      dispatch(updateRideProgress(progress));
    });

    // Cleanup function
    return () => {
      if (watchIdRef.current) {
        Geolocation.clearWatch(watchIdRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [driverId, dispatch]);

  // Function to update ride progress
  const updateProgress = (rideId: string, status: string) => {
    if (socketRef.current) {
      socketRef.current.emit('updateRideProgress', {
        driverId,
        rideId,
        status,
        timestamp: Date.now(),
      });
    }
  };

  return { updateProgress };
}; 