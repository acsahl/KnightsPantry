import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('@/assets/images/ucffountain.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Gray overlay */}
        <View style={styles.grayOverlay} />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
        <View style={styles.loginContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Log in with your email and password</Text>
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="example@gmail.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={styles.input}
              placeholder="••••••"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            
            <TouchableOpacity style={styles.signInButton} onPress={() => router.push('/home')}>
              <Text style={styles.signInButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: screenWidth,
    height: screenHeight,
  },
  grayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(64, 64, 64, 0.6)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 50,
  },
  loginContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 0,
    width: screenWidth * 0.85,
    maxWidth: 400,
  },
  headerContainer: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
  },
  inputContainer: {
    padding: 20,
    paddingTop: 15,
    paddingBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  signInButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  signInButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
  },
});
