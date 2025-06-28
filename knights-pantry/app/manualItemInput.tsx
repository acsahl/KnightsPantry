import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

export default function ManualItemInput() {
  const [item, setItem] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!item || !description) {
      Alert.alert('Please fill in all fields.');
      return;
    }
    const log = { item, description, date: new Date().toISOString() };
    const fileUri = FileSystem.documentDirectory + 'loggedItems.json';
    try {
      let logs = [];
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(fileUri);
        logs = JSON.parse(content);
      }
      logs.push(log);
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(logs, null, 2));
      Alert.alert('Item logged!');
      setItem(''); setDescription('');
      router.replace('/home');
    } catch (e) {
      Alert.alert('Error saving item.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TopBar onLogout={() => {}} />
        <Text style={styles.heading}>Manual Input</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Item</Text>
          <TextInput style={styles.input} value={item} onChangeText={setItem} placeholder="Value" placeholderTextColor="#aaa" />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Value" placeholderTextColor="#aaa" multiline numberOfLines={3} />
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