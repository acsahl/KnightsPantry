import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';

const YELLOW = '#FFD600';

export type TopBarUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

export default function TopBar({ onLogout, user }: { onLogout: () => void, user: TopBarUser }) {
  const { setShowNotificationOverlay } = useCart();
  const displayName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || user?.email || '';
  return (
    <View style={styles.topBar}>
      <View style={styles.userInfo}>
        <View style={styles.avatarCircle}>
          <MaterialIcons name="person" size={28} color={YELLOW} />
        </View>
        <View>
          <Text style={styles.hello}>Hello</Text>
          <Text style={styles.userName}>{displayName}</Text>
        </View>
      </View>
      <View style={styles.topIcons}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => setShowNotificationOverlay(true)}>
          <Feather name="bell" size={24} color={YELLOW} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={onLogout}>
          <MaterialIcons name="logout" size={24} color={YELLOW} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  hello: {
    color: YELLOW,
    fontSize: 14,
    fontWeight: '400',
  },
  userName: {
    color: YELLOW,
    fontSize: 16,
    fontWeight: 'bold',
  },
  topIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginLeft: 16,
  },
}); 