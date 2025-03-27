import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { registerUser } from '../store/slices/authSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'passenger' as 'passenger' | 'driver',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    const errors = {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    };

    if (!formData.name) {
      errors.name = 'Name is required';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };

  const handleRegister = async () => {
    if (validateForm()) {
      try {
        const { confirmPassword, ...registerData } = formData;
        await dispatch(registerUser(registerData));
        router.replace('/(tabs)/home');
      } catch (error) {
        console.error('Registration failed:', error);
      }
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <StyledView className="p-4">
        <StyledView className="mb-8">
          <StyledText className="text-3xl font-bold text-gray-900">
            Create Account
          </StyledText>
          <StyledText className="text-gray-500 mt-2">
            Sign up to get started
          </StyledText>
        </StyledView>

        <StyledView className="space-y-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter your full name"
            error={formErrors.name}
          />

          <Input
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={formErrors.email}
          />

          <Input
            label="Phone Number"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            error={formErrors.phone}
          />

          <Input
            label="Password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            placeholder="Enter your password"
            secureTextEntry
            error={formErrors.password}
          />

          <Input
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) =>
              setFormData({ ...formData, confirmPassword: text })
            }
            placeholder="Confirm your password"
            secureTextEntry
            error={formErrors.confirmPassword}
          />

          <StyledView className="mb-4">
            <StyledText className="text-sm font-medium text-gray-700 mb-2">
              I want to register as a:
            </StyledText>
            <StyledView className="flex-row space-x-4">
              <StyledTouchableOpacity
                onPress={() => setFormData({ ...formData, role: 'passenger' })}
                className={`flex-1 p-3 rounded-lg border-2 ${
                  formData.role === 'passenger'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200'
                }`}
              >
                <StyledText
                  className={`text-center ${
                    formData.role === 'passenger'
                      ? 'text-primary font-semibold'
                      : 'text-gray-600'
                  }`}
                >
                  Passenger
                </StyledText>
              </StyledTouchableOpacity>
              <StyledTouchableOpacity
                onPress={() => setFormData({ ...formData, role: 'driver' })}
                className={`flex-1 p-3 rounded-lg border-2 ${
                  formData.role === 'driver'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200'
                }`}
              >
                <StyledText
                  className={`text-center ${
                    formData.role === 'driver'
                      ? 'text-primary font-semibold'
                      : 'text-gray-600'
                  }`}
                >
                  Driver
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>

          {error && (
            <StyledText className="text-danger text-sm">{error}</StyledText>
          )}

          <Button
            title="Sign Up"
            onPress={handleRegister}
            loading={isLoading}
            disabled={isLoading}
            className="mt-4"
          />

          <StyledView className="flex-row justify-center mt-4">
            <StyledText className="text-gray-600">
              Already have an account?{' '}
            </StyledText>
            <StyledTouchableOpacity onPress={() => router.push('/login')}>
              <StyledText className="text-primary font-semibold">
                Sign In
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </StyledView>
    </ScrollView>
  );
} 