import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';
import API_BASE_URL from '../config/api';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

const CATEGORIES = ['Food', 'Clothing', 'School Supplies', 'Toiletries', 'Other'];

export default function ManualDonation() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Other');
  const router = useRouter();
  const { user, token } = useUser();

  const handleSignUp = async () => {
    if (!title) {
      Alert.alert('Please provide an item title.');
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
          description: description || undefined,
          category: selectedCategory,
          userId: user._id,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Thank you for your donation! It will be reviewed by an admin.');
        setTitle('');
        setDescription('');
        setSelectedCategory('Other');
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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
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
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategoryButton
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.selectedCategoryButtonText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description (Optional)</Text>
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
        <TouchableOpacity style={styles.submitBtn} onPress={handleSignUp}>
          <Text style={styles.submitText}>Submit Donation</Text>
        </TouchableOpacity>
      </ScrollView>
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
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  categoryButton: {
    backgroundColor: WHITE,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: '48%',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedCategoryButton: {
    backgroundColor: YELLOW,
  },
  categoryButtonText: {
    color: BLACK,
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedCategoryButtonText: {
    color: BLACK,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
}); 