import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PassengerScreen() {
  const [showHistory, setShowHistory] = useState(false);

  const rideOptions = [
    {
      id: 'economy',
      name: 'Economy',
      price: 50,
      eta: '5 min',
    },
    {
      id: 'comfort',
      name: 'Comfort',
      price: 75,
      eta: '7 min',
    }
  ];

  const rideHistoryData = [
    {
      id: '1',
      time: 'Today, 12:30 Pm',
      passenger: 'Sarah Johnson',
      pickup: '123 Main Street',
      dropoff: 'Downtown Mall',
      fare: '24.50',
      duration: '5 min',
    }
  ];

  const handleBookRide = (rideType: string) => {
    console.log(`Booking ${rideType} ride`);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Enhanced Header with Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 pt-16 pb-8"
      >
        <View className="items-center">
          <Text className="text-4xl font-black text-white text-center tracking-wide">
            Book a Ride
          </Text>
          <View className="w-16 h-1 bg-white/30 rounded-full mt-3" />
          <Text className="text-white/80 text-center mt-2 text-lg">
            Your journey starts here
          </Text>
        </View>
      </LinearGradient>

      {/* Enhanced Ride Options */}
      <View className="px-6 py-6">
        {rideOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleBookRide(option.id)}
            className="bg-white rounded-2xl p-6 mb-4 shadow-lg border border-gray-100"
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 8,
            }}
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-1" style={{
                  textShadowColor: 'rgba(0, 0, 0, 0.1)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}>
                  {option.name}
                </Text>
                <Text className="text-lg text-gray-600 font-medium">
                  {option.eta}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-3xl font-black text-blue-600" style={{
                  textShadowColor: 'rgba(59, 130, 246, 0.3)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 3,
                }}>
                  ${option.price}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Enhanced Ride History */}
      <View className="px-6">
        <TouchableOpacity
          onPress={() => setShowHistory(!showHistory)}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 8,
          }}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900" style={{
                textShadowColor: 'rgba(0, 0, 0, 0.1)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}>
                Ride History
              </Text>
              <View className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2" />
            </View>
            <View className="bg-blue-100 p-3 rounded-full">
              <FontAwesome 
                name={showHistory ? 'chevron-up' : 'chevron-right'} 
                size={18} 
                color="#3B82F6" 
              />
            </View>
          </View>

          {showHistory && (
            <View className="mt-6 pt-6 border-t border-gray-100">
              {rideHistoryData.map((ride) => (
                <View key={ride.id} className="mb-4">
                  <Text className="text-lg font-semibold text-purple-600 mb-2" style={{
                    textShadowColor: 'rgba(147, 51, 234, 0.3)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }}>
                    {ride.time}
                  </Text>
                  <Text className="text-xl font-bold text-gray-900 mb-1" style={{
                    textShadowColor: 'rgba(0, 0, 0, 0.1)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }}>
                    {ride.passenger}
                  </Text>
                  <Text className="text-base text-gray-600 mb-1 font-medium">
                    📍 {ride.pickup}
                  </Text>
                  <Text className="text-base text-gray-600 mb-3 font-medium">
                    🏁 {ride.dropoff}
                  </Text>
                  
                  <View className="flex-row justify-between items-center">
                    <Text className="text-2xl font-black text-green-600" style={{
                      textShadowColor: 'rgba(34, 197, 94, 0.3)',
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 3,
                    }}>
                      ${ride.fare}
                    </Text>
                    <Text className="text-base text-gray-600 font-semibold">
                      ⏱️ {ride.duration}
                    </Text>
                  </View>

                  {/* Enhanced Mini Map Placeholder */}
                  <LinearGradient
                    colors={['#dbeafe', '#bfdbfe']}
                    className="mt-4 h-28 rounded-xl items-center justify-center"
                  >
                    <View className="flex-row items-center">
                      <FontAwesome name="map-marker" size={18} color="#3B82F6" />
                      <View className="w-16 h-1 bg-blue-400 rounded-full mx-3" />
                      <FontAwesome name="map-marker" size={18} color="#EF4444" />
                    </View>
                    <Text className="text-blue-700 text-sm mt-3 font-semibold" style={{
                      textShadowColor: 'rgba(29, 78, 216, 0.3)',
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}>
                      🗺️ Route Visualization
                    </Text>
                  </LinearGradient>
                </View>
              ))}
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View className="h-6" />
    </ScrollView>
  );
} 