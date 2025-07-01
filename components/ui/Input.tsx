import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerClassName = '',
  className = '',
  ...props
}) => {
  const getInputClasses = () => {
    const baseClasses = 'border rounded-lg px-4 py-3 text-base bg-white';
    const errorClasses = error ? 'border-red-500' : 'border-gray-300';
    const focusClasses = 'focus:border-blue-600';
    
    return `${baseClasses} ${errorClasses} ${focusClasses} ${className}`.trim();
  };

  return (
    <View className={`mb-4 ${containerClassName}`}>
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-2">
          {label}
        </Text>
      )}
      <TextInput
        className={getInputClasses()}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <Text className="text-sm text-red-600 mt-1">{error}</Text>
      )}
    </View>
  );
}; 