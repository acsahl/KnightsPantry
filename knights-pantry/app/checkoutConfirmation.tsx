import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

export default function CheckoutConfirmation() {
  const { selectedTime } = useLocalSearchParams<{ selectedTime: string }>();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TopBar onLogout={() => {}} />
        <View style={styles.iconContainer}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={48} color={BLACK} />
          </View>
        </View>
        <Text style={styles.thankYouText}>
          Thank you for using the{"\n"}
          Knights Pantry{"\n"}
          app! Be sure to come to{"\n"}
          pick up your items at{"\n"}
          {selectedTime || 'your confirmed time'}.
        </Text>
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
  iconContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: YELLOW,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  thankYouText: {
    color: WHITE,
    fontSize: 24,
    fontWeight: '400',
    marginTop: 12,
    lineHeight: 32,
    textAlign: 'center',
  },
}); 