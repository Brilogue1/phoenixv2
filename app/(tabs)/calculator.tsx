import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '@/components/gradient-background';
import { ThemedText } from '@/components/themed-text';
import { PhoenixColors } from '@/constants/theme';

export default function CalculatorScreen() {
  const insets = useSafeAreaInsets();

  return (
    <GradientBackground>
      <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
        {/* Header */}
        <ThemedText type="title" style={styles.title}>
          Calculator
        </ThemedText>

        {/* WebView Calculator */}
        <View style={styles.webViewContainer}>
          <WebView
            source={{ uri: 'https://calculator.phoenix.co' }}
            style={styles.webView}
            startInLoadingState={true}
            scalesPageToFit={true}
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
    color: PhoenixColors.white,
  },
  webViewContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: PhoenixColors.cardBorder,
    backgroundColor: PhoenixColors.darkGray,
  },
  webView: {
    flex: 1,
    backgroundColor: PhoenixColors.darkGray,
  },
});
