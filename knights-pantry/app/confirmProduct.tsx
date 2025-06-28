import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import * as FileSystem from 'expo-file-system';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

export default function ConfirmProductPage() {
  const router = useRouter();
  const { title, description, image } = useLocalSearchParams();
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    setSaving(true);
    const item = { title, description, date: new Date().toISOString() };
    const fileUri = FileSystem.documentDirectory + 'donatedItems.json';
    try {
      let items = [];
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(fileUri);
        items = JSON.parse(content);
      }
      items.push(item);
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(items, null, 2));
      Alert.alert('Item added!', 'The item has been added to donatedItems.json.', [
        { text: 'OK', onPress: () => router.replace('/home') }
      ]);
    } catch (e) {
      Alert.alert('Error', 'Could not save item.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TopBar onLogout={() => router.replace('/')} />
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