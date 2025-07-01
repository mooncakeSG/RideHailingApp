import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
}) => {
  const getButtonClasses = () => {
    const baseClasses = 'rounded-lg items-center justify-center';
    
    const variantClasses = {
      primary: 'bg-blue-600',
      secondary: 'bg-gray-600',
      outline: 'border-2 border-blue-600 bg-transparent',
    };

    const sizeClasses = {
      sm: 'px-4 py-2',
      md: 'px-6 py-3',
      lg: 'px-8 py-4',
    };

    const disabledClasses = disabled || loading ? 'opacity-50' : '';

    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`.trim();
  };

  const getTextClasses = () => {
    const variantTextClasses = {
      primary: 'text-white',
      secondary: 'text-white',
      outline: 'text-blue-600',
    };

    const sizeTextClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    return `font-semibold ${variantTextClasses[variant]} ${sizeTextClasses[size]}`;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={getButtonClasses()}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#2563eb' : '#FFFFFF'} />
      ) : (
        <Text className={getTextClasses()}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}; 