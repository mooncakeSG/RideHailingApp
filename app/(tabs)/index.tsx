import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence,
  interpolate,
  runOnJS
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [userType, setUserType] = useState<'passenger' | 'driver'>('passenger');
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  
  // Simulate ongoing ride state
  const [ongoingRide, setOngoingRide] = useState({
    id: 'ride_123',
    driver: 'John Smith',
    vehicle: 'Toyota Camry - ABC 123',
    pickup: 'Downtown Mall',
    dropoff: 'Airport Terminal 1',
    status: 'en_route', // en_route, arrived, in_progress
    eta: '8 mins',
    fare: '32.50'
  });

  // Animation values
  const welcomeOpacity = useSharedValue(0);
  const welcomeTranslateY = useSharedValue(30);
  const pulseScale = useSharedValue(1);
  const rideStatusScale = useSharedValue(0.95);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 17) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  // Promo cards data
  const promoCards = [
    {
      id: '1',
      title: '🎉 50% Off First Ride',
      subtitle: 'Welcome bonus for new users',
      code: 'WELCOME50',
      gradient: ['#FF6B6B', '#FF8E53'],
      expiresIn: '2 days'
    },
    {
      id: '2',
      title: '💰 Refer & Earn $10',
      subtitle: 'Share with friends and family',
      code: 'REFER10',
      gradient: ['#4ECDC4', '#44A08D'],
      expiresIn: '7 days'
    },
    {
      id: '3',
      title: '⚡ Weekend Special',
      subtitle: '25% off on weekend rides',
      code: 'WEEKEND25',
      gradient: ['#A8EDEA', '#FED6E3'],
      expiresIn: '5 days'
    },
    {
      id: '4',
      title: '🚗 Premium Upgrade',
      subtitle: 'Free upgrade to premium rides',
      code: 'UPGRADE',
      gradient: ['#667eea', '#764ba2'],
      expiresIn: '3 days'
    }
  ];

  const quickActions = [
    {
      id: 'book-ride',
      title: 'Book Ride',
      subtitle: 'Quick & Easy',
      icon: 'car',
      onPress: () => router.push('/passenger'),
      gradient: ['#3B82F6', '#1D4ED8'],
      shadowColor: '#3B82F6'
    },
    {
      id: 'schedule',
      title: 'Schedule',
      subtitle: 'Plan Ahead',
      icon: 'clock-o',
      onPress: () => console.log('Schedule ride'),
      gradient: ['#8B5CF6', '#7C3AED'],
      shadowColor: '#8B5CF6'
    },
    {
      id: 'go-online',
      title: 'Go Online',
      subtitle: 'Start Earning',
      icon: 'power-off',
      onPress: () => router.push('/driver'),
      gradient: ['#10B981', '#059669'],
      shadowColor: '#10B981'
    },
    {
      id: 'safety',
      title: 'Safety',
      subtitle: 'Stay Secure',
      icon: 'shield',
      onPress: () => console.log('Safety features'),
      gradient: ['#EF4444', '#DC2626'],
      shadowColor: '#EF4444'
    }
  ];

  const recentRides = [
    {
      id: '1',
      pickup: 'Home • 123 Main St',
      dropoff: 'Office • Downtown Plaza',
      time: '8:30 AM',
      status: 'completed',
      fare: '24.50'
    },
    {
      id: '2',
      pickup: 'Gym • Fitness Center',
      dropoff: 'Mall • Shopping District',
      time: 'Yesterday',
      status: 'completed',
      fare: '18.75'
    }
  ];

  // Auto-scroll promo cards
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % promoCards.length;
        scrollRef.current?.scrollTo({
          x: nextIndex * (width - 48),
          animated: true
        });
        return nextIndex;
      });
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Welcome card animation
  useEffect(() => {
    welcomeOpacity.value = withTiming(1, { duration: 1000 });
    welcomeTranslateY.value = withTiming(0, { duration: 1000 });
    
    // Pulse animation for special elements
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  // Ride status animation
  useEffect(() => {
    if (ongoingRide) {
      rideStatusScale.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500 }),
          withTiming(0.98, { duration: 1500 })
        ),
        -1,
        true
      );
    }
  }, [ongoingRide]);

  // Animated styles
  const welcomeAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: welcomeOpacity.value,
      transform: [{ translateY: welcomeTranslateY.value }],
    };
  });

  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
    };
  });

  const rideStatusAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: rideStatusScale.value }],
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_route': return ['#3B82F6', '#1D4ED8'];
      case 'arrived': return ['#10B981', '#059669'];
      case 'in_progress': return ['#F59E0B', '#D97706'];
      default: return ['#6B7280', '#4B5563'];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'en_route': return '🚗 Driver En Route';
      case 'arrived': return '📍 Driver Arrived';
      case 'in_progress': return '🛣️ Trip in Progress';
      default: return '⏱️ Processing';
    }
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
        <Animated.View style={welcomeAnimatedStyle}>
          <Text className="text-2xl font-bold text-white/90">
            {getGreeting()}
          </Text>
          <Text className="text-4xl font-black text-white tracking-wide mt-1" style={{
            textShadowColor: 'rgba(0, 0, 0, 0.3)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 3,
          }}>
            Welcome Back! 👋
          </Text>
          <View className="w-24 h-1 bg-white/30 rounded-full mt-3" />
        </Animated.View>

        {/* Enhanced User Type Toggle */}
        <View className="bg-white/20 backdrop-blur rounded-2xl p-4 mt-6">
          <View className="flex-row bg-white/20 rounded-xl p-1">
            <TouchableOpacity
              onPress={() => setUserType('passenger')}
              className={`flex-1 py-3 rounded-lg ${userType === 'passenger' ? 'bg-white' : ''}`}
            >
              <Text className={`text-center font-bold ${
                userType === 'passenger' ? 'text-purple-600' : 'text-white'
              }`}>
                🚗 Passenger
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setUserType('driver')}
              className={`flex-1 py-3 rounded-lg ${userType === 'driver' ? 'bg-white' : ''}`}
            >
              <Text className={`text-center font-bold ${
                userType === 'driver' ? 'text-purple-600' : 'text-white'
              }`}>
                🚙 Driver
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Ongoing Ride Status */}
      {ongoingRide && (
        <Animated.View style={rideStatusAnimatedStyle} className="mx-6 -mt-4 mb-6">
          <LinearGradient
            colors={getStatusColor(ongoingRide.status)}
            className="rounded-2xl p-6"
            style={{
              shadowColor: getStatusColor(ongoingRide.status)[0],
              shadowOffset: {
                width: 0,
                height: 6,
              },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
            }}
          >
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <Text className="text-white font-black text-xl mb-1" style={{
                  textShadowColor: 'rgba(0, 0, 0, 0.3)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}>
                  {getStatusText(ongoingRide.status)}
                </Text>
                <Text className="text-white/90 font-medium">
                  {ongoingRide.driver} • {ongoingRide.vehicle}
                </Text>
              </View>
              <Animated.View style={pulseAnimatedStyle} className="bg-white/20 p-3 rounded-full">
                <FontAwesome name="car" size={24} color="white" />
              </Animated.View>
            </View>

            <View className="bg-white/20 rounded-xl p-4 mb-4">
              <Text className="text-white font-medium mb-2">
                📍 From: {ongoingRide.pickup}
              </Text>
              <Text className="text-white font-medium">
                🏁 To: {ongoingRide.dropoff}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-white font-bold text-lg">
                  💵 ${ongoingRide.fare}
                </Text>
                <Text className="text-white/80">Estimated fare</Text>
              </View>
              <View className="items-end">
                <Text className="text-white font-bold text-lg">
                  ⏱️ {ongoingRide.eta}
                </Text>
                <Text className="text-white/80">ETA</Text>
              </View>
              <TouchableOpacity 
                onPress={() => console.log('Track ride')}
                className="bg-white/30 px-4 py-2 rounded-full"
              >
                <Text className="text-white font-bold">Track</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Auto-Scrolling Promo Cards */}
      <View className="mb-6">
        <View className="px-6 mb-4">
          <Text className="text-2xl font-black text-gray-900" style={{
            textShadowColor: 'rgba(0, 0, 0, 0.1)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          }}>
            🔥 Special Offers
          </Text>
          <View className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-2" />
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          className="px-6"
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / (width - 48));
            setCurrentPromoIndex(index);
          }}
        >
          {promoCards.map((promo, index) => (
            <TouchableOpacity
              key={promo.id}
              onPress={() => setShowOffersModal(true)}
              style={{ width: width - 48, marginRight: 16 }}
            >
              <LinearGradient
                colors={promo.gradient}
                className="rounded-2xl p-6 h-32"
                style={{
                  shadowColor: promo.gradient[0],
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 10,
                }}
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-white font-black text-xl mb-1" style={{
                      textShadowColor: 'rgba(0, 0, 0, 0.3)',
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}>
                      {promo.title}
                    </Text>
                    <Text className="text-white/90 font-medium mb-2">
                      {promo.subtitle}
                    </Text>
                    <View className="bg-white/20 rounded-lg px-3 py-1 self-start">
                      <Text className="text-white font-bold text-sm">
                        Code: {promo.code}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-white/80 text-sm">Expires in</Text>
                    <Text className="text-white font-bold">{promo.expiresIn}</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Promo Indicators */}
        <View className="flex-row justify-center mt-4 space-x-2">
          {promoCards.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentPromoIndex ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </View>
      </View>

      {/* Enhanced Quick Actions */}
      <View className="px-6 py-6">
        <View className="mb-6">
          <Text className="text-2xl font-black text-gray-900" style={{
            textShadowColor: 'rgba(0, 0, 0, 0.1)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          }}>
            ⚡ Quick Actions
          </Text>
          <View className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
        </View>

        <View className="flex-row flex-wrap justify-between">
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              onPress={action.onPress}
              className="w-[48%] mb-4"
            >
              <LinearGradient
                colors={action.gradient}
                className="rounded-2xl p-6"
                style={{
                  shadowColor: action.shadowColor,
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 10,
                }}
              >
                <View className="items-center">
                  <View className="bg-white/20 p-4 rounded-full mb-3">
                    <FontAwesome 
                      name={action.icon as any} 
                      size={24} 
                      color="white" 
                    />
                  </View>
                  <Text className="text-white font-bold text-lg text-center" style={{
                    textShadowColor: 'rgba(0, 0, 0, 0.3)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }}>
                    {action.title}
                  </Text>
                  <Text className="text-white/80 text-sm text-center mt-1">
                    {action.subtitle}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Enhanced Recent Rides */}
      <View className="px-6 py-4">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-black text-gray-900" style={{
              textShadowColor: 'rgba(0, 0, 0, 0.1)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}>
              🚗 Recent Rides
            </Text>
            <View className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-2" />
          </View>
          <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full">
            <Text className="text-gray-700 font-semibold">View All</Text>
          </TouchableOpacity>
        </View>

        {recentRides.map((ride) => (
          <LinearGradient
            key={ride.id}
            colors={['#ffffff', '#fefefe']}
            className="rounded-2xl p-6 mb-4 border border-gray-100"
            style={{
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 6,
            }}
          >
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900 mb-1" style={{
                  textShadowColor: 'rgba(0, 0, 0, 0.1)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 1,
                }}>
                  📍 {ride.pickup}
                </Text>
                <Text className="text-gray-600 font-medium">
                  🏁 {ride.dropoff}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-green-600 font-bold text-lg" style={{
                  textShadowColor: 'rgba(34, 197, 94, 0.3)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 2,
                }}>
                  💵 ${ride.fare}
                </Text>
                <Text className="text-gray-500 text-sm">{ride.time}</Text>
              </View>
            </View>
            
            <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                <Text className="text-sm font-medium text-gray-600">
                  ✅ {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                </Text>
              </View>
              <TouchableOpacity>
                <FontAwesome name="chevron-right" size={14} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        ))}
      </View>

      {/* Enhanced Offers Modal */}
      <Modal
        visible={showOffersModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          className="flex-1"
        >
          <View className="p-6 pt-16">
            <View className="flex-row justify-between items-center mb-8">
              <Text className="text-3xl font-black text-white" style={{
                textShadowColor: 'rgba(0, 0, 0, 0.3)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 3,
              }}>
                🎁 Special Offers
              </Text>
              <TouchableOpacity 
                onPress={() => setShowOffersModal(false)}
                className="bg-white/20 p-3 rounded-full"
              >
                <FontAwesome name="times" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
              {promoCards.map((promo) => (
                <View key={promo.id} className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-4">
                  <Text className="text-white text-xl font-bold mb-2">
                    {promo.title}
                  </Text>
                  <Text className="text-white/90 leading-6 mb-4">
                    {promo.subtitle}
                  </Text>
                  
                  <View className="bg-white/20 rounded-xl p-4 mb-4">
                    <Text className="text-white font-bold text-center text-lg">
                      CODE: {promo.code}
                    </Text>
                  </View>
                  
                  <View className="flex-row justify-between items-center">
                    <Text className="text-white/80">Expires in {promo.expiresIn}</Text>
                    <TouchableOpacity className="bg-white px-6 py-2 rounded-full">
                      <Text className="text-purple-600 font-bold">
                        📋 Copy Code
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </LinearGradient>
      </Modal>

      <View className="h-8" />
    </ScrollView>
  );
}
