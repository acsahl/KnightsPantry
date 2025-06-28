import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../scripts/firebase'; // or wherever your firebase.js is located


export default function SignUpScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [ucfId, setUcfId] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('✅ Account created!');
      router.replace('/home'); // Navigate to home on success
    } catch (error: any) {
      alert('❌ ' + error.message);
    }
  };
  
  return (
    <>
      <Stack.Screen options={{ title: 'Sign Up', headerShown: true }} />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.form}>
            <Text style={styles.label}>First Name</Text>
            <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="First Name" placeholderTextColor="#aaa" />
            <Text style={styles.label}>Last Name</Text>
            <TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Last Name" placeholderTextColor="#aaa" />
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#aaa" keyboardType="email-address" autoCapitalize="none" />
            <Text style={styles.label}>UCF ID</Text>
            <TextInput style={styles.input} value={ucfId} onChangeText={setUcfId} placeholder="UCF ID" placeholderTextColor="#aaa" />
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" placeholderTextColor="#aaa" secureTextEntry />
          </View>
          <TouchableOpacity style={styles.signupBtn} onPress={handleSignUp}>

            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const YELLOW = '#FFD600';
const BLACK = '#000';
const WHITE = '#fff';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  label: {
    color: YELLOW,
    fontSize: 16,
    marginBottom: 4,
    marginTop: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#222',
    color: WHITE,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  signupBtn: {
    backgroundColor: YELLOW,
    borderRadius: 24,
    paddingVertical: 16,
    marginHorizontal: 32,
    marginBottom: 40,
    alignItems: 'center',
  },
  signupText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 18,
  },
}); 