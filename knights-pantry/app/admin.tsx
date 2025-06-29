import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
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
  category: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    ucfId: string;
  };
  status: 'pending' | 'approved' | 'denied';
  createdAt: string;
}

interface GroupedItem {
  title: string;
  description: string;
  quantity: number;
  items: DonatedItem[];
  user: {
    firstName: string;
    lastName: string;
    email: string;
    ucfId: string;
  };
}

type TabType = 'pending' | 'approved' | 'denied';

export default function AdminScreen() {
  const { user, token, setUser, setToken } = useUser();
  const [donatedItems, setDonatedItems] = useState<DonatedItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchUcfId, setSearchUcfId] = useState('');
  const [groupedItems, setGroupedItems] = useState<GroupedItem[]>([]);
  const [adjustedQuantities, setAdjustedQuantities] = useState<{ [key: string]: number }>({});
  const [activeTab, setActiveTab] = useState<TabType>('pending');
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

  // Original render function for all donated items
  const renderItem = ({ item }: { item: DonatedItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={[styles.statusBadge, styles[`status${item.status}`]]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryBadge}>{item.category}</Text>
      </View>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.donorInfo}>
        Donated by: {item.user.firstName} {item.user.lastName}
      </Text>
      <Text style={styles.donorInfo}>
        Email: {item.user.email}
      </Text>
      <Text style={styles.donorInfo}>
        UCF ID: {item.user.ucfId}
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

  // Grouped render function for UCF ID search results
  const renderGroupedItem = ({ item }: { item: GroupedItem }) => {
    const key = `${item.title}-${item.description}`;
    const displayQuantity = adjustedQuantities[key] || item.quantity;
    
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityText}>Qty: {displayQuantity}</Text>
          </View>
        </View>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.donorInfo}>
        Donated by: {item.user.firstName} {item.user.lastName}
      </Text>
      <Text style={styles.donorInfo}>
        Email: {item.user.email}
      </Text>
            <Text style={styles.donorInfo}>
        UCF ID: {item.user.ucfId}
      </Text>
      
      {/* Quantity Controls - Only show for pending items */}
      {activeTab === 'pending' && (
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleDecrease(item)}
          >
            <MaterialIcons name="remove" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.quantityDisplay}>{displayQuantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleIncrease(item)}
          >
            <MaterialIcons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Show simple quantity display for approved/denied items */}
      {activeTab !== 'pending' && (
        <View style={styles.quantityDisplayContainer}>
          <Text style={styles.finalQuantityText}>Quantity: {displayQuantity}</Text>
        </View>
      )}

      {/* Action Buttons - Only show for pending items */}
      {activeTab === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => handleGroupApprove(item)}
          >
            <Text style={styles.approveButtonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.denyButton]}
            onPress={() => handleGroupDeny(item)}
          >
            <Text style={styles.denyButtonText}>Deny</Text>
          </TouchableOpacity>
        </View>
      )}
      </View>
    );
  };

  // Group items by title and description for the same user
  const groupItemsByType = (items: DonatedItem[]) => {
    const grouped: { [key: string]: GroupedItem } = {};
    
    items.forEach(item => {
      const key = `${item.title}-${item.description}`;
      if (grouped[key]) {
        grouped[key].quantity += 1;
        grouped[key].items.push(item);
      } else {
        grouped[key] = {
          title: item.title,
          description: item.description,
          quantity: 1,
          items: [item],
          user: item.user
        };
      }
    });
    
    return Object.values(grouped);
  };

  // Get filtered items based on active tab
  const getFilteredItems = () => {
    return donatedItems.filter(item => item.status === activeTab);
  };

  // Filter and group items when search or tab changes
  useEffect(() => {
    if (searchUcfId.trim()) {
      const filteredItems = donatedItems.filter(item => 
        item.user.ucfId === searchUcfId.trim() && item.status === activeTab
      );
      setGroupedItems(groupItemsByType(filteredItems));
    } else {
      setGroupedItems([]);
    }
  }, [searchUcfId, donatedItems, activeTab]);

  // Handle quantity decrease (visual only)
  const handleDecrease = (groupedItem: GroupedItem) => {
    const key = `${groupedItem.title}-${groupedItem.description}`;
    const currentAdjusted = adjustedQuantities[key] || groupedItem.quantity;
    
    if (currentAdjusted <= 1) {
      Alert.alert('Cannot Decrease', 'Quantity cannot be less than 1. Use Deny to remove the item completely.');
      return;
    }
    
    setAdjustedQuantities(prev => ({
      ...prev,
      [key]: currentAdjusted - 1
    }));
  };

  // Handle quantity increase (visual only)
  const handleIncrease = (groupedItem: GroupedItem) => {
    const key = `${groupedItem.title}-${groupedItem.description}`;
    const currentAdjusted = adjustedQuantities[key] || groupedItem.quantity;
    
    setAdjustedQuantities(prev => ({
      ...prev,
      [key]: currentAdjusted + 1
    }));
  };

  // Handle group approve with adjusted quantity
  const handleGroupApprove = async (groupedItem: GroupedItem) => {
    const key = `${groupedItem.title}-${groupedItem.description}`;
    const adjustedQty = adjustedQuantities[key] || groupedItem.quantity;
    const originalQty = groupedItem.quantity;

    if (adjustedQty > originalQty) {
      Alert.alert('Cannot Approve', `Cannot approve ${adjustedQty} items when only ${originalQty} were donated.`);
      return;
    }

    // Approve the adjusted quantity, deny the rest
    const itemsToApprove = groupedItem.items.slice(0, adjustedQty);
    const itemsToDeny = groupedItem.items.slice(adjustedQty);

    try {
      // Approve the adjusted quantity
      for (const item of itemsToApprove) {
        await handleApprove(item._id);
      }
      
      // Deny the remaining items
      for (const item of itemsToDeny) {
        await handleDeny(item._id);
      }
      
      Alert.alert('Success', `Approved ${adjustedQty} items${itemsToDeny.length > 0 ? `, denied ${itemsToDeny.length}` : ''}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to process items');
    }
  };

  // Handle group deny 
  const handleGroupDeny = async (groupedItem: GroupedItem) => {
    try {
      // Deny all items in this group
      for (const item of groupedItem.items) {
        await handleDeny(item._id);
      }
      Alert.alert('Success', `Denied all ${groupedItem.quantity} items`);
    } catch (error) {
      Alert.alert('Error', 'Failed to deny items');
    }
  };

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
          
          {/* UCF ID Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for UCF ID"
              placeholderTextColor="#999"
              value={searchUcfId}
              onChangeText={setSearchUcfId}
              keyboardType="numeric"
            />
          </View>

          {/* Status Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
              onPress={() => setActiveTab('pending')}
            >
              <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
                Pending
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'approved' && styles.activeTab]}
              onPress={() => setActiveTab('approved')}
            >
              <Text style={[styles.tabText, activeTab === 'approved' && styles.activeTabText]}>
                Approved
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'denied' && styles.activeTab]}
              onPress={() => setActiveTab('denied')}
            >
              <Text style={[styles.tabText, activeTab === 'denied' && styles.activeTabText]}>
                Denied
              </Text>
            </TouchableOpacity>
          </View>
          
          {searchUcfId.trim() ? (
            <FlatList
              data={groupedItems}
              renderItem={renderGroupedItem}
              keyExtractor={(item) => `${item.title}-${item.description}`}
              style={styles.list}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No pending donations found for this UCF ID
                  </Text>
                </View>
              }
            />
          ) : (
            <FlatList
              data={getFilteredItems()}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              style={styles.list}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No {activeTab} items found
                  </Text>
                </View>
              }
            />
          )}
          
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quantityContainer: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    gap: 16,
  },
  quantityButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityDisplay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    minWidth: 30,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#007bff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  quantityDisplayContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  finalQuantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
}); 