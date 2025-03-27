import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { socketService } from '../services/socket';
import { fetchAvailableRides, acceptRide, updateRideStatus } from '../services/api';

interface Ride {
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

interface Notification {
  id: string;
  message: string;
  type: 'ride-request' | 'status-update' | 'error';
  timestamp: string;
}

interface RideContextType {
  rides: Ride[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  fetchRides: () => Promise<void>;
  acceptRide: (rideId: string) => Promise<void>;
  updateRideStatus: (rideId: string, status: string) => Promise<void>;
}

export const RideContext = createContext<RideContextType | undefined>(undefined);

export const RideProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const addNotification = (message: string, type: Notification['type']) => {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [...prev, notification]);
    // Remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const fetchRides = async () => {
    try {
      setLoading(true);
      const availableRides = await fetchAvailableRides();
      setRides(availableRides);
    } catch (err) {
      setError('Failed to fetch rides');
      addNotification('Failed to fetch available rides', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRide = async (rideId: string) => {
    try {
      await acceptRide(rideId);
      setRides(prevRides =>
        prevRides.map(ride =>
          ride.id === rideId
            ? { ...ride, status: 'accepted' }
            : ride
        )
      );
      addNotification(`Ride ${rideId} accepted successfully`, 'status-update');
    } catch (err) {
      addNotification('Failed to accept ride', 'error');
    }
  };

  const handleUpdateRideStatus = async (rideId: string, status: string) => {
    try {
      await updateRideStatus(rideId, status);
      setRides(prevRides =>
        prevRides.map(ride =>
          ride.id === rideId
            ? { ...ride, status }
            : ride
        )
      );
      addNotification(`Ride ${rideId} status updated to ${status}`, 'status-update');
    } catch (err) {
      addNotification('Failed to update ride status', 'error');
    }
  };

  useEffect(() => {
    // Connect to WebSocket
    socketService.connect();

    // Fetch initial rides
    fetchRides();

    // Set up WebSocket listeners
    const handleRideRequest = (rideData: Ride) => {
      setRides(prevRides => [...prevRides, rideData]);
      addNotification(`New ride request: ${rideData.id}`, 'ride-request');
    };

    const handleRideStatusUpdate = (data: { id: string; status: string }) => {
      setRides(prevRides =>
        prevRides.map(ride =>
          ride.id === data.id
            ? { ...ride, status: data.status }
            : ride
        )
      );
      addNotification(`Ride ${data.id} status updated to: ${data.status}`, 'status-update');
    };

    socketService.addEventListener('new-ride-request', handleRideRequest);
    socketService.addEventListener('ride-status-update', handleRideStatusUpdate);

    // Cleanup
    return () => {
      socketService.removeEventListener('new-ride-request', handleRideRequest);
      socketService.removeEventListener('ride-status-update', handleRideStatusUpdate);
    };
  }, []);

  return (
    <RideContext.Provider
      value={{
        rides,
        notifications,
        loading,
        error,
        fetchRides,
        acceptRide: handleAcceptRide,
        updateRideStatus: handleUpdateRideStatus,
      }}
    >
      {children}
    </RideContext.Provider>
  );
};

export const useRideContext = () => {
  const context = useContext(RideContext);
  if (context === undefined) {
    throw new Error('useRideContext must be used within a RideProvider');
  }
  return context;
}; 