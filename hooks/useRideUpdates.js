import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { socketService } from '../services/socket';
import { fetchAvailableRides, acceptRide, updateRideStatus } from '../services/api';

export const useRideUpdates = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Connect to WebSocket
    socketService.connect();

    // Fetch initial rides
    const loadRides = async () => {
      try {
        setLoading(true);
        const availableRides = await fetchAvailableRides();
        setRides(availableRides);
      } catch (err) {
        setError(err.message);
        Alert.alert('Error', 'Failed to fetch available rides');
      } finally {
        setLoading(false);
      }
    };

    loadRides();

    // Set up WebSocket listeners
    const handleRideRequest = (rideData) => {
      setRides(prevRides => [...prevRides, rideData]);
      Alert.alert('New Ride Request', 'A new ride request is available!');
    };

    const handleRideStatusUpdate = (statusData) => {
      setRides(prevRides =>
        prevRides.map(ride =>
          ride.id === statusData.rideId
            ? { ...ride, status: statusData.status }
            : ride
        )
      );
    };

    socketService.addEventListener('ride-request', handleRideRequest);
    socketService.addEventListener('ride-status-update', handleRideStatusUpdate);

    // Cleanup
    return () => {
      socketService.removeEventListener('ride-request', handleRideRequest);
      socketService.removeEventListener('ride-status-update', handleRideStatusUpdate);
    };
  }, []);

  const handleAcceptRide = async (rideId) => {
    try {
      await acceptRide(rideId);
      setRides(prevRides =>
        prevRides.map(ride =>
          ride.id === rideId
            ? { ...ride, status: 'accepted' }
            : ride
        )
      );
      Alert.alert('Success', 'Ride accepted successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to accept ride');
    }
  };

  const handleUpdateRideStatus = async (rideId, newStatus) => {
    try {
      await updateRideStatus(rideId, newStatus);
      setRides(prevRides =>
        prevRides.map(ride =>
          ride.id === rideId
            ? { ...ride, status: newStatus }
            : ride
        )
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to update ride status');
    }
  };

  return {
    rides,
    loading,
    error,
    acceptRide: handleAcceptRide,
    updateRideStatus: handleUpdateRideStatus,
  };
}; 