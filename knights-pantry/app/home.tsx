import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Dimensions, FlatList } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import exampleProducts from '../assets/exampleProducts.json';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';
const SCREEN_HEIGHT = Dimensions.get('window').height;

type Category = { label: string; icon: keyof typeof FontAwesome.glyphMap };

const categories: Category[] = [
  { label: 'Toiletries', icon: 'archive' },
  { label: 'Home Goods', icon: 'archive' },
  { label: 'School Supplies', icon: 'archive' },
  { label: 'Clothing', icon: 'archive' },
  { label: 'Other', icon: 'archive' },
];

type Product = { title: string; category: string; description: string };

export default function HomePage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [search, setSearch] = useState(params.search ? String(params.search) : '');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (params.search && !search) {
      setSearch(String(params.search));
    }
  }, [params.search]);

  useEffect(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      setFilteredProducts([]);
      return;
    }
    setFilteredProducts(
      (exampleProducts as Product[]).filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      )
    );
  }, [search]);

  return (
    <>
      <Stack.Screen options={{ title: 'Home', headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Top Bar */}
          <TopBar onLogout={() => router.replace('/')} />

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="What are you looking for?"
              placeholderTextColor="#fff"
              value={search}
              onChangeText={setSearch}
            />
            <Feather name="search" size={20} color={WHITE} style={styles.searchIcon} />
          </View>

          {/* Product List (search results) */}
          {search.trim() ? (
            <FlatList
              data={filteredProducts}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={({ item }) => (
                <ProductCard title={item.title} description={item.description} />
              )}
              style={{ marginTop: 10 }}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <>
              {/* Categories */}
              <View style={styles.categoriesRow}>
                {categories.slice(0, 3).map((cat, idx) => (
                  <TouchableOpacity key={cat.label} style={styles.categoryBtn} onPress={() => {
                    if (cat.label === 'Toiletries') router.push('/toiletries');
                    else if (cat.label === 'Home Goods') router.push('/homeGoods');
                    else if (cat.label === 'School Supplies') router.push('/schoolSupplies');
                    else if (cat.label === 'Clothing') router.push('/clothing');
                    else if (cat.label === 'Other') router.push('/other');
                  }}>
                    <View style={styles.categoryIconCircle}>
                      <FontAwesome name={cat.icon} size={20} color={BLACK} />
                    </View>
                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.categoriesRow}>
                {categories.slice(3).map((cat, idx) => (
                  <TouchableOpacity key={cat.label} style={styles.categoryBtn} onPress={() => {
                    if (cat.label === 'Toiletries') router.push('/toiletries');
                    else if (cat.label === 'Home Goods') router.push('/homeGoods');
                    else if (cat.label === 'School Supplies') router.push('/schoolSupplies');
                    else if (cat.label === 'Clothing') router.push('/clothing');
                    else if (cat.label === 'Other') router.push('/other');
                  }}>
                    <View style={styles.categoryIconCircle}>
                      <FontAwesome name={cat.icon} size={20} color={BLACK} />
                    </View>
                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Donation Card */}
              <View style={styles.donateCard}>
                <Text style={styles.donateTitle}>Interested in <Text style={styles.donateBold}>Donating?</Text></Text>
                <Text style={styles.donateDesc}>Help make an impact by clicking on the gift icon below and donating.</Text>
              </View>
            </>
          )}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: WHITE,
    borderRadius: 24,
    paddingHorizontal: 18,
    marginBottom: 20,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: WHITE,
    fontSize: 15,
  },
  searchIcon: {
    marginLeft: 8,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryBtn: {
    alignItems: 'center',
    width: 80,
  },
  categoryIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryLabel: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  donateCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 28,
    marginTop: 18,
    marginBottom: 10,
    minHeight: SCREEN_HEIGHT * 0.19,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  donateTitle: {
    fontSize: 26,
    fontWeight: '400',
    color: BLACK,
    marginBottom: 8,
  },
  donateBold: {
    fontWeight: 'bold',
    color: BLACK,
    fontSize: 28,
  },
  donateDesc: {
    color: BLACK,
    fontSize: 16,
    marginTop: 2,
  },
}); 