import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { useRideContext } from '../../components/RideProvider';
import RideStatusComponent from '../../components/RideStatusComponent';
import { FontAwesome } from '@expo/vector-icons';

interface RideHistory {
  id: string;
  date: string;
  status: string;
  fare: string;
  pickup: string;
  dropoff: string;
}

export default function PassengerScreen() {
  const { rides, loading, error, updateRideStatus } = useRideContext();
  const [selectedRide, setSelectedRide] = useState<any | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Mock ride history data
  const rideHistory: RideHistory[] = [
    {
      id: '1',
      date: '2024-03-27',
      status: 'completed',
      fare: '25.00',
      pickup: '123 Main St',
      dropoff: '456 Park Ave',
    },
    {
      id: '2',
      date: '2024-03-26',
      status: 'completed',
      fare: '30.00',
      pickup: '789 Oak St',
      dropoff: '321 Pine Ave',
    },
  ];

  const handleRequestRide = async () => {
    try {
      // In a real app, you would get pickup/dropoff locations from a map
      const newRide = {
        id: Date.now().toString(),
        status: 'requested',
        fare: '25.00',
        eta: '5 mins',
        pickup: {
          address: 'Current Location',
          coordinates: { latitude: 0, longitude: 0 },
        },
        dropoff: {
          address: 'Destination',
          coordinates: { latitude: 0, longitude: 0 },
        },
      };
      setSelectedRide(newRide);
      await updateRideStatus(newRide.id, 'requested');
    } catch (err) {
      console.error('Error requesting ride:', err);
    }
  };

  const renderRideHistoryItem = ({ item }: { item: RideHistory }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyDate}>{item.date}</Text>
        <Text style={[
          styles.historyStatus,
          { color: item.status === 'completed' ? '#4CAF50' : '#f44336' }
        ]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <View style={styles.historyDetails}>
        <View style={styles.historyLocation}>
          <FontAwesome name="map-marker" size={16} color="#666" />
          <Text style={styles.historyText}>{item.pickup}</Text>
        </View>
        <View style={styles.historyLocation}>
          <FontAwesome name="flag-checkered" size={16} color="#666" />
          <Text style={styles.historyText}>{item.dropoff}</Text>
        </View>
        <View style={styles.historyFare}>
          <FontAwesome name="money" size={16} color="#666" />
          <Text style={styles.historyText}>${item.fare}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Request a Ride</Text>
        <Text style={styles.subtitle}>Track your ride in real-time</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <View style={styles.content}>
          {selectedRide ? (
            <RideStatusComponent isDriver={false} />
          ) : (
            <>
              <View style={styles.requestSection}>
                <TouchableOpacity
                  style={styles.requestButton}
                  onPress={handleRequestRide}
                >
                  <Text style={styles.requestButtonText}>Request a Ride</Text>
                </TouchableOpacity>
              </View>

              {/* Ride History Section */}
              <View style={styles.historySection}>
                <View style={styles.historyHeader}>
                  <Text style={styles.sectionTitle}>Ride History</Text>
                  <TouchableOpacity onPress={() => setShowHistory(!showHistory)}>
                    <FontAwesome 
                      name={showHistory ? 'chevron-up' : 'chevron-down'} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
                {showHistory && (
                  <FlatList
                    data={rideHistory}
                    renderItem={renderRideHistoryItem}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                    style={styles.historyList}
                  />
                )}
              </View>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  content: {
    flex: 1,
  },
  loader: {
    marginTop: 20,
  },
  error: {
    color: '#f44336',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  requestSection: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  requestButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  requestButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historySection: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  historyList: {
    marginTop: 10,
  },
  historyItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  historyStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  historyDetails: {
    marginTop: 10,
  },
  historyLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    gap: 10,
  },
  historyFare: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    gap: 10,
  },
  historyText: {
    fontSize: 14,
    color: '#666',
  },
}); 