import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { loginUser } from '../store/slices/authSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    const errors = {
      email: '',
      password: '',
    };

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleLogin = async () => {
    if (validateForm()) {
      try {
        await dispatch(loginUser(email, password));
        router.replace('/(tabs)/home');
      } catch (error) {
        console.error('Login failed:', error);
      }
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <StyledView className="p-4">
        <StyledView className="mb-8">
          <StyledText className="text-3xl font-bold text-gray-900">
            Welcome Back
          </StyledText>
          <StyledText className="text-gray-500 mt-2">
            Sign in to continue
          </StyledText>
        </StyledView>

        <StyledView className="space-y-4">
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={formErrors.email}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            error={formErrors.password}
          />

          {error && (
            <StyledText className="text-danger text-sm">{error}</StyledText>
          )}

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            className="mt-4"
          />

          <StyledView className="flex-row justify-center mt-4">
            <StyledText className="text-gray-600">
              Don't have an account?{' '}
            </StyledText>
            <StyledTouchableOpacity onPress={() => router.push('/register')}>
              <StyledText className="text-primary font-semibold">
                Sign Up
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          <StyledTouchableOpacity
            onPress={() => router.push('/forgot-password')}
            className="items-center mt-4"
          >
            <StyledText className="text-primary">
              Forgot Password?
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
    </ScrollView>
  );
} 