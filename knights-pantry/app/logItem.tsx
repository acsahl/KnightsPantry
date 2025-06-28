import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons, Feather, Ionicons, FontAwesome } from '@expo/vector-icons';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

export default function LogItemPage() {
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
              <TouchableOpacity style={styles.iconBtn}>
                <Feather name="bell" size={24} color={YELLOW} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <MaterialIcons name="logout" size={24} color={YELLOW} />
              </TouchableOpacity>
            </View>
          </View>

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
            <TouchableOpacity style={styles.optionCard}>
              <FontAwesome name="dollar" size={32} color={BLACK} style={{ marginBottom: 10 }} />
              <Text style={styles.optionCardText}>Manual Input</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Nav Bar (same as home) */}
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
          <TouchableOpacity style={styles.navBtn}>
            <View style={styles.navIconCircle}>
              <Ionicons name="cart" size={22} color={BLACK} />
            </View>
          </TouchableOpacity>
        </View>
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
    borderRadius: 12,
    width: 180,
    alignItems: 'center',
    paddingVertical: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  optionCardText: {
    color: BLACK,
    fontSize: 16,
    fontWeight: 'bold',
  },
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
}); 