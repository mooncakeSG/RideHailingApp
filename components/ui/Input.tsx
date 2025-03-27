import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';
import { styled } from 'nativewind';

const StyledTextInput = styled(TextInput);
const StyledView = styled(View);
const StyledText = styled(Text);

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
  return (
    <StyledView className={`mb-4 ${containerClassName}`}>
      {label && (
        <StyledText className="text-sm font-medium text-gray-700 mb-1">
          {label}
        </StyledText>
      )}
      <StyledTextInput
        className={`border rounded-lg px-4 py-2 text-base ${
          error ? 'border-danger' : 'border-gray-300'
        } focus:border-primary ${className}`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <StyledText className="text-sm text-danger mt-1">{error}</StyledText>
      )}
    </StyledView>
  );
}; 