import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { RideStatusComponent } from '../../components/RideStatusComponent';
import { renderWithRideProvider, mockRideContext } from '../utils/test-utils';

describe('RideStatusComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with pending ride', async () => {
    const { getByTestId } = renderWithRideProvider(<RideStatusComponent />);

    await waitFor(() => {
      expect(getByTestId('ride-title')).toBeTruthy();
      expect(getByTestId('ride-status')).toBeTruthy();
      expect(getByTestId('ride-fare')).toBeTruthy();
      expect(getByTestId('ride-eta')).toBeTruthy();
      expect(getByTestId('pickup-address')).toBeTruthy();
      expect(getByTestId('dropoff-address')).toBeTruthy();
    });
  });

  it('handles ride acceptance correctly', async () => {
    const { getByTestId } = renderWithRideProvider(<RideStatusComponent />);

    await waitFor(() => {
      const acceptButton = getByTestId('accept-ride-button');
      fireEvent.press(acceptButton);
    });

    await waitFor(() => {
      expect(mockRideContext.acceptRide).toHaveBeenCalledWith('123');
    });
  });

  it('handles ride cancellation correctly', async () => {
    const { getByTestId } = renderWithRideProvider(<RideStatusComponent />);

    await waitFor(() => {
      const cancelButton = getByTestId('cancel-ride-button');
      fireEvent.press(cancelButton);
    });

    await waitFor(() => {
      expect(mockRideContext.updateRideStatus).toHaveBeenCalledWith('123', 'cancelled');
    });
  });

  it('displays notifications correctly', async () => {
    const testNotification = 'Test notification';
    const contextWithNotification = {
      ...mockRideContext,
      notifications: [testNotification],
    };

    const { getByText } = renderWithRideProvider(<RideStatusComponent />, contextWithNotification);

    await waitFor(() => {
      expect(getByText(testNotification)).toBeTruthy();
    });
  });

  it('handles ride completion correctly', async () => {
    const contextWithInProgressRide = {
      ...mockRideContext,
      currentRide: {
        ...mockRideContext.currentRide,
        status: 'in_progress',
      },
      isDriver: () => true,
    };

    const { getByTestId } = renderWithRideProvider(<RideStatusComponent />, contextWithInProgressRide);

    await waitFor(() => {
      const completeButton = getByTestId('complete-ride-button');
      fireEvent.press(completeButton);
    });

    await waitFor(() => {
      expect(mockRideContext.updateRideStatus).toHaveBeenCalledWith('123', 'completed');
    });
  });

  describe('Error Scenarios', () => {
    it('displays loading state correctly', async () => {
      const contextWithLoading = {
        ...mockRideContext,
        loading: true,
      };

      const { getByTestId } = renderWithRideProvider(<RideStatusComponent />, contextWithLoading);

      await waitFor(() => {
        expect(getByTestId('loading-indicator')).toBeTruthy();
      });
    });

    it('displays error state correctly', async () => {
      const errorMessage = 'Failed to fetch rides';
      const contextWithError = {
        ...mockRideContext,
        error: errorMessage,
      };

      const { getByTestId } = renderWithRideProvider(<RideStatusComponent />, contextWithError);

      await waitFor(() => {
        expect(getByTestId('error-message')).toBeTruthy();
      });
    });

    it('handles API error when accepting ride', async () => {
      mockRideContext.acceptRide.mockRejectedValueOnce(new Error('Network error'));

      const { getByTestId } = renderWithRideProvider(<RideStatusComponent />);

      await waitFor(() => {
        const acceptButton = getByTestId('accept-ride-button');
        fireEvent.press(acceptButton);
      });

      await waitFor(() => {
        expect(mockRideContext.addNotification).toHaveBeenCalledWith('Failed to accept ride', 'error');
      });
    });

    it('handles invalid ride data gracefully', async () => {
      const contextWithInvalidRide = {
        ...mockRideContext,
        currentRide: {
          ...mockRideContext.currentRide,
          pickup: null,
          dropoff: null,
        },
      };

      const { getByText } = renderWithRideProvider(<RideStatusComponent />, contextWithInvalidRide);

      await waitFor(() => {
        expect(getByText('Pickup location not specified')).toBeTruthy();
        expect(getByText('Dropoff location not specified')).toBeTruthy();
      });
    });
  });
}); 