import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { useDispatch, useSelector } from 'react-redux';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { RootState } from '../store/store';
import {
  setPickup,
  setDropoff,
  setSelectedCarType,
  requestRide,
  setError,
} from '../store/slices/rideSlice';
import { getCurrentLocation, requestLocationPermission } from '../utils/location';
import { Button } from '../../components/ui/Button';
import { RideCard } from '../../components/RideCard';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const { width } = Dimensions.get('window');

export default function RideScreen() {
  const dispatch = useDispatch();
  const { pickup, dropoff, selectedCarType, isLoading, error } = useSelector(
    (state: RootState) => state.ride
  );
  const [region, setRegion] = useState({
    latitude: -26.2041, // Default to Johannesburg
    longitude: 28.0473,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    setupLocation();
  }, []);

  const setupLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      try {
        const location = await getCurrentLocation();
        setRegion({
          ...region,
          latitude: location.latitude,
          longitude: location.longitude,
        });
      } catch (error) {
        console.error('Error getting location:', error);
      }
    }
  };

  const handleRequestRide = async () => {
    if (!pickup || !dropoff || !selectedCarType) {
      dispatch(setError('Please select pickup, dropoff, and car type'));
      return;
    }
    await dispatch(requestRide());
  };

  return (
    <StyledView className="flex-1">
      <MapView
        style={{ width, height: width }}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {pickup && (
          <Marker
            coordinate={{
              latitude: pickup.latitude,
              longitude: pickup.longitude,
            }}
            title="Pickup"
            pinColor="#007AFF"
          />
        )}
        {dropoff && (
          <Marker
            coordinate={{
              latitude: dropoff.latitude,
              longitude: dropoff.longitude,
            }}
            title="Dropoff"
            pinColor="#FF3B30"
          />
        )}
      </MapView>

      <ScrollView className="flex-1 bg-background">
        <StyledView className="p-4">
          <StyledView className="space-y-4">
            <StyledView>
              <StyledText className="text-sm font-medium text-gray-700 mb-1">
                Pickup Location
              </StyledText>
              <GooglePlacesAutocomplete
                placeholder="Enter pickup location"
                onPress={(data, details = null) => {
                  if (details) {
                    dispatch(
                      setPickup({
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                        address: data.description,
                      })
                    );
                  }
                }}
                query={{
                  key: 'YOUR_GOOGLE_API_KEY',
                  language: 'en',
                  location: `${region.latitude},${region.longitude}`,
                }}
                fetchDetails={true}
                styles={{
                  container: {
                    flex: 0,
                    backgroundColor: 'transparent',
                  },
                  listView: {
                    backgroundColor: 'white',
                    borderRadius: 8,
                  },
                  row: {
                    backgroundColor: 'white',
                    padding: 13,
                    height: 'auto',
                  },
                }}
              />
            </StyledView>

            <StyledView>
              <StyledText className="text-sm font-medium text-gray-700 mb-1">
                Dropoff Location
              </StyledText>
              <GooglePlacesAutocomplete
                placeholder="Enter dropoff location"
                onPress={(data, details = null) => {
                  if (details) {
                    dispatch(
                      setDropoff({
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                        address: data.description,
                      })
                    );
                  }
                }}
                query={{
                  key: 'YOUR_GOOGLE_API_KEY',
                  language: 'en',
                  location: `${region.latitude},${region.longitude}`,
                }}
                fetchDetails={true}
                styles={{
                  container: {
                    flex: 0,
                    backgroundColor: 'transparent',
                  },
                  listView: {
                    backgroundColor: 'white',
                    borderRadius: 8,
                  },
                  row: {
                    backgroundColor: 'white',
                    padding: 13,
                    height: 'auto',
                  },
                }}
              />
            </StyledView>

            <StyledView>
              <StyledText className="text-lg font-semibold text-gray-900 mb-2">
                Select Car Type
              </StyledText>
              <StyledView className="space-y-2">
                {carTypes.map((car) => (
                  <RideCard
                    key={car.id}
                    carType={car.name}
                    price={car.price}
                    estimatedTime="5 min"
                    image={car.image}
                    onSelect={() => dispatch(setSelectedCarType(car))}
                    isSelected={selectedCarType?.id === car.id}
                  />
                ))}
              </StyledView>
            </StyledView>

            {error && (
              <StyledText className="text-danger text-sm">{error}</StyledText>
            )}

            <Button
              title="Request Ride"
              onPress={handleRequestRide}
              loading={isLoading}
              disabled={isLoading || !pickup || !dropoff || !selectedCarType}
              className="mt-4"
            />
          </StyledView>
        </StyledView>
      </ScrollView>
    </StyledView>
  );
} 