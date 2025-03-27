import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  checkDriverApproval,
  acceptRide,
  completeRide,
  setError,
} from '../store/slices/driverSlice';
import { Button } from '../../components/ui/Button';
import { FontAwesome } from '@expo/vector-icons';
import { useRideContext } from '../../components/RideProvider';
import RideStatusComponent from '../../components/RideStatusComponent';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function DriverScreen() {
  const dispatch = useDispatch();
  const {
    isApproved,
    earnings,
    completedTrips,
    currentRide,
    rideRequests,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.driver);
  const { rides, loading, error: rideContextError } = useRideContext();

  useEffect(() => {
    dispatch(checkDriverApproval('driver123'));
  }, []);

  const handleAcceptRide = async (rideId: string) => {
    // Replace with actual driver ID
    await dispatch(acceptRide(rideId, 'driver123'));
  };

  const handleCompleteRide = async (rideId: string, fare: number) => {
    await dispatch(completeRide(rideId, fare));
  };

  if (!isApproved) {
    return (
      <ScrollView className="flex-1 bg-background">
        <StyledView className="p-4">
          <StyledView className="bg-warning/10 p-4 rounded-lg mb-4">
            <StyledText className="text-warning font-semibold">
              Pending Approval
            </StyledText>
            <StyledText className="text-gray-600 mt-2">
              Your account is pending approval. Please upload your documents to
              start accepting rides.
            </StyledText>
          </StyledView>

          <StyledView className="space-y-4">
            <StyledView>
              <StyledText className="text-sm font-medium text-gray-700 mb-2">
                Required Documents
              </StyledText>
              <StyledView className="space-y-2">
                <Button
                  title="Upload ID Card"
                  variant="outline"
                  onPress={() => {}}
                />
                <Button
                  title="Upload Driver's License"
                  variant="outline"
                  onPress={() => {}}
                />
                <Button
                  title="Upload Profile Photo"
                  variant="outline"
                  onPress={() => {}}
                />
              </StyledView>
            </StyledView>
          </StyledView>
        </StyledView>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Driver Dashboard</Text>
        <Text style={styles.subtitle}>
          {rides.length} Available {rides.length === 1 ? 'Ride' : 'Rides'}
        </Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <FontAwesome name="money" size={24} color="#4CAF50" />
          <Text style={styles.statValue}>${earnings.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>
        <View style={styles.statCard}>
          <FontAwesome name="check-circle" size={24} color="#2196F3" />
          <Text style={styles.statValue}>{completedTrips}</Text>
          <Text style={styles.statLabel}>Completed Trips</Text>
        </View>
        <View style={styles.statCard}>
          <FontAwesome name="star" size={24} color="#FFC107" />
          <Text style={styles.statValue}>4.8</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      {/* Current Ride Section */}
      {currentRide && (
        <View style={styles.currentRideSection}>
          <Text style={styles.sectionTitle}>Current Ride</Text>
          <RideStatusComponent isDriver={true} />
        </View>
      )}

      {/* Available Rides Section */}
      <View style={styles.availableRidesSection}>
        <Text style={styles.sectionTitle}>Available Rides</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
        ) : rideContextError ? (
          <Text style={styles.error}>{rideContextError}</Text>
        ) : (
          <View style={styles.content}>
            <RideStatusComponent isDriver={true} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  currentRideSection: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginBottom: 20,
  },
  availableRidesSection: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  content: {
    flex: 1,
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: '#f44336',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
}); 