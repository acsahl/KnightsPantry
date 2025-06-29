import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

export default function ManualDonation() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { user } = useUser();

  const handleSubmit = async () => {
    if (!name || !amount || !email) {
      Alert.alert('Please fill in all required fields.');
      return;
    }
    const donation = { name, amount, email, message, date: new Date().toISOString() };
    const fileUri = FileSystem.documentDirectory + 'donations.json';
    try {
      let donations = [];
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(fileUri);
        donations = JSON.parse(content);
      }
      donations.push(donation);
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(donations, null, 2));
      Alert.alert('Thank you for your donation!');
      setName(''); setAmount(''); setEmail(''); setMessage('');
      router.replace('/home');
    } catch (e) {
      Alert.alert('Error saving donation.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TopBar onLogout={() => {}} userName={`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || user?.email || ''} />
        <Text style={styles.heading}>Manual Input</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Value" placeholderTextColor="#aaa" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput style={styles.input} value={amount} onChangeText={setAmount} placeholder="Value" placeholderTextColor="#aaa" keyboardType="numeric" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Value" placeholderTextColor="#aaa" keyboardType="email-address" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Message</Text>
          <TextInput style={[styles.input, styles.textArea]} value={message} onChangeText={setMessage} placeholder="Value" placeholderTextColor="#aaa" multiline numberOfLines={3} />
        </View>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
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