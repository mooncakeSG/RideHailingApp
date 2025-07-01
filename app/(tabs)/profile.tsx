import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface MenuItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  onPress: () => void;
  rightElement?: 'arrow' | 'switch';
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
}

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Mock user data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+27 83 123 4567',
    rating: 4.8,
    totalRides: 127,
    memberSince: 'March 2023',
    profileImage: null,
  };

  const accountMenuItems: MenuItem[] = [
    {
      id: 'edit-profile',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      icon: 'edit',
      onPress: () => {},
      rightElement: 'arrow',
    },
    {
      id: 'payment-methods',
      title: 'Payment Methods',
      subtitle: 'Manage cards and payment options',
      icon: 'credit-card',
      onPress: () => {},
      rightElement: 'arrow',
    },
    {
      id: 'ride-history',
      title: 'Ride History',
      subtitle: 'View all your past trips',
      icon: 'history',
      onPress: () => {},
      rightElement: 'arrow',
    },
    {
      id: 'emergency-contacts',
      title: 'Emergency Contacts',
      subtitle: 'Manage your emergency contacts',
      icon: 'phone',
      onPress: () => {},
      rightElement: 'arrow',
    },
  ];

  const settingsMenuItems: MenuItem[] = [
    {
      id: 'notifications',
      title: 'Push Notifications',
      subtitle: 'Ride updates and promotional offers',
      icon: 'bell',
      onPress: () => {},
      rightElement: 'switch',
      switchValue: notificationsEnabled,
      onSwitchChange: setNotificationsEnabled,
    },
    {
      id: 'location',
      title: 'Location Services',
      subtitle: 'Allow location access for better experience',
      icon: 'map-marker',
      onPress: () => {},
      rightElement: 'switch',
      switchValue: locationEnabled,
      onSwitchChange: setLocationEnabled,
    },
    {
      id: 'emergency',
      title: 'Emergency Mode',
      subtitle: 'Quick access to emergency features',
      icon: 'exclamation-triangle',
      onPress: () => {},
      rightElement: 'switch',
      switchValue: emergencyMode,
      onSwitchChange: setEmergencyMode,
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      subtitle: 'Control your data and privacy settings',
      icon: 'shield',
      onPress: () => {},
      rightElement: 'arrow',
    },
  ];

  const supportMenuItems: MenuItem[] = [
    {
      id: 'help-center',
      title: 'Help Center',
      subtitle: 'FAQs and troubleshooting',
      icon: 'question-circle',
      onPress: () => {},
      rightElement: 'arrow',
    },
    {
      id: 'contact-support',
      title: 'Contact Support',
      subtitle: 'Get help from our team',
      icon: 'headphones',
      onPress: () => {},
      rightElement: 'arrow',
    },
    {
      id: 'report-issue',
      title: 'Report an Issue',
      subtitle: 'Report safety or app issues',
      icon: 'flag',
      onPress: () => {},
      rightElement: 'arrow',
    },
    {
      id: 'rate-app',
      title: 'Rate Our App',
      subtitle: 'Share your feedback on app stores',
      icon: 'star',
      onPress: () => {},
      rightElement: 'arrow',
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => {
            // Handle logout logic
            router.replace('/(auth)/login');
          }
        },
      ]
    );
  };

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      onPress={item.onPress}
      className="bg-white px-6 py-4 flex-row items-center"
    >
      <View className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center mr-4">
        <FontAwesome name={item.icon as any} size={18} color="#6B7280" />
      </View>
      
      <View className="flex-1">
        <Text className="font-semibold text-gray-900">{item.title}</Text>
        {item.subtitle && (
          <Text className="text-sm text-gray-500 mt-1">{item.subtitle}</Text>
        )}
      </View>

      {item.rightElement === 'switch' && (
        <Switch
          value={item.switchValue}
          onValueChange={item.onSwitchChange}
          trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
          thumbColor={item.switchValue ? '#FFFFFF' : '#FFFFFF'}
        />
      )}

      {item.rightElement === 'arrow' && (
        <FontAwesome name="chevron-right" size={16} color="#9CA3AF" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-6">
        <Text className="text-2xl font-bold text-gray-900 mb-6">Profile</Text>
        
        {/* User Info Card */}
        <View className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6">
          <View className="flex-row items-center">
            <View className="w-16 h-16 bg-white/20 rounded-full items-center justify-center mr-4">
              {userData.profileImage ? (
                <Image 
                  source={{ uri: userData.profileImage }} 
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <FontAwesome name="user" size={24} color="white" />
              )}
            </View>
            
            <View className="flex-1">
              <Text className="text-white text-xl font-bold">{userData.name}</Text>
              <Text className="text-blue-100">{userData.email}</Text>
              <Text className="text-blue-100 text-sm">Member since {userData.memberSince}</Text>
            </View>
          </View>

          {/* Stats */}
          <View className="flex-row justify-between mt-6 pt-4 border-t border-white/20">
            <View className="items-center">
              <Text className="text-white text-2xl font-bold">{userData.rating}</Text>
              <Text className="text-blue-100 text-sm">Rating</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-2xl font-bold">{userData.totalRides}</Text>
              <Text className="text-blue-100 text-sm">Total Rides</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-2xl font-bold">R2,847</Text>
              <Text className="text-blue-100 text-sm">Savings</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Account Section */}
      <View className="mt-6">
        <Text className="text-lg font-semibold text-gray-900 px-6 mb-3">Account</Text>
        <View className="bg-white">
          {accountMenuItems.map(renderMenuItem)}
        </View>
      </View>

      {/* Settings Section */}
      <View className="mt-6">
        <Text className="text-lg font-semibold text-gray-900 px-6 mb-3">Settings</Text>
        <View className="bg-white">
          {settingsMenuItems.map(renderMenuItem)}
        </View>
      </View>

      {/* Support Section */}
      <View className="mt-6">
        <Text className="text-lg font-semibold text-gray-900 px-6 mb-3">Support</Text>
        <View className="bg-white">
          {supportMenuItems.map(renderMenuItem)}
        </View>
      </View>

      {/* Legal & Logout */}
      <View className="mt-6 mb-8">
        <View className="bg-white">
          <TouchableOpacity className="px-6 py-4 flex-row items-center">
            <View className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center mr-4">
              <FontAwesome name="file-text" size={18} color="#6B7280" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-900">Terms & Conditions</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity className="px-6 py-4 flex-row items-center border-t border-gray-100">
            <View className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center mr-4">
              <FontAwesome name="shield" size={18} color="#6B7280" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-900">Privacy Policy</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleLogout}
            className="px-6 py-4 flex-row items-center border-t border-gray-100"
          >
            <View className="w-10 h-10 bg-red-100 rounded-lg items-center justify-center mr-4">
              <FontAwesome name="sign-out" size={18} color="#EF4444" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-red-500">Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Version */}
      <View className="px-6 pb-6">
        <Text className="text-center text-gray-500 text-sm">
          RideHailing App v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
} 