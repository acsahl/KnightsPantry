import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useUser } from '../context/UserContext';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

export default function CheckoutConfirmation() {
  const { selectedTime } = useLocalSearchParams<{ selectedTime: string }>();
  const { user } = useUser();
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar user={user || {}} onLogout={() => {}} />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
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
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BLACK,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    backgroundColor: BLACK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
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
    lineHeight: 32,
    textAlign: 'center',
  },
}); 