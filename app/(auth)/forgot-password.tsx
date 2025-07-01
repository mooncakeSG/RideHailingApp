import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    if (validateEmail()) {
      setIsLoading(true);
      setError('');
      try {
        // Replace with your actual API call
        await fetch('YOUR_API_URL/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        setIsSubmitted(true);
      } catch (error) {
        setError('Failed to send reset email. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900">
            Reset Password
          </Text>
          <Text className="text-gray-500 mt-2">
            Enter your email to receive reset instructions
          </Text>
        </View>

        {isSubmitted ? (
          <View className="space-y-4">
            <View className="bg-green-50 p-4 rounded-lg">
              <Text className="text-green-600 text-center">
                Password reset instructions have been sent to your email.
              </Text>
            </View>
            <Button
              title="Back to Login"
              onPress={() => router.push('/login')}
              variant="outline"
            />
          </View>
        ) : (
          <View className="space-y-4">
            <Input
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={error}
            />

            <Button
              title="Send Reset Instructions"
              onPress={handleResetPassword}
              loading={isLoading}
              disabled={isLoading}
              className="mt-4"
            />

            <TouchableOpacity
              onPress={() => router.push('/login')}
              className="items-center mt-4"
            >
              <Text className="text-blue-600">
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
} 