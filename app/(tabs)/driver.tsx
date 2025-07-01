import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  RefreshControl,
  Modal,
  Dimensions,
  Platform,
  Switch
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Type definitions
interface RideRequest {
  id: string;
  passenger: string;
  pickup: string;
  dropoff: string;
  distance: string;
  duration: string;
  fare: number;
  rating: number;
  requestTime: string;
}

// Mock data for development
const mockRideRequests: RideRequest[] = [
  {
    id: '1',
    passenger: 'John Doe',
    pickup: '123 Main Street, Downtown',
    dropoff: '456 Oak Avenue, Uptown',
    distance: '3.2 km',
    duration: '12 min',
    fare: 25.50,
    rating: 4.8,
    requestTime: '2 min ago'
  },
  {
    id: '2',
    passenger: 'Sarah Wilson',
    pickup: '789 Pine Road, City Center',
    dropoff: '321 Elm Street, Business District',
    distance: '5.1 km',
    duration: '18 min',
    fare: 32.75,
    rating: 4.9,
    requestTime: '4 min ago'
  },
  {
    id: '3',
    passenger: 'Mike Johnson',
    pickup: '555 Broadway, Theater District',
    dropoff: '888 5th Avenue, Shopping Mall',
    distance: '2.8 km',
    duration: '10 min',
    fare: 22.00,
    rating: 4.6,
    requestTime: '6 min ago'
  }
];

const mockStats = {
  todayEarnings: 187.50,
  weeklyEarnings: 892.25,
  completedTrips: 12,
  totalTrips: 156,
  rating: 4.8,
  acceptanceRate: 95,
  cancellationRate: 2
};

