import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import TopBar from '../components/TopBar';
import API_BASE_URL from '../config/api';

interface DonatedItem {
  _id: string;
  title: string;
  description: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  status: 'pending' | 'approved' | 'denied';
  createdAt: string;
}

export default function AdminScreen() {
  const { user, token, setUser, setToken } = useUser();
  const [donatedItems, setDonatedItems] = useState<DonatedItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchDonatedItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/donated-items`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDonatedItems(data);
      } else {
        Alert.alert('Error', 'Failed to fetch donated items');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
    }
  };

  const handleApprove = async (itemId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/donated-items/${itemId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        Alert.alert('Success', 'Item approved');
        fetchDonatedItems(); // Refresh the list
      } else {
        Alert.alert('Error', 'Failed to approve item');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
    }
  };

  const handleDeny = async (itemId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/donated-items/${itemId}/deny`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        Alert.alert('Success', 'Item denied');
        fetchDonatedItems(); // Refresh the list
      } else {
        Alert.alert('Error', 'Failed to deny item');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDonatedItems();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDonatedItems();
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
      <Text style={styles.donorInfo}>
        Donated by: {item.user.firstName} {item.user.lastName} ({item.user.email})
      </Text>
      <Text style={styles.dateInfo}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      {item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleApprove(item._id)}
          >
            <Text style={styles.approveButtonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.denyButton]}
            onPress={() => handleDeny(item._id)}
          >
            <Text style={styles.denyButtonText}>Deny</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    router.replace('/');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <TopBar user={user || {}} onLogout={handleLogout} />
        <View style={styles.content}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Manage Donated Items</Text>
          
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
                <Text style={styles.emptyText}>No donated items found</Text>
              </View>
            }
          />
          
          {/* Home Button at Bottom */}
          <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/home')}>
            <MaterialIcons name="home" size={24} color="#fff" />
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
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
  donorInfo: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  dateInfo: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#28a745',
  },
  approveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  denyButton: {
    backgroundColor: '#dc3545',
  },
  denyButtonText: {
    color: 'white',
    fontWeight: '600',
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
  },
  homeButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 