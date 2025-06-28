import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { useCart } from '../context/CartContext';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

export default function ProductDetailPage() {
  const router = useRouter();
  const { title, description, category } = useLocalSearchParams();
  const [search, setSearch] = React.useState('');
  const { addToCart, cartItems } = useCart();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TopBar onLogout={() => router.replace('/')} />
          {/* Search Bar */}
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="What are you looking for?"
              placeholderTextColor="#fff"
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={() => {
                if (search.trim()) router.replace({ pathname: '/home', params: { search } });
              }}
            />
            <Feather name="search" size={20} color={WHITE} style={styles.searchIcon} />
          </View>
          {/* Product Card */}
          <View style={styles.card}>
            <View style={styles.imagePlaceholder}>
              {/* Placeholder for product image/icons */}
              <View style={styles.iconRow}>
                <View style={styles.iconShape} />
              </View>
              <View style={styles.iconRow}>
                <View style={styles.iconShape} />
                <View style={styles.iconShape} />
              </View>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{category}</Text>
              <Text style={styles.description}>{description}</Text>
              <TouchableOpacity style={styles.addToCartBtn} onPress={() => {
                if (cartItems.length >= 5) {
                  Alert.alert('Cart limit reached', 'You can only add up to 5 items.');
                  return;
                }
                addToCart({ title: String(title), description: String(description), category: String(category) });
                router.back();
              }}>
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  card: {
    backgroundColor: '#f3f0f6',
    borderRadius: 14,
    marginTop: 24,
    padding: 0,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    backgroundColor: '#e5e1e7',
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconShape: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#d1c9d9',
    marginHorizontal: 8,
  },
  infoSection: {
    backgroundColor: WHITE,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: '#333',
    marginBottom: 16,
  },
  addToCartBtn: {
    backgroundColor: YELLOW,
    borderRadius: 18,
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  addToCartText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    color: '#fff',
  },
  searchIcon: {
    marginLeft: 10,
  },
}); 