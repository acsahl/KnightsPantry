import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TestScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">Test Page</ThemedText>
        <ThemedText type="subtitle">Use this page to test your components</ThemedText>
        
        {/* Add your test components here */}
        <ThemedView style={styles.testSection}>
          <ThemedText type="defaultSemiBold">Your Component Here:</ThemedText>
          <View style={styles.componentPlaceholder}>
            <Text>Add your TSX component here to preview it</Text>
          </View>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  testSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  componentPlaceholder: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginTop: 8,
    alignItems: 'center',
  },
}); 