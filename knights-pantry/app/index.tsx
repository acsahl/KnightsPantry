import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Image source={require('@/assets/images/ucflogo.png')} style={styles.logo} resizeMode="contain" />
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
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.signupBtn} onPress={() => router.push('/signup')}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginBtn}>
            <Text style={styles.loginText}>Log in</Text>
          </TouchableOpacity>
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
    backgroundColor: BLACK,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 16,
  },
  textBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: YELLOW,
    fontSize: 28,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 0,
  },
  italic: {
    fontStyle: 'italic',
    fontWeight: '500',
  },
  accessible: {
    color: YELLOW,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: YELLOW,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '400',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  dot: {
    width: 16,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#333',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: YELLOW,
    marginHorizontal: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  signupBtn: {
    backgroundColor: WHITE,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginRight: 8,
  },
  signupText: {
    color: BLACK,
    fontWeight: '500',
    fontSize: 18,
  },
  loginBtn: {
    backgroundColor: BLACK,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginLeft: 8,
    borderWidth: 2,
    borderColor: WHITE,
  },
  loginText: {
    color: WHITE,
    fontWeight: '500',
    fontSize: 18,
  },
}); 