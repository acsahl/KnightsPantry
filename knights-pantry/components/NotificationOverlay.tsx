import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useCart } from '../context/CartContext';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

export default function NotificationOverlay() {
  const { 
    showNotificationOverlay, 
    setShowNotificationOverlay, 
    cartItems, 
    selectedPickupTime 
  } = useCart();

  return (
    <Modal
      visible={showNotificationOverlay}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowNotificationOverlay(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Header with close button */}
          <View style={styles.header}>
            <Text style={styles.title}>Checkout Information</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowNotificationOverlay(false)}
            >
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>

          {/* Pickup Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup Time</Text>
            <Text style={styles.pickupTime}>{selectedPickupTime}</Text>
          </View>

          {/* Cart Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items to Pick Up</Text>
            {cartItems.length > 0 ? (
              <FlatList
                data={cartItems}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={({ item }) => (
                  <View style={styles.cartItem}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDesc}>{item.description}</Text>
                  </View>
                )}
                style={styles.itemsList}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <Text style={styles.emptyText}>No items in cart</Text>
            )}
          </View>

          {/* Additional Info */}
          <View style={styles.section}>
            <Text style={styles.infoText}>
              Remember to bring your UCF ID when picking up your items.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BLACK,
  },
  closeButton: {
    backgroundColor: '#ff4444',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: WHITE,
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: BLACK,
    marginBottom: 10,
  },
  pickupTime: {
    fontSize: 20,
    color: YELLOW,
    backgroundColor: BLACK,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  itemsList: {
    maxHeight: 200,
  },
  cartItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BLACK,
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 