import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface ProductCardProps {
  title: string;
  description: string;
  category?: string;
}

export default function ProductCard({ title, description, category }: ProductCardProps) {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push({ pathname: '/productDetail', params: { title, description, category } })} activeOpacity={0.8}>
      <View style={styles.card}>
        <View style={styles.leftSection}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.rightSection}>
          {/* Placeholder for icons */}
          <View style={styles.iconRow}>
            <View style={styles.iconPlaceholder} />
            <View style={styles.iconPlaceholder} />
          </View>
          <View style={styles.iconRow}>
            <View style={styles.iconPlaceholder} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 18,
    padding: 16,
    alignItems: 'center',
    minHeight: 70,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: '#333',
  },
  rightSection: {
    width: 60,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    marginBottom: 4,
    justifyContent: 'flex-end',
  },
  iconPlaceholder: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#e5e1e7',
    marginLeft: 6,
  },
}); 