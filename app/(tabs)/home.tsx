import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Button } from '../../components/ui/Button';
import { RideCard } from '../../components/RideCard';

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
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900">
            Book a Ride
          </Text>
          <Text className="text-gray-600 mt-1 text-base">
            Choose your preferred ride type
          </Text>
        </View>

        {/* Promotions */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Special Offers
          </Text>
          <View className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <Text className="text-blue-800 font-semibold">
              20% off your first ride!
            </Text>
            <Text className="text-blue-600 mt-1">
              Use code: FIRST20
            </Text>
          </View>
        </View>

        {/* Ride Options */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-3">
            Available Rides
          </Text>
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
        </View>

        {/* Book Button */}
        <Button
          title="Book Now"
          onPress={() => {}}
          disabled={!selectedRide}
          className="mt-4"
        />
      </View>
    </ScrollView>
  );
} 