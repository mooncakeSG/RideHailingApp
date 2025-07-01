import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
  overlay?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#3B82F6',
  message,
  overlay = false,
}) => {
  const getSizeValue = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 40;
      default:
        return 30;
    }
  };

  const getContainerStyle = () => {
    if (overlay) {
      return 'absolute inset-0 bg-black/50 items-center justify-center z-50';
    }
    return 'items-center justify-center py-8';
  };

  return (
    <View className={getContainerStyle()}>
      <View className="bg-white rounded-xl p-6 items-center shadow-lg min-w-32">
        <ActivityIndicator size={getSizeValue()} color={color} />
        {message && (
          <Text className="text-gray-600 mt-3 text-center font-medium">
            {message}
          </Text>
        )}
      </View>
    </View>
  );
};

// Skeleton loading component for list items
interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = 'w-full',
  height = 'h-4',
  rounded = false,
}) => {
  return (
    <View className={`bg-gray-200 ${width} ${height} ${rounded ? 'rounded-full' : 'rounded'} animate-pulse`} />
  );
};

// Card skeleton for ride cards
export const RideCardSkeleton: React.FC = () => {
  return (
    <View className="bg-white p-4 rounded-xl mb-3 shadow-sm">
      <View className="flex-row items-center">
        <Skeleton width="w-12" height="h-12" rounded />
        <View className="flex-1 ml-4">
          <Skeleton width="w-3/4" height="h-4" />
          <View className="mt-2">
            <Skeleton width="w-1/2" height="h-3" />
          </View>
        </View>
        <Skeleton width="w-16" height="h-6" />
      </View>
    </View>
  );
};

// Profile skeleton
export const ProfileSkeleton: React.FC = () => {
  return (
    <View className="bg-white p-6 rounded-xl">
      <View className="flex-row items-center">
        <Skeleton width="w-16" height="h-16" rounded />
        <View className="flex-1 ml-4">
          <Skeleton width="w-3/4" height="h-5" />
          <View className="mt-2">
            <Skeleton width="w-1/2" height="h-4" />
          </View>
          <View className="mt-1">
            <Skeleton width="w-2/3" height="h-3" />
          </View>
        </View>
      </View>
    </View>
  );
}; 