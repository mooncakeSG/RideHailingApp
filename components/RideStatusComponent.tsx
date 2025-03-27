import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useRideContext } from './RideProvider';
import { FontAwesome } from '@expo/vector-icons';

export const RideStatusComponent = ({ isDriver = false }) => {
  const { rides, notifications, loading, error, acceptRide, updateRideStatus } = useRideContext();
  const [currentRide, setCurrentRide] = useState<any | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (rides.length > 0) {
      setCurrentRide(rides[0]);
    }
  }, [rides]);

  const handleAcceptRide = async () => {
    if (currentRide) {
      try {
        await acceptRide(currentRide.id);
      } catch (err) {
        console.error('Error accepting ride:', err);
        Alert.alert('Error', 'Failed to accept ride. Please try again.');
      }
    }
  };

  const handleStartRide = async () => {
    if (currentRide) {
      try {
        await updateRideStatus(currentRide.id, 'in_progress');
      } catch (err) {
        console.error('Error starting ride:', err);
        Alert.alert('Error', 'Failed to start ride. Please try again.');
      }
    }
  };

  const handleCompleteRide = async () => {
    if (currentRide) {
      try {
        await updateRideStatus(currentRide.id, 'completed');
      } catch (err) {
        console.error('Error completing ride:', err);
        Alert.alert('Error', 'Failed to complete ride. Please try again.');
      }
    }
  };

  const handleCancelRide = async () => {
    if (currentRide) {
      try {
        await updateRideStatus(currentRide.id, 'cancelled');
        setCurrentRide(null);
      } catch (err) {
        console.error('Error cancelling ride:', err);
        Alert.alert('Error', 'Failed to cancel ride. Please try again.');
      }
    }
  };

  const confirmCancelRide = () => {
    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: handleCancelRide,
          style: 'destructive',
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#4CAF50';
      case 'requested':
        return '#FFA000';
      case 'accepted':
        return '#2196F3';
      case 'in_progress':
        return '#9C27B0';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return 'car';
      case 'requested':
        return 'clock-o';
      case 'accepted':
        return 'check-circle';
      case 'in_progress':
        return 'road';
      case 'completed':
        return 'flag-checkered';
      case 'cancelled':
        return 'times-circle';
      default:
        return 'question-circle';
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" testID="loading-indicator" />
      ) : error ? (
        <Text style={styles.error} testID="error-message">{error}</Text>
      ) : currentRide ? (
        <View style={styles.rideCard}>
          <View style={styles.rideHeader}>
            <View style={styles.rideInfo}>
              <Text style={styles.rideId} testID="ride-title">Current Ride</Text>
              <Text style={styles.rideId}>Ride #{currentRide.id}</Text>
              <View style={styles.statusContainer}>
                <FontAwesome 
                  name={getStatusIcon(currentRide.status)} 
                  size={16} 
                  color={getStatusColor(currentRide.status)} 
                />
                <Text style={[styles.status, { color: getStatusColor(currentRide.status) }]} testID="ride-status">
                  {currentRide.status.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={confirmCancelRide}
              style={styles.cancelButton}
              testID="cancel-ride-button"
            >
              <FontAwesome name="times" size={20} color="#f44336" />
            </TouchableOpacity>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <FontAwesome name="map-marker" size={16} color="#666" />
              <Text style={styles.detailText} testID="pickup-address">
                {currentRide.pickup?.address || 'Pickup location not specified'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <FontAwesome name="flag-checkered" size={16} color="#666" />
              <Text style={styles.detailText} testID="dropoff-address">
                {currentRide.dropoff?.address || 'Dropoff location not specified'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <FontAwesome name="money" size={16} color="#666" />
              <Text style={styles.detailText} testID="ride-fare">Fare: ${currentRide.fare}</Text>
            </View>
            <View style={styles.detailRow}>
              <FontAwesome name="clock-o" size={16} color="#666" />
              <Text style={styles.detailText} testID="ride-eta">ETA: {currentRide.eta}</Text>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            {isDriver && (currentRide.status === 'available' || currentRide.status === 'pending') && (
              <TouchableOpacity
                style={[styles.button, styles.acceptButton]}
                onPress={handleAcceptRide}
                testID="accept-ride-button"
              >
                <Text style={styles.buttonText}>Accept Ride</Text>
              </TouchableOpacity>
            )}
            {isDriver && currentRide.status === 'accepted' && (
              <TouchableOpacity
                style={[styles.button, styles.startButton]}
                onPress={handleStartRide}
                testID="start-ride-button"
              >
                <Text style={styles.buttonText}>Start Ride</Text>
              </TouchableOpacity>
            )}
            {isDriver && currentRide.status === 'in_progress' && (
              <TouchableOpacity
                style={[styles.button, styles.completeButton]}
                onPress={handleCompleteRide}
                testID="complete-ride-button"
              >
                <Text style={styles.buttonText}>Complete Ride</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <Text style={styles.noRides} testID="no-ride-message">No available rides</Text>
      )}

      {/* Notifications Section */}
      {notifications.length > 0 && (
        <View style={styles.notifications}>
          <Text style={styles.notificationsTitle}>Recent Updates:</Text>
          {notifications.map((notif) => (
            <View 
              key={notif.id} 
              style={[
                styles.notification,
                { backgroundColor: getNotificationColor(notif.type) }
              ]}
            >
              <Text style={styles.notificationText}>{notif.message}</Text>
              <Text style={styles.notificationTime}>
                {new Date(notif.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'ride-request':
      return '#4CAF50';
    case 'status-update':
      return '#2196F3';
    case 'error':
      return '#f44336';
    default:
      return '#757575';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  rideCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rideInfo: {
    flex: 1,
  },
  rideId: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 5,
  },
  detailsContainer: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 15,
    gap: 10,
  },
  error: {
    color: '#f44336',
    fontSize: 16,
    textAlign: 'center',
  },
  noRides: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  notifications: {
    marginTop: 20,
  },
  notificationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notification: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  notificationText: {
    color: '#ffffff',
    fontSize: 14,
  },
  notificationTime: {
    color: '#ffffff',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 4,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  startButton: {
    backgroundColor: '#2196F3',
  },
  completeButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
}); 