import { StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

interface ImprovedCardProps {
  title: string;
  accentColor: string;
  children: React.ReactNode;
}

export function ImprovedCard({ title, accentColor, children }: ImprovedCardProps) {
  return (
    <View style={[styles.card, { borderLeftColor: accentColor, borderLeftWidth: 4 }]}>
      <ThemedText type="subtitle" style={[styles.cardTitle, { color: accentColor }]}>
        {title}
      </ThemedText>
      {children}
    </View>
  );
}

interface CardDetailRowProps {
  label: string;
  value: string | undefined;
  icon?: string;
}

export function CardDetailRow({ label, value, icon }: CardDetailRowProps) {
  if (!value || value === 'N/A') return null;

  return (
    <View style={styles.detailRow}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.value}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A1A', // Dark gray instead of white
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(138, 180, 248, 0.2)', // Phoenix blue border
  },
  cardTitle: {
    marginBottom: 16,
    fontSize: 20,
    fontWeight: '700',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(138, 180, 248, 0.1)', // Subtle Phoenix blue divider
  },
  label: {
    fontSize: 14,
    color: '#9BA1A6', // Muted gray text
    flex: 1,
  },
  value: {
    fontSize: 15,
    color: '#FFFFFF', // White text
    flex: 1,
    textAlign: 'right',
  },
});
