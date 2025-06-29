import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import ProductCard from '../components/ProductCard';
import exampleProducts from '../assets/exampleProducts.json';
import { useUser } from '../context/UserContext';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

export default function SchoolSuppliesPage() {
  const router = useRouter();
  const { user } = useUser();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Top Bar */}
          <TopBar onLogout={() => router.replace('/')} userName={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || user?.email || ''} />
          {/* Page Content */}
          <FlatList
            data={(exampleProducts as any[]).filter(p => p.category === 'School Supplies')}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <ProductCard title={item.title} description={item.description} category={item.category} />
            )}
            style={{ marginTop: 10 }}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
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
}); 