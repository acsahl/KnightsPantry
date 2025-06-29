import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Dimensions, FlatList, ScrollView } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import exampleProducts from '../assets/exampleProducts.json';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { useUser } from '../context/UserContext';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';
const SCREEN_HEIGHT = Dimensions.get('window').height;

type Category = { label: string; icon: keyof typeof FontAwesome.glyphMap };

const categories: Category[] = [
  { label: 'Toiletries', icon: 'bath' },
  { label: 'Home Goods', icon: 'home' },
  { label: 'School Supplies', icon: 'pencil' },
  { label: 'Clothing', icon: 'shopping-bag' },
  { label: 'Other', icon: 'ellipsis-h' },
  { label: 'Food', icon: 'cutlery' },
];

type Product = { title: string; category: string; description: string };

export default function HomePage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [search, setSearch] = useState(params.search ? String(params.search) : '');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { user } = useUser();

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
          <TopBar onLogout={() => router.replace('/')} user={user || {}} />

          {/* Search Bar */}
          <View style={styles.searchBarWrapper}>
            <View style={styles.searchBar}>
              <TextInput
                style={styles.searchInput}
                placeholder="What are you looking for?"
                placeholderTextColor="#fff"
                value={search}
                onChangeText={setSearch}
              />
              <Feather name="search" size={26} color={WHITE} style={styles.searchIcon} />
            </View>
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
            <ScrollView 
              style={styles.scrollView} 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Categories */}
              <View style={styles.categoriesGrid}>
                {categories.map((cat, idx) => (
                  <View key={cat.label} style={styles.categoryCol}>
                    <TouchableOpacity style={styles.categoryBtn} onPress={() => {
                      if (cat.label === 'Toiletries') router.push('/toiletries');
                      else if (cat.label === 'Home Goods') router.push('/homeGoods');
                      else if (cat.label === 'School Supplies') router.push('/schoolSupplies');
                      else if (cat.label === 'Clothing') router.push('/clothing');
                      else if (cat.label === 'Other') router.push('/other');
                      else if (cat.label === 'Food') router.push('/food');
                    }}>
                      <View style={styles.categoryIconCircle}>
                        <FontAwesome name={cat.icon} size={32} color={BLACK} />
                      </View>
                      <Text style={styles.categoryLabel}>{cat.label}</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Donation Card */}
              <View style={styles.donateCard}>
                <Text style={styles.donateTitle}>
                  Interested in <Text style={styles.donateBold}>Donating?</Text>
                </Text>
                <Text style={styles.donateDesc}>
                  Help make an impact by clicking on the gift icon below and donating.
                </Text>
              </View>

              {/* Admin Button - Only show for admin users */}
              {user?.isAdmin && (
                <TouchableOpacity style={styles.adminButton} onPress={() => router.push('/admin')}>
                  <MaterialIcons name="admin-panel-settings" size={24} color="#fff" />
                  <Text style={styles.adminButtonText}>Admin Dashboard</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
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
    paddingHorizontal: 0,
    paddingTop: 0,
    justifyContent: 'flex-start',
  },
  searchBarWrapper: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 32,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: WHITE,
    borderRadius: 28,
    paddingHorizontal: 24,
    height: 54,
    width: '88%',
    maxWidth: 400,
  },
  searchInput: {
    flex: 1,
    color: WHITE,
    fontSize: 19,
    fontWeight: '400',
  },
  searchIcon: {
    marginLeft: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 36,
    rowGap: 24,
    columnGap: 0,
  },
  categoryCol: {
    width: '33%',
    alignItems: 'center',
    marginBottom: 18,
  },
  categoryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryLabel: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  donateCard: {
    backgroundColor: WHITE,
    borderRadius: 28,
    padding: 28,
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 38,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  donateTitle: {
    fontSize: 32,
    fontWeight: '400',
    color: BLACK,
    marginBottom: 8,
  },
  donateBold: {
    fontWeight: 'bold',
    color: BLACK,
    fontSize: 36,
  },
  donateDesc: {
    color: BLACK,
    fontSize: 17,
    marginTop: 6,
  },
  adminButton: {
    backgroundColor: '#007bff',
    borderRadius: 28,
    padding: 20,
    marginHorizontal: 18,
    marginTop: 16,
    marginBottom: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for BottomNav
  },
}); 