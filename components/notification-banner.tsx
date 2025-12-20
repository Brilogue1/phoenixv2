import { useState } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { ThemedText } from './themed-text';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationBannerProps {
  updateId: string;
  message: string;
  onDismiss: () => void;
}

export function NotificationBanner({ updateId, message, onDismiss }: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = async () => {
    try {
      // Store dismissed update ID in AsyncStorage
      const dismissedUpdates = await AsyncStorage.getItem('dismissed_updates');
      const dismissed = dismissedUpdates ? JSON.parse(dismissedUpdates) : [];
      dismissed.push(updateId);
      await AsyncStorage.setItem('dismissed_updates', JSON.stringify(dismissed));
      
      setIsVisible(false);
      onDismiss();
    } catch (error) {
      console.error('Error dismissing update:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.icon}>🔔</ThemedText>
        <ThemedText style={styles.message}>{message}</ThemedText>
        <Pressable onPress={handleDismiss} style={styles.dismissButton}>
          <ThemedText style={styles.dismissText}>✕</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 20,
  },
  message: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  dismissButton: {
    padding: 4,
  },
  dismissText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});
