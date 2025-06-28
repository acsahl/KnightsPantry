import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { useCart } from '../context/CartContext';
import { useRouter } from 'expo-router';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

const times = ['ASAP', '11:30 AM', '12:00 PM'];

export default function CartPage() {
  const { cartItems } = useCart();
  const [selectedTime, setSelectedTime] = useState(times[0]);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TopBar onLogout={() => {}} />
        <Text style={styles.heading}>Confirm items{"\n"}for <Text style={styles.bold}>checkout.</Text></Text>
        <View style={styles.cartBox}>
          <FlatList
            data={cartItems}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Text style={styles.cartItemTitle}>{item.title}</Text>
                <Text style={styles.cartItemDesc}>{item.description}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={{ color: '#888', padding: 12 }}>No items in cart.</Text>}
          />
        </View>
        <Text style={styles.selectTime}>Select a time</Text>
        <View style={styles.timeRow}>
          {times.map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.timeBtn, selectedTime === time && styles.timeBtnSelected]}
              onPress={() => setSelectedTime(time)}
            >
              <Text style={[styles.timeBtnText, selectedTime === time && styles.timeBtnTextSelected]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.replace('/checkoutConfirmation')}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BLACK,
  },
  container: {
    flex: 1,
    backgroundColor: BLACK,
    paddingHorizontal: 20,
    paddingTop: 16,
    justifyContent: 'flex-start',
  },
  heading: {
    color: WHITE,
    fontSize: 36,
    fontWeight: '400',
    marginBottom: 18,
    marginTop: 10,
    lineHeight: 40,
  },
  bold: {
    fontWeight: 'bold',
    color: WHITE,
    fontSize: 36,
  },
  cartBox: {
    backgroundColor: '#f3f0f6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 18,
  },
  cartItem: {
    marginBottom: 16,
  },
  cartItemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 2,
  },
  cartItemDesc: {
    fontSize: 13,
    color: '#333',
  },
  selectTime: {
    color: WHITE,
    fontSize: 18,
    marginBottom: 10,
    marginTop: 8,
  },
  timeRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timeBtn: {
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 22,
    marginRight: 12,
  },
  timeBtnSelected: {
    backgroundColor: YELLOW,
  },
  timeBtnText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 16,
  },
  timeBtnTextSelected: {
    color: BLACK,
  },
  checkoutBtn: {
    backgroundColor: YELLOW,
    borderRadius: 20,
    alignSelf: 'flex-end',
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginTop: 8,
  },
  checkoutText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 18,
  },
}); 