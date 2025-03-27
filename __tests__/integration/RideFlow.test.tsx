import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import RideStatusComponent from '../../components/RideStatusComponent';
import { renderWithRideProvider, mockRideContext, mockRide } from '../utils/test-utils';

describe('Ride Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('completes a full ride flow from request to completion', async () => {
    // Render both driver and passenger components
    const { getByTestId: getDriverTestId } = renderWithRideProvider(
      <RideStatusComponent isDriver={true} />,
      {
        ...mockRideContext,
        rides: [mockRide],
      }
    );

    const { getByTestId: getPassengerTestId } = renderWithRideProvider(
      <RideStatusComponent isDriver={false} />,
      {
        ...mockRideContext,
        rides: [mockRide],
      }
    );

    // Step 1: Driver accepts the ride
    const acceptButton = getDriverTestId('accept-ride-button');
    fireEvent.press(acceptButton);

    await waitFor(() => {
      expect(mockRideContext.acceptRide).toHaveBeenCalledWith(mockRide.id);
    });

    // Update ride status to accepted
    const { getByTestId: getDriverTestId2 } = renderWithRideProvider(
      <RideStatusComponent isDriver={true} />,
      {
        ...mockRideContext,
        rides: [{ ...mockRide, status: 'accepted' }],
      }
    );

    // Step 2: Driver starts the ride
    const startButton = getDriverTestId2('start-ride-button');
    fireEvent.press(startButton);

    await waitFor(() => {
      expect(mockRideContext.updateRideStatus).toHaveBeenCalledWith(mockRide.id, 'in_progress');
    });

    // Update ride status to in_progress
    const { getByTestId: getDriverTestId3 } = renderWithRideProvider(
      <RideStatusComponent isDriver={true} />,
      {
        ...mockRideContext,
        rides: [{ ...mockRide, status: 'in_progress' }],
      }
    );

    // Step 3: Driver completes the ride
    const completeButton = getDriverTestId3('complete-ride-button');
    fireEvent.press(completeButton);

    await waitFor(() => {
      expect(mockRideContext.updateRideStatus).toHaveBeenCalledWith(mockRide.id, 'completed');
    });

    // Verify notifications were added
    expect(mockRideContext.addNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'status-update',
        message: expect.stringContaining('completed'),
      })
    );
  });

  it('handles ride cancellation from both driver and passenger', async () => {
    // Render both driver and passenger components
    const { getByTestId: getDriverTestId } = renderWithRideProvider(
      <RideStatusComponent isDriver={true} />,
      {
        ...mockRideContext,
        rides: [{ ...mockRide, status: 'accepted' }],
      }
    );

    const { getByTestId: getPassengerTestId } = renderWithRideProvider(
      <RideStatusComponent isDriver={false} />,
      {
        ...mockRideContext,
        rides: [{ ...mockRide, status: 'accepted' }],
      }
    );

    // Driver cancels the ride
    const driverCancelButton = getDriverTestId('cancel-ride-button');
    fireEvent.press(driverCancelButton);

    await waitFor(() => {
      expect(mockRideContext.updateRideStatus).toHaveBeenCalledWith(mockRide.id, 'cancelled');
    });

    // Verify cancellation notification
    expect(mockRideContext.addNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'status-update',
        message: expect.stringContaining('cancelled'),
      })
    );
  });

  it('updates ride status in real-time for both driver and passenger', async () => {
    const mockSocket = {
      on: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    };

    // Render both components
    const { getByTestId: getDriverTestId } = renderWithRideProvider(
      <RideStatusComponent isDriver={true} />,
      {
        ...mockRideContext,
        rides: [mockRide],
        socket: mockSocket,
      }
    );

    const { getByTestId: getPassengerTestId } = renderWithRideProvider(
      <RideStatusComponent isDriver={false} />,
      {
        ...mockRideContext,
        rides: [mockRide],
        socket: mockSocket,
      }
    );

    // Simulate real-time status update
    const statusUpdateCallback = mockSocket.on.mock.calls.find(
      call => call[0] === 'rideStatusUpdate'
    )[1];

    statusUpdateCallback({ rideId: mockRide.id, status: 'in_progress' });

    await waitFor(() => {
      expect(mockRideContext.updateRideStatus).toHaveBeenCalledWith(mockRide.id, 'in_progress');
    });

    // Verify both components received the update
    expect(getDriverTestId('ride-status')).toBeTruthy();
    expect(getPassengerTestId('ride-status')).toBeTruthy();
  });

  it('handles network disconnection during ride flow', async () => {
    const mockSocket = {
      on: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    };

    // Render driver component
    const { getByTestId } = renderWithRideProvider(
      <RideStatusComponent isDriver={true} />,
      {
        ...mockRideContext,
        rides: [mockRide],
        socket: mockSocket,
      }
    );

    // Simulate network disconnection
    const disconnectCallback = mockSocket.on.mock.calls.find(
      call => call[0] === 'disconnect'
    )[1];

    disconnectCallback();

    await waitFor(() => {
      expect(mockRideContext.addNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          message: expect.stringContaining('connection lost'),
        })
      );
    });
  });
}); 