import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { useUser } from '../context/UserContext';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import API_BASE_URL from '../config/api';

interface DonatedItem {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'denied';
  createdAt: string;
}

export default function MyDonationsScreen() {
  const { user, token } = useUser();
  const [donatedItems, setDonatedItems] = useState<DonatedItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyDonations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/my-donated-items`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDonatedItems(data);
      } else {
        Alert.alert('Error', 'Failed to fetch your donations');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMyDonations();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const renderItem = ({ item }: { item: DonatedItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={[styles.statusBadge, styles[`status${item.status}`]]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.dateInfo}>
        Donated on: {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <TopBar user={user || {}} onLogout={() => {}} />
        <View style={styles.content}>
          <Text style={styles.title}>My Donations</Text>
          <Text style={styles.subtitle}>Track your donated items</Text>
          
          <FlatList
            data={donatedItems}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            style={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>You haven't donated any items yet</Text>
                <Text style={styles.emptySubtext}>Start by donating an item from the donation page</Text>
              </View>
            }
          />
        </View>
        <BottomNav />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statuspending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statusapproved: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusdenied: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  dateInfo: {
    fontSize: 12,
    color: '#888',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
}); 