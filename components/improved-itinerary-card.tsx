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
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
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
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  label: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 15,
    color: '#000',
    flex: 1,
    textAlign: 'right',
  },
});
