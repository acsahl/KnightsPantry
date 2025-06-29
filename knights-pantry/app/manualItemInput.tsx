import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';
import API_BASE_URL from '../config/api';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

export default function ManualItemInput() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();
  const { user, token } = useUser();

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    if (!user?._id || !token) {
      Alert.alert('Error', 'Please log in to donate items');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/donated-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          userId: user._id,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Thank you for your donation! It will be reviewed by an admin.');
        setTitle('');
        setDescription('');
        router.replace('/home');
      } else {
        const data = await response.json();
        Alert.alert('Error', data.error || 'Failed to submit donation');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TopBar user={user || {}} onLogout={() => router.replace('/login')} />
        <Text style={styles.heading}>Donate an Item</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Item Title</Text>
          <TextInput 
            style={styles.input} 
            value={title} 
            onChangeText={setTitle} 
            placeholder="e.g., Textbooks, Clothing, Food" 
            placeholderTextColor="#aaa" 
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            value={description} 
            onChangeText={setDescription} 
            placeholder="Describe the item you're donating..." 
            placeholderTextColor="#aaa" 
            multiline 
            numberOfLines={4} 
          />
        </View>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Donation</Text>
        </TouchableOpacity>
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
  },
  heading: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    color: WHITE,
    fontSize: 16,
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: WHITE,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: BLACK,
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: YELLOW,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 18,
  },
}); 