import { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { validateLogin } from '@/lib/auth';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await validateLogin(email, password);
      
      if (user) {
        // Save user info to AsyncStorage
        await AsyncStorage.setItem('logged_in_user', JSON.stringify(user));
        
        // Set their own profile as the default test_profile for everyone
        await AsyncStorage.setItem('test_profile', JSON.stringify({
          name: user.name,
          email: user.email,
          team: user.team,
          role: user.role,
          title: user.title || '',
          phone: user.phone || '',
          repAirportCode: user.repAirportCode || '',
        }));
        
        // Navigate to home
        router.replace('/(tabs)');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ThemedView
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 20),
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
      >
        <View style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Phoenix DM
          </ThemedText>
          
          <ThemedText style={styles.subtitle}>
            Sign in to continue
          </ThemedText>

          <View style={styles.form}>
            <TextInput
              style={[styles.input, { color: textColor, borderColor: primaryColor }]}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />

            <TextInput
              style={[styles.input, { color: textColor, borderColor: primaryColor }]}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
              onSubmitEditing={handleLogin}
            />

            {error ? (
              <ThemedText style={styles.error}>{error}</ThemedText>
            ) : null}

            <Pressable
              style={[
                styles.button,
                { backgroundColor: primaryColor },
                loading && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>Sign In</ThemedText>
              )}
            </Pressable>
          </View>
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 400,
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  form: {
    gap: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
  },
});
