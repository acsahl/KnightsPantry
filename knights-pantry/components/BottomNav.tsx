import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';

const YELLOW = '#FFD600';
const BLACK = '#000';

export default function BottomNav() {
  const router = useRouter();
  const { cartItems } = useCart();
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navBtn} onPress={() => router.replace('/home')}>
        <View style={styles.navIconCircle}>
          <Ionicons name="home" size={22} color={BLACK} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navBtn} onPress={() => router.replace('/donation')}>
        <View style={styles.navIconCircle}>
          <Ionicons name="gift" size={22} color={BLACK} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navBtn} onPress={() => router.replace('/cart')}>
        <View style={styles.navIconCircle}>
          <Ionicons name="cart" size={22} color={BLACK} />
          {cartItems.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartItems.length}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 28,
    marginHorizontal: 16,
    marginBottom: 16,
    height: 64,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  navBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFD600',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 13,
  },
}); 