import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

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
    <StyledTouchableOpacity
      onPress={onSelect}
      className={`p-4 rounded-lg border-2 mb-2 ${
        isSelected ? 'border-primary bg-primary/5' : 'border-gray-200'
      }`}
    >
      <StyledView className="flex-row items-center justify-between">
        <StyledView className="flex-row items-center flex-1">
          <Image
            source={{ uri: image }}
            className="w-16 h-16 rounded-lg mr-4"
            resizeMode="cover"
          />
          <StyledView className="flex-1">
            <StyledText className="text-lg font-semibold text-gray-900">
              {carType}
            </StyledText>
            <StyledText className="text-sm text-gray-500">
              {estimatedTime} • {price} R
            </StyledText>
          </StyledView>
        </StyledView>
        {isSelected && (
          <StyledView className="w-6 h-6 rounded-full bg-primary items-center justify-center">
            <StyledText className="text-white text-sm">✓</StyledText>
          </StyledView>
        )}
      </StyledView>
    </StyledTouchableOpacity>
  );
}; 