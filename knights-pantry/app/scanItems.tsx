import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

export default function ScanItemsPage() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.userInfo}>
              <View style={styles.avatarCircle}>
                <MaterialIcons name="person" size={28} color={YELLOW} />
              </View>
              <View>
                <Text style={styles.hello}>Hello</Text>
                <Text style={styles.userName}>Acsah Lukose</Text>
              </View>
            </View>
            <View style={styles.topIcons}>
              <View style={styles.iconBtn}>
                <Feather name="bell" size={24} color={YELLOW} />
              </View>
              <TouchableOpacity style={styles.iconBtn} onPress={() => router.replace('/')}>
                <MaterialIcons name="logout" size={24} color={YELLOW} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Heading */}
          <Text style={styles.heading}>Scan your{"\n"}item</Text>

          {/* Gray Rectangle Placeholder */}
          <View style={styles.scannerPlaceholder} />
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
  scannerPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
}); 