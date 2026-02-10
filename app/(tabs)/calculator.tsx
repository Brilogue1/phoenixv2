import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '@/components/gradient-background';
import { ThemedText } from '@/components/themed-text';

export default function CalculatorScreen() {
  const insets = useSafeAreaInsets();

  return (
    <GradientBackground>
      <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
        <ThemedText type="title" style={styles.title}>
          Calculator
        </ThemedText>

        <View style={styles.iframeContainer}>
          <iframe
            src="https://calculator.phoenixdm.co"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '16px',
            }}
          />
        </View>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: 20,
    paddingHorizontal: 20,
    color: '#FFFFFF',
  },
  iframeContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(138, 180, 248, 0.2)',
    backgroundColor: '#0A0A0A',
  },
});
