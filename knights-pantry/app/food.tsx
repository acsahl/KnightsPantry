import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import ProductCard from '../components/ProductCard';
import exampleProducts from '../assets/exampleProducts.json';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

export default function FoodPage() {
  const router = useRouter();
  const foodProducts = (exampleProducts as any[]).filter(p => p.category === 'Food');

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TopBar onLogout={() => router.replace('/')} />
          <Text style={styles.heading}>Food</Text>
          <FlatList
            data={foodProducts}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item }) => (
              <ProductCard title={item.title} description={item.description} />
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    marginTop: 10,
    lineHeight: 32,
  },
}); 