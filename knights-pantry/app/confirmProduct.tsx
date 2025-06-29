import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { useUser } from '../context/UserContext';
import API_BASE_URL from '../config/api';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

export default function ConfirmProductPage() {
  const router = useRouter();
  const { title, description, image } = useLocalSearchParams();
  const [saving, setSaving] = useState(false);
  const { user, token } = useUser();

  const handleConfirm = async () => {
    if (!user?._id || !token) {
      Alert.alert('Error', 'Please log in to donate items');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/donated-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: String(title),
          description: String(description),
          userId: user._id,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Thank you for your donation! It will be reviewed by an admin.', [
          { text: 'OK', onPress: () => router.replace('/home') }
        ]);
      } else {
        const data = await response.json();
        Alert.alert('Error', data.error || 'Failed to submit donation');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TopBar user={user || {}} onLogout={() => router.replace('/login')} />
        <Text style={styles.heading}>Is this your item?</Text>
        {image ? <Image source={{ uri: String(image) }} style={styles.productImage} /> : null}
        <Text style={styles.productTitle}>{title}</Text>
        <Text style={styles.productDesc}>{description}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} disabled={saving}>
            <Text style={styles.confirmText}>{saving ? 'Saving...' : 'Yes'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.noBtn} onPress={() => router.replace('/scanItems')} disabled={saving}>
            <Text style={styles.noText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomNav />
    </SafeAreaView>
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
    alignItems: 'center',
  },
  heading: {
    color: WHITE,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    marginTop: 10,
    lineHeight: 32,
    textAlign: 'center',
  },
  productImage: {
    width: 160,
    height: 160,
    borderRadius: 8,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  productTitle: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 8,
    textAlign: 'center',
  },
  productDesc: {
    color: WHITE,
    fontSize: 16,
    marginBottom: 18,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    gap: 18,
  },
  confirmBtn: {
    backgroundColor: YELLOW,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginRight: 8,
  },
  confirmText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 18,
  },
  noBtn: {
    backgroundColor: '#444',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginLeft: 8,
  },
  noText: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: 18,
  },
}); 