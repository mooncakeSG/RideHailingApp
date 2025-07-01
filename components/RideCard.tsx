import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

interface RideCardProps {
  carType: string;
  price: number;
  estimatedTime: string;
  image: string;
  onSelect: () => void;
  isSelected?: boolean;
}

export const RideCard: React.FC<RideCardProps> = ({
  carType,
  price,
  estimatedTime,
  image,
  onSelect,
  isSelected = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onSelect}
      className={`p-4 rounded-lg border-2 mb-2 ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Image
            source={{ uri: image }}
            className="w-16 h-16 rounded-lg mr-4"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900">
              {carType}
            </Text>
            <Text className="text-sm text-gray-500">
              {estimatedTime} • {price} R
            </Text>
          </View>
        </View>
        {isSelected && (
          <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center">
            <Text className="text-white text-sm">✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}; 