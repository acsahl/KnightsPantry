import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image source={require('@/assets/images/ucflogo.png')} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.title}>
              Making <Text style={styles.italic}>Knights{"\n"}Pantry</Text>
            </Text>
            <Text style={styles.accessible}>accessible</Text>
            <Text style={styles.subtitle}>
              with a shopping{"\n"}catalog to meet every{"\n"}students' need
            </Text>
          </View>
          <View style={styles.dotsContainer}>
            <View style={styles.dotActive} />
            <View style={styles.dot} />
          </View>
        </View>
        <View style={styles.buttonSection}>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.signupBtn} onPress={() => router.push('/signup')}>
              <Text style={styles.signupText}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/login')}>
              <Text style={styles.loginText}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    backgroundColor: YELLOW,
  },
  content: {
    flex: 0.88,
    backgroundColor: BLACK,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 130,
    height: 130,
    tintColor: YELLOW,
  },
  textBlock: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: YELLOW,
    fontSize: 32,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 0,
    lineHeight: 38,
  },
  italic: {
    fontStyle: 'italic',
    fontWeight: '500',
  },
  accessible: {
    color: YELLOW,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    color: YELLOW,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#444',
    marginHorizontal: 6,
  },
  dotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: YELLOW,
    marginHorizontal: 6,
  },
  buttonSection: {
    flex: 0.12,
    backgroundColor: YELLOW,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  signupBtn: {
    backgroundColor: WHITE,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    flex: 0.45,
    alignItems: 'center',
  },
  signupText: {
    color: BLACK,
    fontWeight: '600',
    fontSize: 16,
  },
  loginBtn: {
    backgroundColor: BLACK,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    flex: 0.45,
    alignItems: 'center',
  },
  loginText: {
    color: WHITE,
    fontWeight: '600',
    fontSize: 16,
  },
}); 