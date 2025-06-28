import React from 'react';
import { View, Text, StatusBar, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

const YELLOW = '#FFD600';
const BLACK = '#000';

export default function IndexScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: BLACK }}>
      <StatusBar backgroundColor={BLACK} barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/images/ucflogo.png')} style={styles.logo} />
        </View>
        <Text style={styles.title}>Making <Text style={styles.titleItalic}>Knights Pantry</Text> <Text style={styles.titleBold}>accessible</Text></Text>
        <Text style={styles.subtitle}>with a shopping{"\n"}catalog to meet every{"\n"}students' need</Text>
        <View style={styles.dotsRow}>
          <View style={styles.dotActive} />
          <View style={styles.dotInactive} />
        </View>
        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.signupBtn} onPress={() => router.push('/signup')}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/login')}>
            <Text style={styles.loginText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  logoContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
  },
  title: {
    color: YELLOW,
    fontSize: 32,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 8,
  },
  titleItalic: {
    fontStyle: 'italic',
    fontWeight: '500',
    color: YELLOW,
  },
  titleBold: {
    fontWeight: 'bold',
    color: YELLOW,
  },
  subtitle: {
    color: YELLOW,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  dotActive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: YELLOW,
    borderWidth: 2,
    borderColor: BLACK,
    marginHorizontal: 4,
  },
  dotInactive: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#222',
    borderWidth: 2,
    borderColor: BLACK,
    marginHorizontal: 4,
  },
  bottomSection: {
    width: '100%',
    backgroundColor: YELLOW,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingVertical: 32,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  signupBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginRight: 8,
  },
  signupText: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginBtn: {
    flex: 1,
    backgroundColor: BLACK,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginLeft: 8,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
}); 