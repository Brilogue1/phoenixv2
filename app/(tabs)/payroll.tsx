import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientBackground } from '@/components/gradient-background';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function PayrollScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({}, 'textSecondary');

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 20) + 60,
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
      >
        <ThemedText type="title" style={[styles.title, { color: '#fff' }]}>
          Sales Representative
        </ThemedText>
        <ThemedText type="title" style={[styles.title, { color: '#fff' }]}>
          Compensation Plan
        </ThemedText>

        {/* Commission Structure */}
        <View style={[styles.card, { backgroundColor }]}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Commission Structure
          </ThemedText>
          <View style={styles.table}>
            <View style={[styles.tableHeader, { backgroundColor: '#f0f0f0' }]}>
              <ThemedText style={[styles.tableHeaderText, { flex: 1, color: '#333' }]}>Net Volume</ThemedText>
              <ThemedText style={[styles.tableHeaderText, { width: 80, textAlign: 'right', color: '#333' }]}>Rate</ThemedText>
            </View>
            <View style={styles.tableRow}>
              <ThemedText style={[styles.tableCell, { color: secondaryColor }]}>$0 - $6,489</ThemedText>
              <ThemedText style={[styles.tableCell, styles.rateCell, { color: '#34C759' }]}>8%</ThemedText>
            </View>
            <View style={styles.tableRow}>
              <ThemedText style={[styles.tableCell, { color: secondaryColor }]}>$6,850 - $7,500</ThemedText>
              <ThemedText style={[styles.tableCell, styles.rateCell, { color: '#34C759' }]}>10%</ThemedText>
            </View>
            <View style={styles.tableRow}>
              <ThemedText style={[styles.tableCell, { color: secondaryColor }]}>$7,501 - $10,500</ThemedText>
              <ThemedText style={[styles.tableCell, styles.rateCell, { color: '#34C759' }]}>12%</ThemedText>
            </View>
            <View style={styles.tableRow}>
              <ThemedText style={[styles.tableCell, { color: secondaryColor }]}>$10,501 - $15,500</ThemedText>
              <ThemedText style={[styles.tableCell, styles.rateCell, { color: '#34C759' }]}>14%</ThemedText>
            </View>
            <View style={styles.tableRow}>
              <ThemedText style={[styles.tableCell, { color: secondaryColor }]}>$15,501 - $20,000</ThemedText>
              <ThemedText style={[styles.tableCell, styles.rateCell, { color: '#34C759' }]}>16%</ThemedText>
            </View>
            <View style={[styles.tableRow, { backgroundColor: '#f9f9f9' }]}>
              <ThemedText style={[styles.tableCell, styles.boldText, { color: '#333' }]}>$20,001 & UP</ThemedText>
              <ThemedText style={[styles.tableCell, styles.rateCell, styles.boldText, { color: '#34C759' }]}>20%</ThemedText>
            </View>
          </View>
        </View>

        {/* Monthly Bonus Program */}
        <View style={[styles.card, { backgroundColor }]}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Monthly Bonus Program
          </ThemedText>
          <View style={styles.table}>
            <View style={[styles.tableHeader, { backgroundColor: '#f0f0f0' }]}>
              <ThemedText style={[styles.tableHeaderText, { flex: 1, color: '#333' }]}>Net Volume</ThemedText>
              <ThemedText style={[styles.tableHeaderText, { width: 80, textAlign: 'right', color: '#333' }]}>Bonus</ThemedText>
            </View>
            <View style={styles.tableRow}>
              <ThemedText style={[styles.tableCell, { color: secondaryColor }]}>$75,000 - $104,999</ThemedText>
              <ThemedText style={[styles.tableCell, styles.rateCell, { color: '#FF9500' }]}>2%</ThemedText>
            </View>
            <View style={styles.tableRow}>
              <ThemedText style={[styles.tableCell, { color: secondaryColor }]}>$105,000 - $129,999</ThemedText>
              <ThemedText style={[styles.tableCell, styles.rateCell, { color: '#FF9500' }]}>4%</ThemedText>
            </View>
            <View style={styles.tableRow}>
              <ThemedText style={[styles.tableCell, { color: secondaryColor }]}>$130,000 - $149,999</ThemedText>
              <ThemedText style={[styles.tableCell, styles.rateCell, { color: '#FF9500' }]}>6%</ThemedText>
            </View>
            <View style={styles.tableRow}>
              <ThemedText style={[styles.tableCell, { color: secondaryColor }]}>$150,000 - $179,999</ThemedText>
              <ThemedText style={[styles.tableCell, styles.rateCell, { color: '#FF9500' }]}>8%</ThemedText>
            </View>
            <View style={[styles.tableRow, { backgroundColor: '#f9f9f9' }]}>
              <ThemedText style={[styles.tableCell, styles.boldText, { color: '#333' }]}>$180,000 & UP</ThemedText>
              <ThemedText style={[styles.tableCell, styles.rateCell, styles.boldText, { color: '#FF9500' }]}>10%</ThemedText>
            </View>
          </View>
        </View>

        {/* Payment Terms */}
        <View style={[styles.card, { backgroundColor }]}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Payment Terms
          </ThemedText>
          <View style={styles.bulletList}>
            <ThemedText style={[styles.bulletText, { color: textColor }]}>
              • Weekly commissions paid four Fridays after the corresponding tour week
            </ThemedText>
            <ThemedText style={[styles.bulletText, { color: textColor }]}>
              • Weekly processing cutoff: Monday, 12:00 p.m. (EST)
            </ThemedText>
            <ThemedText style={[styles.bulletText, { color: textColor }]}>
              • Check payment increases commission rate by 3%
            </ThemedText>
            <ThemedText style={[styles.bulletText, { color: textColor }]}>
              • Self-generated tours (no marketing services) increase rate by 4%
            </ThemedText>
          </View>
        </View>

        {/* 20% Commission Note */}
        <View style={[styles.card, { backgroundColor: '#FFF3CD', borderLeftWidth: 4, borderLeftColor: '#FF9500' }]}>
          <ThemedText style={[styles.noteTitle, { color: '#856404' }]}>
            20% Commission Requirement
          </ThemedText>
          <ThemedText style={[styles.noteText, { color: '#856404' }]}>
            For deals written at $20,001 to obtain the 20% commission, the sale must NET $20,001. 
            For example, if there are 4 paid off regular transfer deeds, the deal must be written for 
            $25,601 to obtain the 20% commission on the sale.
          </ThemedText>
        </View>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    marginBottom: 16,
  },
  table: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 12,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    flex: 1,
    fontSize: 14,
  },
  rateCell: {
    width: 80,
    textAlign: 'right',
    fontWeight: '600',
  },
  boldText: {
    fontWeight: 'bold',
  },
  bulletList: {
    gap: 12,
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 20,
  },
  noteTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
