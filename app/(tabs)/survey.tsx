import { StyleSheet, Pressable, View, Platform } from 'react-native';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GradientBackground } from '@/components/gradient-background';
import { useState } from 'react';

const SURVEY_URL = 'https://api.leadconnectorhq.com/widget/survey/9EVIB06Uu5C5nt002xwV';

export default function SurveyScreen() {
  const insets = useSafeAreaInsets();
  const [isOpening, setIsOpening] = useState(false);

  // On web, render iframe directly
  if (Platform.OS === 'web') {
    return (
      <GradientBackground>
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <iframe
            src={SURVEY_URL}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="Owner Survey"
            allow="camera; microphone; geolocation"
          />
        </View>
      </GradientBackground>
    );
  }

  // On mobile, use WebBrowser
  const openSurvey = async () => {
    try {
      setIsOpening(true);
      await WebBrowser.openBrowserAsync(SURVEY_URL, {
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
        controlsColor: '#5B6FED',
      });
    } catch (error) {
      console.error('Error opening survey:', error);
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <GradientBackground>
      <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
        <View style={styles.content}>
          {/* Phoenix Logo */}
          <Image
            source={require('@/assets/images/phoenix-logo.png')}
            style={styles.logo}
            contentFit="contain"
          />
          
          <ThemedText type="title" style={styles.title}>
            Owner Survey
          </ThemedText>
          
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              isOpening && styles.buttonDisabled,
            ]}
            onPress={openSurvey}
            disabled={isOpening}
          >
            <ThemedText style={styles.buttonText}>
              {isOpening ? 'Opening Survey...' : 'Open Survey'}
            </ThemedText>
          </Pressable>

          <View style={styles.infoBox}>
            <ThemedText style={styles.infoText}>
              📋 The survey will open in a new window
            </ThemedText>
            <ThemedText style={styles.infoText}>
              ⏱️ Takes approximately 2-3 minutes
            </ThemedText>
          </View>
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Platform.OS === 'web' ? 0 : 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 24,
  },
  title: {
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#5B6FED',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  infoBox: {
    marginTop: 48,
    padding: 20,
    backgroundColor: 'rgba(91, 111, 237, 0.05)',
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
