import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Dimensions, FlatList } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import exampleProducts from '../assets/exampleProducts.json';

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
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

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
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navBtn}>
            <View style={styles.navIconCircle}>
              <Ionicons name="home" size={22} color={BLACK} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={() => router.push('/donation')}>
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