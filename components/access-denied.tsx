import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from './themed-text';
import { GradientBackground } from './gradient-background';
import { useAuth } from '@/hooks/use-auth';

export function AccessDenied() {
  const { logout, user } = useAuth();

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Access Denied
          </ThemedText>
          
          <ThemedText style={styles.message}>
            Your email ({user?.email}) is not authorized to access this app.
          </ThemedText>
          
          <ThemedText style={styles.message}>
            Please contact your administrator if you believe this is an error.
          </ThemedText>
          
          <Pressable onPress={logout} style={styles.logoutButton}>
            <ThemedText style={styles.logoutText}>
              Logout
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 32,
    maxWidth: 400,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    color: '#FF3B30',
    marginBottom: 24,
    textAlign: 'center',
  },
  message: {
    color: '#333',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: '#5B6FED',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 16,
    minWidth: 120,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
