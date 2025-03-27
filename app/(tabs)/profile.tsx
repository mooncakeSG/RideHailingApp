import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { styled } from 'nativewind';
import { Button } from '../../components/ui/Button';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const StyledView = styled(View);
const StyledText = styled(Text);

const rideHistory = [
  {
    id: '1',
    date: '2024-03-27',
    pickup: '123 Main St',
    dropoff: '456 Park Ave',
    price: 75,
    status: 'completed',
  },
  {
    id: '2',
    date: '2024-03-26',
    pickup: '789 Market St',
    dropoff: '321 Beach Rd',
    price: 100,
    status: 'completed',
  },
];

export default function ProfileScreen() {
  const user = useSelector((state: RootState) => state.user);

  return (
    <ScrollView className="flex-1 bg-background">
      <StyledView className="p-4">
        {/* Profile Header */}
        <StyledView className="items-center mb-6">
          <StyledView className="w-24 h-24 rounded-full bg-gray-200 mb-4">
            <Image
              source={{ uri: 'https://example.com/profile.jpg' }}
              className="w-full h-full rounded-full"
            />
          </StyledView>
          <StyledText className="text-xl font-bold text-gray-900">
            {user.name || 'Guest User'}
          </StyledText>
          <StyledText className="text-gray-500">{user.email}</StyledText>
        </StyledView>

        {/* Discounts Section */}
        <StyledView className="mb-6">
          <StyledText className="text-lg font-semibold text-gray-900 mb-2">
            Available Discounts
          </StyledText>
          <StyledView className="bg-primary/10 p-4 rounded-lg">
            <StyledText className="text-primary font-semibold">
              Pensioner Discount
            </StyledText>
            <StyledText className="text-gray-600 mt-1">
              15% off all rides
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Ride History */}
        <StyledView>
          <StyledText className="text-lg font-semibold text-gray-900 mb-2">
            Ride History
          </StyledText>
          {rideHistory.map((ride) => (
            <StyledView
              key={ride.id}
              className="bg-white p-4 rounded-lg mb-2 border border-gray-200"
            >
              <StyledView className="flex-row justify-between mb-2">
                <StyledText className="text-gray-500">{ride.date}</StyledText>
                <StyledText className="font-semibold">R {ride.price}</StyledText>
              </StyledView>
              <StyledView className="flex-row justify-between">
                <StyledText className="text-gray-900">{ride.pickup}</StyledText>
                <StyledText className="text-gray-900">{ride.dropoff}</StyledText>
              </StyledView>
            </StyledView>
          ))}
        </StyledView>

        {/* Settings Button */}
        <Button
          title="Settings"
          variant="outline"
          onPress={() => {}}
          className="mt-6"
        />
      </StyledView>
    </ScrollView>
  );
} 