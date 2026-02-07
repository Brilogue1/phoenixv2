import { ScrollView, StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GradientBackground } from '@/components/gradient-background';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function PayrollScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({}, 'textSecondary');
  const [userTeam, setUserTeam] = useState<string>('');

  useEffect(() => {
    loadUserTeam();
  }, []);

  const loadUserTeam = async () => {
    try {
      const profileStr = await AsyncStorage.getItem('test_profile');
      if (profileStr) {
        const profile = JSON.parse(profileStr);
        setUserTeam(profile.team || '');
      }
    } catch (error) {
      console.error('[PayrollScreen] Error loading user team:', error);
    }
  };

  // Determine which pay structure to show
  const isPTStructure = userTeam === 'KYT5' || userTeam === 'KYT6';

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

        {isPTStructure ? (
          // PT Pay Structure for KYT5 & KYT6
          <>
            {/* Commission Structure - PT */}
            <View style={[styles.card, { backgroundColor }]}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Commission Structure (PT)
              </ThemedText>
              <View style={styles.table}>
                <View style={[styles.tableHeader, { backgroundColor: '#f0f0f0' }]}>
                  <ThemedText style={[styles.tableHeaderText, { flex: 1, color: '#333' }]}>Role</ThemedText>
                  <ThemedText style={[styles.tableHeaderText, { width: 80, textAlign: 'right', color: '#333' }]}>Rate</ThemedText>
                </View>
                <View style={styles.tableRow}>
                  <ThemedText style={[styles.tableCell, { color: secondaryColor }]}>Director</ThemedText>
                  <ThemedText style={[styles.tableCell, styles.rateCell, { color: '#34C759' }]}>4%</ThemedText>
                </View>
                <View style={styles.tableRow}>
                  <ThemedText style={[styles.tableCell, { color: secondaryColor }]}>TO (Team Owner)</ThemedText>
                  <ThemedText style={[styles.tableCell, styles.rateCell, { color: '#34C759' }]}>8%</ThemedText>
                </View>
                <View style={[styles.tableRow, { backgroundColor: '#f9f9f9' }]}>
                  <ThemedText style={[styles.tableCell, styles.boldText, { color: '#333' }]}>Sales Rep</ThemedText>
                  <ThemedText style={[styles.tableCell, styles.rateCell, styles.boldText, { color: '#34C759' }]}>10%</ThemedText>
                </View>
              </View>
              
              <View style={styles.notesSection}>
                <ThemedText style={[styles.noteText, { color: secondaryColor }]}>
                  **All weekly commissions will be paid three (3) Fridays after the corresponding tour week.
                </ThemedText>
                <ThemedText style={[styles.noteText, { color: secondaryColor, marginTop: 8 }]}>
                  **Cancellation Policy: Cancels will be defined as 72 hours after cancelled client updates company of their intent to cancel. Sales representatives will receive option to save cancels prior to finalizing a cancellation at corporate.
                </ThemedText>
              </View>
            </View>

            {/* Sample Payroll Examples - PT */}
            <View style={[styles.card, { backgroundColor }]}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Sample Payroll Calculations
              </ThemedText>
              
              <View style={styles.exampleSection}>
                <ThemedText style={[styles.exampleTitle, { color: textColor }]}>Sales Representative:</ThemedText>
                <ThemedText style={[styles.exampleText, { color: secondaryColor }]}>$10,000 deal</ThemedText>
                <ThemedText style={[styles.exampleText, { color: secondaryColor }]}>-$1,400 CC</ThemedText>
                <ThemedText style={[styles.exampleText, { color: secondaryColor }]}>$8,600 Remaining (Commission is based off this number)</ThemedText>
                <ThemedText style={[styles.exampleResult, { color: '#34C759' }]}>$8,600 @ 10% = $860 Commission</ThemedText>
              </View>

              <View style={styles.exampleSection}>
                <ThemedText style={[styles.exampleTitle, { color: textColor }]}>If a "Club Only" product is written (CC drops to $400):</ThemedText>
                <ThemedText style={[styles.exampleText, { color: secondaryColor }]}>$8,000 deal</ThemedText>
                <ThemedText style={[styles.exampleText, { color: secondaryColor }]}>- $400 CC</ThemedText>
                <ThemedText style={[styles.exampleText, { color: secondaryColor }]}>$7,600 remaining (Commission is based off this number)</ThemedText>
                <ThemedText style={[styles.exampleResult, { color: '#34C759' }]}>$7,600 @ 10% = $760 commission</ThemedText>
              </View>

              <View style={styles.exampleSection}>
                <ThemedText style={[styles.exampleTitle, { color: textColor }]}>Sales Representative deal with a mortgage:</ThemedText>
                <ThemedText style={[styles.exampleText, { color: secondaryColor }]}>$11,500 Total cost for the client</ThemedText>
                <ThemedText style={[styles.exampleText, { color: secondaryColor }]}>-1,500 (DE Financial)</ThemedText>
                <ThemedText style={[styles.exampleText, { color: secondaryColor }]}>= $10,000 to sales</ThemedText>
                <ThemedText style={[styles.exampleText, { color: secondaryColor }]}>- $1,400 CC</ThemedText>
                <ThemedText style={[styles.exampleText, { color: secondaryColor }]}>= $8,600 Remaining</ThemedText>
                <ThemedText style={[styles.exampleText, { color: secondaryColor }]}>x's 10%</ThemedText>
                <ThemedText style={[styles.exampleResult, { color: '#34C759' }]}>$860.00 Commission</ThemedText>
              </View>
            </View>
          </>
        ) : (
          // Original Pay Structure for all other teams
          <>
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
          </>
        )}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
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
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  tableHeaderText: {
    fontWeight: '600',
    fontSize: 14,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    fontWeight: '700',
  },
  notesSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  noteText: {
    fontSize: 12,
    lineHeight: 18,
  },
  exampleSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  exampleTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 8,
  },
  exampleResult: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    marginLeft: 8,
  },
});
