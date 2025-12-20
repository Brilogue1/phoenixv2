import { StyleSheet, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GradientBackground } from '@/components/gradient-background';

const CALCULATOR_URL = 'https://calculator.phoenixdm.co';

export default function CalculatorScreen() {
  const insets = useSafeAreaInsets();

  // On web, render iframe directly
  if (Platform.OS === 'web') {
    return (
      <GradientBackground>
        <View style={{ flex: 1, paddingTop: insets.top }}>
          <iframe
            src={CALCULATOR_URL}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="Timeshare Calculator"
          />
        </View>
      </GradientBackground>
    );
  }

  // On mobile, show message to use web version or implement native calculator
  return (
    <GradientBackground>
      <View style={{ flex: 1, padding: 20, paddingTop: insets.top + 20 }}>
        <iframe
          src={CALCULATOR_URL}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title="Timeshare Calculator"
        />
      </View>
    </GradientBackground>
  );
}
