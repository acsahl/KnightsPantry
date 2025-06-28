import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import exampleProducts from '../assets/exampleProducts.json';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

export default function ClothingPage() {
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
              <TouchableOpacity style={styles.iconBtn} onPress={() => router.replace('/')}> 
                <MaterialIcons name="logout" size={24} color={YELLOW} />
              </TouchableOpacity>
            </View>
          </View>
          {/* Page Content */}
          <FlatList
            data={(exampleProducts as any[]).filter(p => p.category === 'Clothing')}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <ProductCard title={item.title} description={item.description} />
            )}
            style={{ marginTop: 10 }}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
        {/* Bottom Nav Bar */}
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