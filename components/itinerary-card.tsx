import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface ItineraryCardProps {
  title: string;
  icon?: string;
  accentColor: 'blue' | 'purple' | 'orange';
  children: React.ReactNode;
}

export function ItineraryCard({ title, accentColor, children }: ItineraryCardProps) {
  const backgroundColor = useThemeColor({}, 'background');
  
  const accentColors = {
    blue: '#007AFF',
    purple: '#8B5CF6',
    orange: '#FF9500',
  };

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={[styles.accentBorder, { backgroundColor: accentColors[accentColor] }]} />
      <View style={styles.content}>
        <ThemedText type="subtitle" style={styles.title}>
          {title}
        </ThemedText>
        {children}
      </View>
    </View>
  );
}

interface CardRowProps {
  label: string;
  value: string;
  valueColor?: string;
}

export function CardRow({ label, value, valueColor }: CardRowProps) {
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({}, 'textSecondary');

  return (
    <View style={styles.row}>
      <ThemedText style={[styles.label, { color: secondaryColor }]}>{label}</ThemedText>
      <ThemedText style={[styles.value, { color: valueColor || textColor }]}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accentBorder: {
    width: 4,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    padding: 16,
    paddingLeft: 24,
  },
  title: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
});
