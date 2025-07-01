import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { loginUser } from '../store/slices/authSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

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
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6 pt-16">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900">
            Welcome Back
          </Text>
          <Text className="text-gray-600 mt-2 text-lg">
            Sign in to continue
          </Text>
        </View>

        <View className="space-y-6">
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
            <View className="bg-red-50 border border-red-200 p-3 rounded-lg">
              <Text className="text-red-800 text-sm">{error}</Text>
            </View>
          )}

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            className="mt-6"
          />

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text className="text-blue-600 font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/forgot-password')}
            className="items-center mt-4"
          >
            <Text className="text-blue-600">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
} 