import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter, Stack } from 'expo-router';

const YELLOW = '#FFD600';
const BLACK = '#000';
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const BOTTOM_HEIGHT = 170;

export default function IndexScreen() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.root}>
        <View style={styles.topCard}>
          <View style={styles.centerContent}>
            <Image source={require('../assets/images/ucflogo.png')} style={styles.logo} />
            <Text style={styles.title}>
              Making <Text style={styles.titleItalic}>Knights Pantry</Text>{'\n'}
              <Text style={styles.titleBold}>accessible</Text>
            </Text>
            <Text style={styles.subtitle}>
              with a shopping{`\ncatalog to meet every\nstudents' need`}
            </Text>
            <View style={styles.dotsRow}>
              <View style={styles.dotActive} />
              <View style={styles.dotInactive} />
              <View style={styles.dotInactive} />
            </View>
          </View>
        </View>
        <View style={styles.bottomCard}>
          <TouchableOpacity style={styles.signupBtn} onPress={() => router.push('/signup')}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/login')}>
            <Text style={styles.loginText}>Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: YELLOW,
    width: '100%',
    height: '100%',
  },
  topCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: BOTTOM_HEIGHT,
    backgroundColor: BLACK,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 18,
  },
  title: {
    color: YELLOW,
    fontSize: 30,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 0,
    lineHeight: 36,
  },
  titleItalic: {
    fontStyle: 'italic',
    fontWeight: '400',
    color: YELLOW,
  },
  titleBold: {
    fontWeight: 'bold',
    color: YELLOW,
    fontSize: 32,
  },
  subtitle: {
    color: YELLOW,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 18,
    lineHeight: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 0,
  },
  dotActive: {
    width: 22,
    height: 8,
    borderRadius: 4,
    backgroundColor: YELLOW,
    marginHorizontal: 4,
  },
  dotInactive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#444',
    marginHorizontal: 4,
  },
  bottomCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: BOTTOM_HEIGHT,
    backgroundColor: YELLOW,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 24,
    zIndex: 2,
  },
  signupBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    marginRight: 12,
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
    paddingVertical: 18,
    alignItems: 'center',
    marginLeft: 12,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
}); 