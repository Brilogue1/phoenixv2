import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GradientBackground } from '@/components/gradient-background';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { fetchSales, type SaleTransaction } from '@/lib/google-sheets';
import { isExecutiveRole, isTeamLeadRole } from '@/lib/role-utils';

interface RepSummary {
  repName: string;
  repEmail: string;
  team: string;
  totalCommission: number;
  transactions: SaleTransaction[];
}

interface TeamSummary {
  team: string;
  totalCollected: number;
  totalNet: number;
  reps: RepSummary[];
}

export default function SalesScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [sales, setSales] = useState<SaleTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(''); // Format: 'October 2025'
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  useEffect(() => {
    loadProfile();
    loadSalesData();
    
    // Set up auto-refresh every 2 minutes (120000 ms)
    const autoRefreshInterval = setInterval(() => {
      console.log('[SalesScreen] Auto-refresh triggered (2 min interval)');
      loadSalesData();
    }, 120000); // 2 minutes
    
    return () => {
      clearInterval(autoRefreshInterval); // Clean up interval when component unmounts
    };
  }, []);

  const loadProfile = async () => {
    const saved = await AsyncStorage.getItem('test_profile');
    if (saved) {
      setSelectedEmployee(JSON.parse(saved));
    }
  };

  // Parse date string to Date object
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    
    // Try parsing Google Sheets Date(YYYY,M,D) format
    const googleDateMatch = dateStr.match(/Date\((\d+),(\d+),(\d+)\)/);
    if (googleDateMatch) {
      const year = parseInt(googleDateMatch[1]);
      const month = parseInt(googleDateMatch[2]); // Already 0-indexed in Google Sheets
      const day = parseInt(googleDateMatch[3]);
      return new Date(year, month, day);
    }
    
    // Try parsing comma-separated format (e.g., "2025,9,9")
    const commaParts = dateStr.trim().split(',');
    if (commaParts.length === 3) {
      const year = parseInt(commaParts[0]);
      const month = parseInt(commaParts[1]);
      const day = parseInt(commaParts[2]);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
    
    // Try parsing as-is first
    let date = new Date(dateStr);
    if (!isNaN(date.getTime())) return date;
    
    // Try parsing MM/DD/YY or MM/DD format
    const parts = dateStr.trim().split('/');
    if (parts.length === 3) {
      // MM/DD/YY format (e.g., "10/9/25")
      let [month, day, year] = parts.map(p => parseInt(p));
      // Handle 2-digit year
      if (year < 100) {
        year += 2000;
      }
      date = new Date(year, month - 1, day);
      if (!isNaN(date.getTime())) return date;
    } else if (parts.length === 2) {
      // MM/DD format (e.g., "11/5") - assume current year 2025
      let [month, day] = parts.map(p => parseInt(p));
      date = new Date(2025, month - 1, day);
      if (!isNaN(date.getTime())) return date;
    }
    
    return null;
  };

  const loadSalesData = async () => {
    setLoading(true);
    try {
      console.log('[SalesScreen] Loading sales data...');
      const salesData = await fetchSales();
      console.log(`[SalesScreen] Loaded ${salesData.length} sales records`);
      console.log('[SalesScreen] First few sales:', salesData.slice(0, 3));
      setSales(salesData);
      
      // Extract unique months from sales data
      const months = new Set<string>();
      salesData.forEach(sale => {
        const date = parseDate(sale.date);
        if (date) {
          const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          months.add(monthYear);
        }
      });
      
      const sortedMonths = Array.from(months).sort((a, b) => {
        const dateA = new Date(a + ' 1');
        const dateB = new Date(b + ' 1');
        return dateA.getTime() - dateB.getTime();
      });
      
      console.log(`[SalesScreen] Found ${sortedMonths.length} unique months:`, sortedMonths);
      
      setAvailableMonths(sortedMonths);
      if (sortedMonths.length > 0) {
        const defaultMonth = sortedMonths[sortedMonths.length - 1];
        console.log('[SalesScreen] Setting default month to:', defaultMonth);
        setSelectedMonth(defaultMonth);
      } else {
        console.log('[SalesScreen] No months found, setting to All Sales');
        setSelectedMonth('All Sales');
      }
    } catch (error) {
      console.error('[SalesScreen] Error loading sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Parse commission string to number
  const parseCommission = (commStr: string): number => {
    if (!commStr) return 0;
    // Remove $ and commas, handle negative numbers
    const cleaned = String(commStr).replace(/[\$,]/g, '');
    return parseFloat(cleaned) || 0;
  };

  // Parse collected/net string to number
  const parseAmount = (amtStr: string): number => {
    if (!amtStr) return 0;
    const cleaned = String(amtStr).replace(/[\$,]/g, '');
    return parseFloat(cleaned) || 0;
  };

  // Filter sales by selected month
  const filteredSales = selectedMonth === 'All Sales' || !selectedMonth
    ? sales
    : sales.filter(sale => {
        if (!sale.date) return false;
        const date = parseDate(sale.date);
        if (!date) return false;
        const saleMonth = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        return saleMonth === selectedMonth;
      });
  
  // Aggregate by rep
  const repSummaries: RepSummary[] = [];
  filteredSales.forEach(sale => {
    let rep = repSummaries.find(r => r.repEmail === sale.repEmail);
    if (!rep) {
      rep = {
        repName: sale.repName,
        repEmail: sale.repEmail,
        team: sale.team,
        totalCommission: 0,
        transactions: []
      };
      repSummaries.push(rep);
    }
    rep.totalCommission += parseCommission(sale.commission);
    rep.transactions.push(sale);
  });

  // Sort reps by commission
  repSummaries.sort((a, b) => b.totalCommission - a.totalCommission);

  // Aggregate by team
  const teamSummaries: TeamSummary[] = [];
  filteredSales.forEach(sale => {
    let team = teamSummaries.find(t => t.team === sale.team);
    if (!team) {
      team = {
        team: sale.team,
        totalCollected: 0,
        totalNet: 0,
        reps: []
      };
      teamSummaries.push(team);
    }
    team.totalCollected += parseAmount(sale.collected);
    team.totalNet += parseAmount(sale.net);
  });

  // Add reps to teams
  teamSummaries.forEach(team => {
    team.reps = repSummaries.filter(r => r.team === team.team);
  });

  // Sort teams by net
  teamSummaries.sort((a, b) => b.totalNet - a.totalNet);

  const isOwner = isExecutiveRole(selectedEmployee?.role);
  const isTeamLead = isTeamLeadRole(selectedEmployee?.role);

  console.log('[SalesScreen] Selected employee:', selectedEmployee?.name, selectedEmployee?.role);
  console.log('[SalesScreen] isOwner:', isOwner, 'isTeamLead:', isTeamLead);
  console.log('[SalesScreen] Total sales:', sales.length, 'Filtered sales:', filteredSales.length);
  console.log('[SalesScreen] Team summaries:', teamSummaries.length, 'Rep summaries:', repSummaries.length);

  // Filter data based on role
  const myRep = repSummaries.find(r => r.repEmail === selectedEmployee?.email);
  const myTeam = teamSummaries.find(t => t.team === selectedEmployee?.team);

  if (loading) {
    return (
      <GradientBackground>
        <View style={[styles.container, { paddingTop: insets.top + 60 }]}>
          <ThemedText style={{ color: '#fff', textAlign: 'center' }}>Loading sales data...</ThemedText>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: Math.max(insets.top, 20) + 20,
            paddingBottom: Math.max(insets.bottom, 20) + 80,
          },
        ]}
      >
        <ThemedText type="title" style={[styles.title, { color: '#fff' }]}>
          Sales Dashboard
        </ThemedText>

        {/* Month Navigation */}
        <View style={styles.monthNav}>
          <Pressable
            style={styles.monthNavBtn}
            onPress={() => {
              const currentIndex = availableMonths.indexOf(selectedMonth);
              if (currentIndex > 0) {
                setSelectedMonth(availableMonths[currentIndex - 1]);
              }
            }}
            disabled={availableMonths.indexOf(selectedMonth) === 0}
          >
            <ThemedText style={[styles.monthNavText, { opacity: availableMonths.indexOf(selectedMonth) === 0 ? 0.3 : 1 }]}>
              ←
            </ThemedText>
          </Pressable>
          <ThemedText style={styles.monthLabel}>{selectedMonth}</ThemedText>
          <Pressable
            style={styles.monthNavBtn}
            onPress={() => {
              const currentIndex = availableMonths.indexOf(selectedMonth);
              if (currentIndex < availableMonths.length - 1) {
                setSelectedMonth(availableMonths[currentIndex + 1]);
              }
            }}
            disabled={availableMonths.indexOf(selectedMonth) === availableMonths.length - 1}
          >
            <ThemedText style={[styles.monthNavText, { opacity: availableMonths.indexOf(selectedMonth) === availableMonths.length - 1 ? 0.3 : 1 }]}>
              →
            </ThemedText>
          </Pressable>
        </View>

        {/* Rep View - Show their commission */}
        {!isOwner && !isTeamLead && myRep && (
          <>
            <View style={[styles.card, { backgroundColor }]}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Your {selectedMonth} Commission
              </ThemedText>
              <ThemedText style={[styles.bigNumber, { color: '#34C759' }]}>
                ${myRep.totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                {myRep.transactions.length} transactions
              </ThemedText>
            </View>

            <View style={[styles.card, { backgroundColor }]}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Your Transactions
              </ThemedText>
              {myRep.transactions.map((sale, idx) => (
                <View key={idx} style={styles.transactionRow}>
                  <View style={styles.transactionLeft}>
                    <ThemedText style={styles.clientName}>{sale.client}</ThemedText>
                    <ThemedText style={styles.transactionDate}>{sale.date}</ThemedText>
                  </View>
                  <ThemedText style={[styles.commissionAmount, { color: '#34C759' }]}>
                    ${parseCommission(sale.commission).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </ThemedText>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Team Lead View - Show team collected/net */}
        {isTeamLead && myTeam && (
          <>
            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard, { backgroundColor }]}>
                <ThemedText style={styles.summaryLabel}>Team Collected</ThemedText>
                <ThemedText style={[styles.summaryValue, { color: '#34C759' }]}>
                  ${myTeam.totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </ThemedText>
              </View>
              <View style={[styles.summaryCard, { backgroundColor }]}>
                <ThemedText style={styles.summaryLabel}>Team Net</ThemedText>
                <ThemedText style={[styles.summaryValue, { color: '#5B6FED' }]}>
                  ${myTeam.totalNet.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </ThemedText>
              </View>
            </View>

            <View style={[styles.card, { backgroundColor }]}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Team Members Performance
              </ThemedText>
              {myTeam.reps.map((rep, idx) => (
                <View key={rep.repEmail} style={styles.rankRow}>
                  <View style={styles.rankLeft}>
                    <View style={[styles.rankBadge, { backgroundColor: '#5B6FED' }]}>
                      <ThemedText style={[styles.rankNumber, { color: '#fff' }]}>
                        {idx + 1}
                      </ThemedText>
                    </View>
                    <View style={styles.repInfo}>
                      <ThemedText style={styles.repName}>{rep.repName}</ThemedText>
                      <ThemedText style={styles.repTeam}>{rep.transactions.length} transactions</ThemedText>
                    </View>
                  </View>
                  <ThemedText style={[styles.salesAmount, { color: '#34C759' }]}>
                    ${rep.totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </ThemedText>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Owner View - Show all teams and all reps */}
        {isOwner && (
          <>
            <View style={[styles.card, { backgroundColor }]}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Team Rankings (by Net)
              </ThemedText>
              {teamSummaries.map((team, idx) => (
                <View key={team.team} style={styles.rankRow}>
                  <View style={styles.rankLeft}>
                    <View style={[
                      styles.rankBadge,
                      { backgroundColor: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : '#e0e0e0' }
                    ]}>
                      <ThemedText style={[styles.rankNumber, { color: idx < 3 ? '#fff' : '#666' }]}>
                        {idx + 1}
                      </ThemedText>
                    </View>
                    <View style={styles.repInfo}>
                      <ThemedText style={styles.repName}>{team.team}</ThemedText>
                      <ThemedText style={styles.repTeam}>{team.reps.length} reps</ThemedText>
                    </View>
                  </View>
                  <View style={styles.rankRight}>
                    <ThemedText style={[styles.salesAmount, { color: '#34C759' }]}>
                      ${team.totalCollected.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </ThemedText>
                    <ThemedText style={styles.closeRate}>
                      Net: ${team.totalNet.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>

            <View style={[styles.card, { backgroundColor }]}>
              <ThemedText type="subtitle" style={styles.cardTitle}>
                Top Performers (by Commission)
              </ThemedText>
              {repSummaries.slice(0, 10).map((rep, idx) => (
                <View key={rep.repEmail} style={styles.rankRow}>
                  <View style={styles.rankLeft}>
                    <View style={[
                      styles.rankBadge,
                      { backgroundColor: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : '#e0e0e0' }
                    ]}>
                      <ThemedText style={[styles.rankNumber, { color: idx < 3 ? '#fff' : '#666' }]}>
                        {idx + 1}
                      </ThemedText>
                    </View>
                    <View style={styles.repInfo}>
                      <ThemedText style={styles.repName}>{rep.repName}</ThemedText>
                      <ThemedText style={styles.repTeam}>{rep.team} • {rep.transactions.length} deals</ThemedText>
                    </View>
                  </View>
                  <ThemedText style={[styles.salesAmount, { color: '#34C759' }]}>
                    ${rep.totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </ThemedText>
                </View>
              ))}
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
    paddingHorizontal: 16,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  monthNavBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavText: {
    color: '#fff',
    fontSize: 24,
  },
  monthLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    minWidth: 150,
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
  bigNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  transactionLeft: {
    flex: 1,
  },
  clientName: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  commissionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  rankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  repInfo: {
    flex: 1,
  },
  repName: {
    fontSize: 16,
    fontWeight: '600',
  },
  repTeam: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  rankRight: {
    alignItems: 'flex-end',
  },
  salesAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeRate: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
});
