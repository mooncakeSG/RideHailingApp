import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { styled } from 'nativewind';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/slices/store';
import { markAsRead, markAllAsRead, clearNotifications } from '../store/slices/notificationSlice';
import { FontAwesome } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function NotificationsScreen() {
  const dispatch = useDispatch();
  const { notifications, isPermissionGranted, error, unreadCount } = useSelector(
    (state: RootState) => state.notification
  );

  const handleNotificationPress = (notificationId: string) => {
    dispatch(markAsRead(notificationId));
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'ride_request':
        return 'car';
      case 'ride_status':
        return 'map-marker';
      case 'payment':
        return 'credit-card';
      default:
        return 'bell';
    }
  };

  const renderNotification = ({ item }) => (
    <StyledTouchableOpacity
      className={`p-4 border-b border-gray-200 ${
        item.read ? 'bg-white' : 'bg-primary/5'
      }`}
      onPress={() => handleNotificationPress(item.id)}
    >
      <StyledView className="flex-row justify-between items-start">
        <StyledView className="flex-1">
          <StyledView className="flex-row items-center">
            <FontAwesome
              name={getNotificationIcon(item.data?.type)}
              size={16}
              color="#007AFF"
              className="mr-2"
            />
            <StyledText className="font-semibold text-gray-900">
              {item.title}
            </StyledText>
          </StyledView>
          <StyledText className="text-gray-600 mt-1">{item.body}</StyledText>
          
          {/* Render additional data based on notification type */}
          {item.data?.type === 'ride_request' && (
            <StyledView className="mt-2">
              <StyledText className="text-sm text-gray-500">
                Pickup: {item.data.pickupLocation}
              </StyledText>
              <StyledText className="text-sm text-gray-500">
                Dropoff: {item.data.dropoffLocation}
              </StyledText>
              <StyledText className="text-sm text-gray-500">
                Fare: R{item.data.fare}
              </StyledText>
            </StyledView>
          )}
          
          <StyledText className="text-xs text-gray-400 mt-2">
            {new Date(item.timestamp).toLocaleString()}
          </StyledText>
        </StyledView>
        {!item.read && (
          <StyledView className="w-2 h-2 bg-primary rounded-full ml-2" />
        )}
      </StyledView>
    </StyledTouchableOpacity>
  );

  if (!isPermissionGranted) {
    return (
      <StyledView className="flex-1 bg-background p-4">
        <StyledView className="bg-warning/10 p-4 rounded-lg">
          <StyledText className="text-warning font-semibold">
            Notifications Disabled
          </StyledText>
          <StyledText className="text-gray-600 mt-2">
            Please enable notifications in your device settings to receive updates
            about your rides.
          </StyledText>
        </StyledView>
      </StyledView>
    );
  }

  if (error) {
    return (
      <StyledView className="flex-1 bg-background p-4">
        <StyledView className="bg-danger/10 p-4 rounded-lg">
          <StyledText className="text-danger font-semibold">Error</StyledText>
          <StyledText className="text-gray-600 mt-2">{error}</StyledText>
        </StyledView>
      </StyledView>
    );
  }

  return (
    <StyledView className="flex-1 bg-background">
      {notifications.length > 0 && (
        <StyledView className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <StyledText className="text-sm text-gray-500">
            {unreadCount} unread notifications
          </StyledText>
          <StyledView className="flex-row space-x-2">
            <StyledTouchableOpacity
              onPress={() => dispatch(markAllAsRead())}
              className="px-3 py-1 bg-primary/10 rounded-full"
            >
              <StyledText className="text-primary text-sm">Mark all as read</StyledText>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity
              onPress={() => dispatch(clearNotifications())}
              className="px-3 py-1 bg-danger/10 rounded-full"
            >
              <StyledText className="text-danger text-sm">Clear all</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      )}
      
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <StyledView className="p-4">
            <StyledText className="text-gray-500 text-center">
              No notifications yet
            </StyledText>
          </StyledView>
        }
      />
    </StyledView>
  );
} 