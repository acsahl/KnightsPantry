import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ScrollView, Modal } from 'react-native';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useRouter, Stack } from 'expo-router';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

// Function to generate dynamic time slots based on current time
const generateTimeSlots = () => {
  const now = new Date();
  const times = ['ASAP'];
  
  // Get current hour and minutes
  let currentHour = now.getHours();
  let currentMinutes = now.getMinutes();
  
  // Knights Pantry hours: 9 AM to 5 PM
  if (currentHour < 9) {
    currentHour = 9;
    currentMinutes = 0;
  } else if (currentHour >= 17) {
    // If after 5 PM, show next day 9 AM
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    const timeString = tomorrow.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }) + ' (Tomorrow)';
    times.push(timeString);
    return times;
  }
  
  // Round up to the next 30-minute interval
  if (currentMinutes > 0) {
    if (currentMinutes <= 30) {
      currentMinutes = 30;
    } else {
      currentHour += 1;
      currentMinutes = 0;
    }
  }
  
  // Generate 2 more time slots (30-minute intervals)
  for (let i = 0; i < 2; i++) {
    const timeDate = new Date();
    timeDate.setHours(currentHour);
    timeDate.setMinutes(currentMinutes);
    
    // Make sure it's within operating hours
    if (currentHour < 17) {
      const timeString = timeDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      times.push(timeString);
    } else {
      // If we can't generate more times today, add tomorrow slots
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9 + Math.floor(i/2), (i % 2) * 30, 0, 0);
      const timeString = tomorrow.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }) + ' (Tomorrow)';
      times.push(timeString);
    }
    
    // Add 30 minutes for next slot
    currentMinutes += 30;
    if (currentMinutes >= 60) {
      currentMinutes = 0;
      currentHour += 1;
    }
  }
  
  return times;
};

// Generate time options for the schedule picker (9 AM to 5 PM, 30-minute intervals)
const generateScheduleOptions = () => {
  const options = [];
  for (let hour = 9; hour < 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeDate = new Date();
      timeDate.setHours(hour, minute, 0, 0);
      const timeString = timeDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      options.push(timeString);
    }
  }
  return options;
};

export default function CartPage() {
  const { cartItems, removeFromCart, setSelectedPickupTime } = useCart();
  const { user } = useUser();
  const [times, setTimes] = useState(generateTimeSlots());
  const [selectedTime, setSelectedTime] = useState(times[0]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleOptions] = useState(generateScheduleOptions());
  const router = useRouter();
  
  // Create the 3 main buttons
  const mainButtons = [...times, 'Schedule'];
  
  // Initialize global pickup time on mount
  useEffect(() => {
    setSelectedPickupTime(times[0]);
  }, []);

  // Update time slots every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimes = generateTimeSlots();
      setTimes(newTimes);
      // If selected time is no longer available, select the first one
      if (!newTimes.includes(selectedTime) && selectedTime !== 'Schedule') {
        setSelectedTime(newTimes[0]);
        setSelectedPickupTime(newTimes[0]);
      }
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [selectedTime]);
  
  const handleTimeSelect = (time: string) => {
    if (time === 'Schedule') {
      setShowScheduleModal(true);
    } else {
      setSelectedTime(time);
      setSelectedPickupTime(time);
    }
  };
  
  const handleScheduleSelect = (time: string) => {
    setSelectedTime(time);
    setSelectedPickupTime(time);
    setShowScheduleModal(false);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <TopBar onLogout={() => {}} user={user || {}} />
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Text style={styles.heading}>Confirm items{"\n"}for <Text style={styles.bold}>checkout.</Text></Text>
            <View style={styles.cartBox}>
              <FlatList
                data={cartItems}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.cartItem}>
                    <View style={styles.cartItemContent}>
                      <View style={styles.cartItemHeader}>
                        <Text style={styles.cartItemTitle}>{item.title}</Text>
                        <TouchableOpacity 
                          style={styles.removeButton}
                          onPress={() => removeFromCart(index)}
                        >
                          <Text style={styles.removeButtonText}>×</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.cartItemDesc}>{item.description}</Text>
                    </View>
                  </View>
                )}
                ListEmptyComponent={<Text style={{ color: '#888', padding: 12 }}>No items in cart.</Text>}
                scrollEnabled={false}
              />
            </View>
            <Text style={styles.selectTime}>Select a time</Text>
            <View style={styles.timeContainer}>
              {mainButtons.map((time) => {
                const isScheduleButton = time === 'Schedule';
                const isCustomTimeSelected = !times.includes(selectedTime) && selectedTime !== 'ASAP';
                const isSelected = selectedTime === time || (isCustomTimeSelected && isScheduleButton) || (showScheduleModal && isScheduleButton);
                const displayText = isScheduleButton && isCustomTimeSelected ? selectedTime : time;
                
                return (
                  <TouchableOpacity
                    key={time}
                    style={[styles.timeBtn, isSelected && styles.timeBtnSelected]}
                    onPress={() => handleTimeSelect(time)}
                  >
                    <Text style={[styles.timeBtnText, isSelected && styles.timeBtnTextSelected]}>
                      {displayText}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={() => router.replace({
              pathname: '/checkoutConfirmation',
              params: { selectedTime }
            })}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        
        {/* Schedule Time Picker Modal */}
        <Modal
          visible={showScheduleModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowScheduleModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Pickup Time</Text>
              <Text style={styles.modalSubtitle}>Knights Pantry Hours: 9:00 AM - 5:00 PM</Text>
              
              <ScrollView style={styles.modalTimeList}>
                {scheduleOptions.filter((time) => {
                  const now = new Date();
                  const currentHour = now.getHours();
                  const currentMinutes = now.getMinutes();
                  
                  // Parse the time string to get hour and minute
                  const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;
                  const match = time.match(timeRegex);
                  if (!match) return false;
                  
                  let hour = parseInt(match[1]);
                  const minute = parseInt(match[2]);
                  const period = match[3].toUpperCase();
                  
                  // Convert to 24-hour format
                  if (period === 'PM' && hour !== 12) hour += 12;
                  if (period === 'AM' && hour === 12) hour = 0;
                  
                  // Only show future times
                  return hour > currentHour || (hour === currentHour && minute > currentMinutes);
                }).map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={styles.modalTimeBtn}
                    onPress={() => handleScheduleSelect(time)}
                  >
                    <Text style={styles.modalTimeBtnText}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <TouchableOpacity 
                style={styles.modalCloseBtn}
                onPress={() => setShowScheduleModal(false)}
              >
                <Text style={styles.modalCloseBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        <BottomNav />
      </SafeAreaView>
    </>
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
  cartItemContent: {
    flex: 1,
  },
  cartItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  cartItemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    flex: 1,
  },
  cartItemDesc: {
    fontSize: 13,
    color: '#333',
  },
  removeButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeButtonText: {
    color: BLACK,
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  selectTime: {
    color: WHITE,
    fontSize: 18,
    marginBottom: 10,
    marginTop: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  timeBtn: {
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 18,
    marginRight: 12,
    marginBottom: 12,
    minWidth: 70,
    alignItems: 'center',
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BLACK,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalTimeList: {
    maxHeight: 300,
    marginBottom: 20,
  },
  modalTimeBtn: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalTimeBtnDisabled: {
    backgroundColor: '#e0e0e0',
    opacity: 0.5,
  },
  modalTimeBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: BLACK,
  },
  modalTimeBtnTextDisabled: {
    color: '#999',
  },
  modalCloseBtn: {
    backgroundColor: '#ff4444',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: WHITE,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
}); 