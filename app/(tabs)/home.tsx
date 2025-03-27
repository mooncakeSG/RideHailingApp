import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { styled } from 'nativewind';
import { Button } from '../../components/ui/Button';
import { RideCard } from '../../components/RideCard';

const StyledView = styled(View);
const StyledText = styled(Text);

const rideOptions = [
  {
    id: '1',
    carType: 'Economy',
    price: 50,
    estimatedTime: '5 min',
    image: 'https://example.com/economy-car.jpg',
  },
  {
    id: '2',
    carType: 'Comfort',
    price: 75,
    estimatedTime: '7 min',
    image: 'https://example.com/comfort-car.jpg',
  },
  {
    id: '3',
    carType: 'Premium',
    price: 100,
    estimatedTime: '10 min',
    image: 'https://example.com/premium-car.jpg',
  },
];

export default function HomeScreen() {
  const [selectedRide, setSelectedRide] = React.useState<string | null>(null);

  return (
    <ScrollView className="flex-1 bg-background">
      <StyledView className="p-4">
        {/* Header */}
        <StyledView className="mb-6">
          <StyledText className="text-2xl font-bold text-gray-900">
            Book a Ride
          </StyledText>
          <StyledText className="text-gray-500 mt-1">
            Choose your preferred ride type
          </StyledText>
        </StyledView>

        {/* Promotions */}
        <StyledView className="mb-6">
          <StyledText className="text-lg font-semibold text-gray-900 mb-2">
            Special Offers
          </StyledText>
          <StyledView className="bg-primary/10 p-4 rounded-lg">
            <StyledText className="text-primary font-semibold">
              20% off your first ride!
            </StyledText>
            <StyledText className="text-gray-600 mt-1">
              Use code: FIRST20
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Ride Options */}
        <StyledView className="mb-6">
          <StyledText className="text-lg font-semibold text-gray-900 mb-2">
            Available Rides
          </StyledText>
          {rideOptions.map((ride) => (
            <RideCard
              key={ride.id}
              carType={ride.carType}
              price={ride.price}
              estimatedTime={ride.estimatedTime}
              image={ride.image}
              onSelect={() => setSelectedRide(ride.id)}
              isSelected={selectedRide === ride.id}
            />
          ))}
        </StyledView>

        {/* Book Button */}
        <Button
          title="Book Now"
          onPress={() => {}}
          disabled={!selectedRide}
          className="mt-4"
        />
      </StyledView>
    </ScrollView>
  );
} 