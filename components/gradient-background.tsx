import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function GradientBackground({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  const colors: [string, string] = colorScheme === 'dark' 
    ? [Colors.dark.primary, Colors.dark.secondary]
    : [Colors.light.primary, Colors.light.secondary];

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