export default function DriverScreen() {
  const [isOnline, setIsOnline] = useState(true);
  const [currentRide, setCurrentRide] = useState<RideRequest | null>(null);
  const [rideRequests, setRideRequests] = useState(mockRideRequests);
  const [refreshing, setRefreshing] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RideRequest | null>(null);
  const [isApproved, setIsApproved] = useState(true); // Set to false to test approval flow

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      // Add some random variation to ride requests
      const updatedRequests = mockRideRequests.map(request => ({
        ...request,
        fare: request.fare + (Math.random() * 5 - 2.5) // Add some variance
      }));
      setRideRequests(updatedRequests);
    }, 1000);
  }, []);

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    if (!isOnline) {
      Alert.alert(
        'Going Online',
        'You are now available to receive ride requests',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Going Offline',
        'You will stop receiving new ride requests',
        [{ text: 'OK' }]
      );
    }
  };

  const handleAcceptRide = (requestId: string) => {
    const request = rideRequests.find(r => r.id === requestId);
    if (request) {
      setCurrentRide(request);
      setRideRequests(prev => prev.filter(r => r.id !== requestId));
      Alert.alert('Ride Accepted', 'Navigate to pickup location');
    }
  };

  const handleDeclineRide = (requestId: string) => {
    setRideRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleCompleteRide = () => {
    if (currentRide) {
      Alert.alert(
        'Complete Ride',
        `Complete ride for ${currentRide.passenger}?\nFare: $${currentRide.fare.toFixed(2)}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Complete', 
            onPress: () => {
              setCurrentRide(null);
              Alert.alert('Ride Completed', 'Payment processed successfully');
            }
          }
        ]
      );
    }
  };

  const DocumentUploadScreen = () => (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="bg-yellow-100 p-4 rounded-full mb-4">
            <FontAwesome name="clock-o" size={32} color="#f59e0b" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 text-center">
            Account Under Review
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Complete your profile to start driving
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="mb-8">
          <View className="flex-row justify-between mb-2">
            <Text className="text-sm text-gray-600">Profile Completion</Text>
            <Text className="text-sm text-gray-600">60%</Text>
          </View>
          <View className="bg-gray-200 rounded-full h-2">
            <View className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }} />
          </View>
        </View>

        {/* Document Requirements */}
        <View className="bg-white rounded-lg shadow-sm mb-6">
          <View className="p-6 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-900">Required Documents</Text>
            <Text className="text-gray-600 mt-1">Upload clear photos of the following</Text>
          </View>

          {[
            { icon: 'id-card' as const, title: 'Government ID', subtitle: 'Driver\'s license or ID card', status: 'completed' },
            { icon: 'car' as const, title: 'Vehicle Registration', subtitle: 'Current registration document', status: 'pending' },
            { icon: 'shield' as const, title: 'Insurance Certificate', subtitle: 'Valid insurance proof', status: 'pending' },
            { icon: 'user-circle' as const, title: 'Profile Photo', subtitle: 'Clear headshot photo', status: 'review' }
          ].map((doc, index) => (
            <TouchableOpacity key={index} className="p-4 border-b border-gray-100 flex-row items-center">
              <View className="bg-gray-100 p-3 rounded-full mr-4">
                <FontAwesome name={doc.icon} size={20} color="#6b7280" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-900">{doc.title}</Text>
                <Text className="text-gray-600 text-sm">{doc.subtitle}</Text>
              </View>
              <View className="flex-row items-center">
                {doc.status === 'completed' && (
                  <View className="bg-green-100 px-2 py-1 rounded-full">
                    <Text className="text-green-800 text-xs font-medium">✓ Approved</Text>
                  </View>
                )}
                {doc.status === 'review' && (
                  <View className="bg-yellow-100 px-2 py-1 rounded-full">
                    <Text className="text-yellow-800 text-xs font-medium">Under Review</Text>
                  </View>
                )}
                {doc.status === 'pending' && (
                  <FontAwesome name="chevron-right" size={16} color="#6b7280" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Support */}
        <View className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <Text className="text-blue-800 font-medium mb-2">Need Help?</Text>
          <Text className="text-blue-600 text-sm mb-3">
            Contact our support team if you have questions about the approval process.
          </Text>
          <TouchableOpacity className="bg-blue-600 py-2 px-4 rounded-lg self-start">
            <Text className="text-white font-medium">Contact Support</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const StatsModal = () => (
    <Modal
      visible={showStatsModal}
      animationType="slide"
      presentationStyle="formSheet"
    >
      <View className="flex-1 bg-white">
        <View className="p-6 border-b border-gray-200">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-900">Driver Statistics</Text>
            <TouchableOpacity onPress={() => setShowStatsModal(false)}>
              <FontAwesome name="times" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 p-6">
          {/* Earnings Overview */}
          <View className="bg-green-500 p-6 rounded-lg mb-6">
            <Text className="text-white text-lg font-semibold mb-2">Total Earnings</Text>
            <Text className="text-white text-3xl font-bold">${mockStats.weeklyEarnings}</Text>
            <Text className="text-green-100 mt-1">This week</Text>
          </View>

          {/* Performance Metrics */}
          <View className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Performance</Text>
            <View className="space-y-4">
              {[
                { label: 'Acceptance Rate', value: `${mockStats.acceptanceRate}%`, color: 'text-green-600' },
                { label: 'Cancellation Rate', value: `${mockStats.cancellationRate}%`, color: 'text-red-600' },
                { label: 'Average Rating', value: mockStats.rating.toString(), color: 'text-yellow-600' },
                { label: 'Total Trips', value: mockStats.totalTrips.toString(), color: 'text-blue-600' }
              ].map((metric, index) => (
                <View key={index} className="flex-row justify-between items-center">
                  <Text className="text-gray-600">{metric.label}</Text>
                  <Text className={`font-semibold ${metric.color}`}>{metric.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Daily Breakdown */}
          <View className="bg-white border border-gray-200 rounded-lg p-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">This Week</Text>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <View key={index} className="flex-row justify-between items-center py-2">
                <Text className="text-gray-600">{day}</Text>
                <Text className="font-medium text-gray-900">
                  ${(Math.random() * 150 + 50).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  if (!isApproved) {
    return <DocumentUploadScreen />;
  }

  return (
    <ScrollView 
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Enhanced Header with Gradient */}
      <LinearGradient
        colors={isOnline ? ['#10b981', '#059669'] : ['#6b7280', '#4b5563']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 pt-16 pb-8"
      >
        <View className="items-center">
          <Text className="text-4xl font-black text-white text-center tracking-wide mb-2">
            {isOnline ? 'Go Offline' : 'Go Online'}
          </Text>
          <View className="w-20 h-1 bg-white/30 rounded-full mb-4" />
          
          {/* Enhanced Online Status */}
          <View className="bg-white/20 backdrop-blur rounded-2xl p-6 w-full">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className={`w-4 h-4 ${isOnline ? 'bg-green-400' : 'bg-red-400'} rounded-full mr-3 shadow-lg`} />
                <Text className="text-xl font-bold text-white" style={{
                  textShadowColor: 'rgba(0, 0, 0, 0.3)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 3,
                }}>
                  {isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
              <Switch
                value={isOnline}
                onValueChange={setIsOnline}
                trackColor={{ false: '#E5E7EB', true: '#34D399' }}
                thumbColor={isOnline ? '#FFFFFF' : '#FFFFFF'}
                style={{
                  transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
                }}
              />
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Enhanced Statistics Overview */}
      <View className="px-6 py-6">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-black text-gray-900" style={{
              textShadowColor: 'rgba(0, 0, 0, 0.1)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}>
              Statistics Overview
            </Text>
            <View className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" />
          </View>
          <View className="bg-blue-100 px-4 py-2 rounded-full">
            <Text className="text-lg text-blue-700 font-bold" style={{
              textShadowColor: 'rgba(29, 78, 216, 0.3)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}>
              🚗 {rideRequests.length} requests
            </Text>
          </View>
        </View>

        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          className="rounded-2xl p-6 shadow-xl border border-gray-100"
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 10,
          }}
        >
          <View className="flex-row justify-between items-center">
            <View className="items-center">
              <Text className="text-4xl font-black text-green-600" style={{
                textShadowColor: 'rgba(34, 197, 94, 0.3)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 3,
              }}>
                ${mockStats.todayEarnings.toFixed(2)}
              </Text>
              <Text className="text-gray-600 mt-2 font-semibold">💰 Earnings</Text>
            </View>
            <View className="items-center">
              <View className="flex-row items-center">
                <FontAwesome name="star" size={24} color="#F59E0B" />
                <Text className="text-4xl font-black text-yellow-600 ml-2" style={{
                  textShadowColor: 'rgba(245, 158, 11, 0.3)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 3,
                }}>
                  {mockStats.rating}
                </Text>
              </View>
              <Text className="text-gray-600 mt-2 font-semibold">⭐ Rating</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Enhanced Live Ride Requests */}
      {isOnline && (
        <View className="px-6 py-4">
          <View className="mb-6">
            <Text className="text-2xl font-black text-gray-900" style={{
              textShadowColor: 'rgba(0, 0, 0, 0.1)',
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            }}>
              Live Ride Requests
            </Text>
            <View className="w-20 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mt-2" />
            <Text className="text-gray-600 mt-2 font-medium">🔥 Hot requests in your area</Text>
          </View>

          {rideRequests.map((request) => (
            <LinearGradient
              key={request.id}
              colors={['#ffffff', '#fefefe']}
              className="rounded-2xl p-6 mb-6 border border-gray-100"
              style={{
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-gray-900 mb-2" style={{
                    textShadowColor: 'rgba(0, 0, 0, 0.1)',
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }}>
                    👤 {request.passenger}
                  </Text>
                  <View className="flex-row items-center mb-2">
                    <FontAwesome name="star" size={16} color="#F59E0B" />
                    <Text className="text-gray-700 ml-2 font-semibold">{request.rating}</Text>
                    <Text className="text-gray-500 ml-3 text-sm">⏰ {request.requestTime}</Text>
                  </View>
                </View>
              </View>

              <View className="mb-4 bg-gray-50 rounded-xl p-4">
                <Text className="text-base text-gray-700 mb-2 font-medium">
                  📍 <Text className="font-bold">From:</Text> {request.pickup}
                </Text>
                <Text className="text-base text-gray-700 font-medium">
                  🏁 <Text className="font-bold">To:</Text> {request.dropoff}
                </Text>
              </View>

              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-3xl font-black text-green-600" style={{
                  textShadowColor: 'rgba(34, 197, 94, 0.3)',
                  textShadowOffset: { width: 1, height: 1 },
                  textShadowRadius: 3,
                }}>
                  💵 ${request.fare.toFixed(2)}
                </Text>
                <View className="items-end">
                  <Text className="text-gray-700 font-bold">📏 {request.distance}</Text>
                  <Text className="text-gray-600 font-medium">⏱️ {request.duration}</Text>
                </View>
              </View>

              <View className="flex-row gap-4">
                <TouchableOpacity
                  onPress={() => handleDeclineRide(request.id)}
                  className="flex-1 bg-gray-100 py-4 rounded-xl border border-gray-200"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Text className="text-gray-700 text-center font-bold text-lg">
                    ❌ Decline
                  </Text>
                </TouchableOpacity>
                <LinearGradient
                  colors={['#ef4444', '#dc2626']}
                  className="flex-1 py-4 rounded-xl"
                  style={{
                    shadowColor: '#ef4444',
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    elevation: 8,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleAcceptRide(request.id)}
                  >
                    <Text className="text-white text-center font-bold text-lg" style={{
                      textShadowColor: 'rgba(0, 0, 0, 0.3)',
                      textShadowOffset: { width: 1, height: 1 },
                      textShadowRadius: 2,
                    }}>
                      ✅ Accept
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </LinearGradient>
          ))}
        </View>
      )}

      {/* Enhanced Daily Statistics */}
      <View className="px-6 py-4">
        <View className="mb-4">
          <Text className="text-2xl font-black text-gray-900" style={{
            textShadowColor: 'rgba(0, 0, 0, 0.1)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          }}>
            Daily Statistics
          </Text>
          <View className="w-16 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2" />
        </View>
        
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          className="rounded-2xl p-6 border border-gray-100"
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
            <View>
              <Text className="text-xl font-bold text-gray-900" style={{
                textShadowColor: 'rgba(0, 0, 0, 0.1)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              }}>
                📊 Today's Summary
              </Text>
              <Text className="text-gray-600 mt-1 font-medium">🚗 {mockStats.completedTrips} trips completed</Text>
            </View>
            <View className="bg-indigo-100 p-3 rounded-full">
              <TouchableOpacity>
                <FontAwesome name="chevron-right" size={18} color="#6366F1" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View className="h-8" />
    </ScrollView>
  );
} 