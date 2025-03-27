import React from 'react';
import { render } from '@testing-library/react-native';
import { Alert, View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { RideProvider, useRideContext, RideContext } from '../../components/RideProvider';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock React Native components
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn((title, message, buttons) => {
      if (buttons && buttons.length > 0) {
        // Simulate pressing the first button
        buttons[0].onPress?.();
      }
    }),
  },
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  ActivityIndicator: 'ActivityIndicator',
  StyleSheet: {
    create: jest.fn(styles => styles),
  },
  Platform: {
    select: jest.fn(obj => obj.ios),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 })),
  },
}));

// Mock socket.io-client
jest.mock('socket.io-client', () => {
  const mockSocket = {
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  };
  return jest.fn(() => mockSocket);
});

// Mock ride context
export const mockRideContext = {
  rides: [],
  notifications: [],
  loading: false,
  error: null,
  acceptRide: jest.fn(),
  updateRideStatus: jest.fn(),
  addNotification: jest.fn(),
  clearNotifications: jest.fn(),
  isDriver: jest.fn(() => false),
  currentRide: {
    id: '123',
    status: 'pending',
    fare: 25.50,
    eta: '10 mins',
    pickup: {
      address: '123 Main St',
      latitude: 37.7749,
      longitude: -122.4194,
    },
    dropoff: {
      address: '456 Market St',
      latitude: 37.7899,
      longitude: -122.3969,
    },
  },
};

// Mock RideProvider component
jest.mock('../../components/RideProvider', () => {
  const actual = jest.requireActual('../../components/RideProvider');
  return {
    ...actual,
    RideProvider: ({ children }) => {
      return (
        <actual.RideContext.Provider value={mockRideContext}>
          {children}
        </actual.RideContext.Provider>
      );
    },
    useRideContext: () => mockRideContext,
  };
});

// Render helper that wraps component with RideProvider
export const renderWithRideProvider = (ui: React.ReactElement, contextValue = mockRideContext) => {
  return render(
    <RideProvider>
      {ui}
    </RideProvider>
  );
}; 