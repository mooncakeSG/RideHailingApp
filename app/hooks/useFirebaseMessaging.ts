import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { useDispatch } from 'react-redux';
import {
  setFcmToken,
  setPermissionStatus,
  addNotification,
  setError,
} from '../store/slices/notificationSlice';
import { Alert } from 'react-native';

export const useFirebaseMessaging = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Request permission
    const requestUserPermission = async () => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        dispatch(setPermissionStatus(enabled));

        if (enabled) {
          // Get FCM token
          const fcmToken = await messaging().getToken();
          dispatch(setFcmToken(fcmToken));
          console.log('FCM Token:', fcmToken);
        }
      } catch (error) {
        dispatch(setError(error.message));
      }
    };

    // Handle foreground messages
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      const notification = {
        id: remoteMessage.messageId || Date.now().toString(),
        title: remoteMessage.notification?.title || 'New Notification',
        body: remoteMessage.notification?.body || '',
        data: remoteMessage.data,
        timestamp: Date.now(),
        read: false,
      };

      // Handle ride request notifications
      if (remoteMessage.data?.type === 'ride_request') {
        Alert.alert(
          'New Ride Request',
          `${remoteMessage.notification?.body}\n\nPickup: ${remoteMessage.data.pickupLocation}\nDropoff: ${remoteMessage.data.dropoffLocation}\nFare: R${remoteMessage.data.fare}`,
          [
            {
              text: 'View Details',
              onPress: () => {
                // Navigate to ride details
                // navigation.navigate('RideDetails', { rideId: remoteMessage.data.rideId });
              },
            },
            {
              text: 'Dismiss',
              style: 'cancel',
            },
          ]
        );
      }

      dispatch(addNotification(notification));
    });

    // Handle background messages
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      const notification = {
        id: remoteMessage.messageId || Date.now().toString(),
        title: remoteMessage.notification?.title || 'New Notification',
        body: remoteMessage.notification?.body || '',
        data: remoteMessage.data,
        timestamp: Date.now(),
        read: false,
      };

      dispatch(addNotification(notification));
    });

    // Handle notification open
    const unsubscribeNotificationOpen = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        const notification = {
          id: remoteMessage.messageId || Date.now().toString(),
          title: remoteMessage.notification?.title || 'New Notification',
          body: remoteMessage.notification?.body || '',
          data: remoteMessage.data,
          timestamp: Date.now(),
          read: true,
        };

        dispatch(addNotification(notification));

        // Handle navigation based on notification type
        if (remoteMessage.data?.type === 'ride_request') {
          // Navigate to ride details
          // navigation.navigate('RideDetails', { rideId: remoteMessage.data.rideId });
        }
      }
    );

    // Check if app was opened from a notification
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          const notification = {
            id: remoteMessage.messageId || Date.now().toString(),
            title: remoteMessage.notification?.title || 'New Notification',
            body: remoteMessage.notification?.body || '',
            data: remoteMessage.data,
            timestamp: Date.now(),
            read: true,
          };

          dispatch(addNotification(notification));

          // Handle navigation based on notification type
          if (remoteMessage.data?.type === 'ride_request') {
            // Navigate to ride details
            // navigation.navigate('RideDetails', { rideId: remoteMessage.data.rideId });
          }
        }
      });

    // Request permission
    requestUserPermission();

    // Cleanup
    return () => {
      unsubscribeForeground();
      unsubscribeNotificationOpen();
    };
  }, [dispatch]);

  // Function to send a test notification
  const sendTestNotification = async () => {
    try {
      const fcmToken = await messaging().getToken();
      // Here you would typically send this token to your backend
      // to send notifications to this device
      console.log('FCM Token:', fcmToken);
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

  return { sendTestNotification };
}; 