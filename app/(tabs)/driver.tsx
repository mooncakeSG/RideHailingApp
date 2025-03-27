import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
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

  useEffect(() => {
    // Replace with actual driver ID
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
    <ScrollView className="flex-1 bg-background">
      <StyledView className="p-4">
        {/* Stats Section */}
        <StyledView className="flex-row justify-between mb-6">
          <StyledView className="bg-primary/10 p-4 rounded-lg flex-1 mr-2">
            <StyledText className="text-primary font-semibold">
              Total Earnings
            </StyledText>
            <StyledText className="text-2xl font-bold mt-1">
              R {earnings.toFixed(2)}
            </StyledText>
          </StyledView>
          <StyledView className="bg-success/10 p-4 rounded-lg flex-1 ml-2">
            <StyledText className="text-success font-semibold">
              Completed Trips
            </StyledText>
            <StyledText className="text-2xl font-bold mt-1">
              {completedTrips}
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Current Ride */}
        {currentRide && (
          <StyledView className="mb-6">
            <StyledText className="text-lg font-semibold text-gray-900 mb-2">
              Current Ride
            </StyledText>
            <StyledView className="bg-white p-4 rounded-lg border border-gray-200">
              <StyledView className="flex-row justify-between mb-2">
                <StyledText className="font-medium">Status</StyledText>
                <StyledText className="text-primary font-semibold">
                  {currentRide.status}
                </StyledText>
              </StyledView>
              <StyledView className="flex-row justify-between mb-2">
                <StyledText className="font-medium">Fare</StyledText>
                <StyledText>R {currentRide.fare.toFixed(2)}</StyledText>
              </StyledView>
              <StyledView className="flex-row justify-between mb-2">
                <StyledText className="font-medium">Distance</StyledText>
                <StyledText>{currentRide.distance} km</StyledText>
              </StyledView>
              <StyledView className="flex-row justify-between">
                <StyledText className="font-medium">ETA</StyledText>
                <StyledText>{currentRide.estimatedTime}</StyledText>
              </StyledView>
              {currentRide.status === 'accepted' && (
                <Button
                  title="Complete Ride"
                  onPress={() => handleCompleteRide(currentRide.id, currentRide.fare)}
                  className="mt-4"
                />
              )}
            </StyledView>
          </StyledView>
        )}

        {/* Ride Requests */}
        <StyledView>
          <StyledText className="text-lg font-semibold text-gray-900 mb-2">
            Available Rides
          </StyledText>
          {rideRequests.map((ride) => (
            <StyledView
              key={ride.id}
              className="bg-white p-4 rounded-lg border border-gray-200 mb-2"
            >
              <StyledView className="flex-row justify-between mb-2">
                <StyledText className="font-medium">Fare</StyledText>
                <StyledText>R {ride.fare.toFixed(2)}</StyledText>
              </StyledView>
              <StyledView className="flex-row justify-between mb-2">
                <StyledText className="font-medium">Distance</StyledText>
                <StyledText>{ride.distance} km</StyledText>
              </StyledView>
              <StyledView className="flex-row justify-between mb-2">
                <StyledText className="font-medium">ETA</StyledText>
                <StyledText>{ride.estimatedTime}</StyledText>
              </StyledView>
              {ride.isHazardZone && (
                <StyledView className="flex-row items-center mb-2">
                  <FontAwesome name="warning" size={16} color="#FF9500" />
                  <StyledText className="text-warning ml-2">
                    Hazard Zone - Additional R10 charge
                  </StyledText>
                </StyledView>
              )}
              <Button
                title="Accept Ride"
                onPress={() => handleAcceptRide(ride.id)}
                disabled={isLoading || !!currentRide}
                className="mt-2"
              />
            </StyledView>
          ))}
        </StyledView>

        {error && (
          <StyledText className="text-danger text-sm mt-4">{error}</StyledText>
        )}
      </StyledView>
    </ScrollView>
  );
} 