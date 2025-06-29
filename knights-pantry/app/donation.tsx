import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons, Feather, Ionicons, FontAwesome } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { useUser } from '../context/UserContext';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function DonationPage() {
  const router = useRouter();
  const { user } = useUser();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Top Bar */}
          <TopBar onLogout={() => router.replace('/')} user={user || {}} />

          {/* Heading */}
          <Text style={styles.heading}>
            Make a real <Text style={styles.bold}>difference</Text> for{"\n"}UCF students.
          </Text>

          {/* Donation Options */}
          <View style={styles.donationOptions}>
            <TouchableOpacity style={styles.donationCard} onPress={() => router.push('/logItem')}>
              <FontAwesome name="cube" size={38} color={BLACK} style={{ marginBottom: 10 }} />
              <Text style={styles.donationCardTitle}>Item</Text>
              <Text style={styles.donationCardSubtitle}>donation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.donationCard} onPress={() => router.push('/manualDonation')}>
              <FontAwesome name="dollar" size={38} color={BLACK} style={{ marginBottom: 10 }} />
              <Text style={styles.donationCardTitle}>Monetary</Text>
              <Text style={styles.donationCardSubtitle}>donation</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Nav Bar */}
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
    paddingBottom: 0,
    justifyContent: 'flex-start',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  hello: {
    color: YELLOW,
    fontSize: 14,
    fontWeight: '400',
  },
  userName: {
    color: YELLOW,
    fontSize: 16,
    fontWeight: 'bold',
  },
  topIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginLeft: 16,
  },
  heading: {
    color: WHITE,
    fontSize: 32,
    fontWeight: '400',
    marginBottom: 32,
    marginTop: 10,
    lineHeight: 38,
  },
  bold: {
    fontWeight: 'bold',
    color: WHITE,
  },
  donationOptions: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  donationCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    width: '90%',
    maxWidth: 320,
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  donationCardTitle: {
    color: BLACK,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  donationCardSubtitle: {
    color: BLACK,
    fontSize: 15,
    fontWeight: '400',
  },
}); 