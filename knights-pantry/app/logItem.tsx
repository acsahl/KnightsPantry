import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons, Feather, Ionicons, FontAwesome } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { useUser } from '../context/UserContext';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

export default function LogItemPage() {
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
          <Text style={styles.heading}>Log your item{"\n"}in two ways.</Text>

          {/* Scan/Manual Input Options */}
          <View style={styles.optionsContainer}>
            <Text style={styles.optionLabel}>If your item has a bar-code</Text>
            <TouchableOpacity style={styles.optionCard} onPress={() => router.push('/scanItems')}>
              <FontAwesome name="cube" size={32} color={BLACK} style={{ marginBottom: 10 }} />
              <Text style={styles.optionCardText}>Scan your items</Text>
            </TouchableOpacity>
            <Text style={styles.optionLabel}>No bar-code? No problem!</Text>
            <TouchableOpacity style={styles.optionCard} onPress={() => router.push('/manualItemInput')}>
              <FontAwesome name="dollar" size={32} color={BLACK} style={{ marginBottom: 10 }} />
              <Text style={styles.optionCardText}>Manual Input</Text>
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
    fontSize: 28,
    fontWeight: '400',
    marginBottom: 24,
    marginTop: 10,
    lineHeight: 32,
  },
  optionsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  optionLabel: {
    color: WHITE,
    fontSize: 13,
    marginBottom: 8,
    marginTop: 8,
    fontWeight: '400',
  },
  optionCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    width: 240,
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCardText: {
    color: BLACK,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
}); 