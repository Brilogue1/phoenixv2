import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GradientBackground } from '@/components/gradient-background';
import { useUserProfile } from '@/hooks/use-user-profile';
import { fetchSales, SaleTransaction } from '@/lib/google-sheets';

interface TeamSummary {
  team: string;
  totalSales: number;
  dealCount: number;
  deals: SaleTransaction[];
}

export default function SalesScreen() {
  const { profile } = useUserProfile();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [allSales, setAllSales] = useState<SaleTransaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('All Sales');
  const [availableMonths, setAvailableMonths] = useState<string[]>(['All Sales']);

  // Demo profile for testing
  const displayProfile = profile || {
    name: 'Demo User',
    email: 'demo@phoenixdm.co',
    team: 'KYT2',
    role: 'Owner',
  };

  useEffect(() => {
    loadSalesData();
  }, []);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      console.log('[SalesScreen] Loading sales data...');

      const salesData = await fetchSales();
      console.log('[SalesScreen] Loaded sales:', salesData.length);

      setAllSales(salesData);

      // Extract unique months from sales data
      const months = new Set<string>();
      salesData.forEach((sale) => {
        if (sale.date) {
          // Parse date and extract month/year
          const dateParts = sale.date.split('/');
          if (dateParts.length >= 2) {
            const month = dateParts[0];
            let year = dateParts[2];
            // Handle 2-digit year (26 -> 2026)
            if (year && year.length === 2) {
              year = '20' + year;
            }
            year = year || new Date().getFullYear().toString();
            months.add(`${month}/${year}`);
          }
        }
      });

      const sortedMonths = Array.from(months).sort((a, b) => {
        const [monthA, yearA] = a.split('/').map(Number);
        const [monthB, yearB] = b.split('/').map(Number);
        if (yearA !== yearB) return yearB - yearA;
        return monthB - monthA;
      });

      setAvailableMonths(['All Sales', ...sortedMonths]);
      console.log('[SalesScreen] Available months:', sortedMonths);
    } catch (error) {
      console.error('[SalesScreen] Error loading sales:', error);
    } finally {
      setLoading(false);
    }
  };

  // Determine which teams the user can see
  const getVisibleTeams = (): string[] => {
    const userTeam = displayProfile.team;

    console.log('[SalesScreen] User team:', userTeam);

    // Isolated teams array
    const isolatedTeams = ['KYT4', 'KYT5', 'KYT6'];

    // If user is from an isolated team, they can only see their own team
    if (isolatedTeams.includes(userTeam)) {
      console.log('[SalesScreen] User from isolated team, showing only:', userTeam);
      return [userTeam];
    }

    // Everyone else sees all teams
    console.log('[SalesScreen] Non-isolated user, showing all teams');
    const allTeams = new Set(allSales.map(sale => sale.team).filter(Boolean));
    return Array.from(allTeams).sort();
  };

  // Filter sales by month
  const filterSalesByMonth = (sales: SaleTransaction[]): SaleTransaction[] => {
    if (selectedMonth === 'All Sales') {
      return sales;
    }

    return sales.filter((sale) => {
      if (!sale.date) return false;
      const dateParts = sale.date.split('/');
      if (dateParts.length < 2) return false;
      const month = dateParts[0];
      let year = dateParts[2];
      // Handle 2-digit year (26 -> 2026)
      if (year && year.length === 2) {
        year = '20' + year;
      }
      year = year || new Date().getFullYear().toString();
      return `${month}/${year}` === selectedMonth;
    });
  };

  // Generate team summaries
  const getTeamSummaries = (): TeamSummary[] => {
    const visibleTeams = getVisibleTeams();
    const filteredSales = filterSalesByMonth(allSales);

    return visibleTeams.map((team) => {
      const teamDeals = filteredSales.filter((sale) => sale.team === team);
      const totalSales = teamDeals.reduce((sum, sale) => {
        const netValue = parseFloat(String(sale.net || '0').replace(/[^0-9.-]/g, '')) || 0;
        return sum + netValue;
      }, 0);

      return {
        team,
        totalSales,
        dealCount: teamDeals.length,
        deals: teamDeals.sort((a, b) => {
          // Sort by date descending
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        }),
      };
    }).filter(summary => summary.dealCount > 0); // Only show teams with deals
  };

  const teamSummaries = getTeamSummaries();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <GradientBackground>
        <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5B6FED" />
            <ThemedText style={styles.loadingText}>Loading sales data...</ThemedText>
          </View>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
        >
          {/* Header */}
          <ThemedText type="title" style={styles.title}>
            Sales Dashboard
          </ThemedText>

          {/* Month Selector */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.monthSelector}
          >
            {availableMonths.map((month) => (
              <Pressable
                key={month}
                style={[
                  styles.monthButton,
                  selectedMonth === month && styles.monthButtonActive,
                ]}
                onPress={() => setSelectedMonth(month)}
              >
                <ThemedText
                  style={[
                    styles.monthButtonText,
                    selectedMonth === month && styles.monthButtonTextActive,
                  ]}
                >
                  {month}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>

          {/* Team Summaries */}
          {teamSummaries.length === 0 ? (
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>
                No sales data for {selectedMonth}
              </ThemedText>
            </View>
          ) : (
            teamSummaries.map((summary) => (
              <View key={summary.team} style={styles.teamCard}>
                {/* Team Header */}
                <View style={styles.teamHeader}>
                  <ThemedText type="subtitle" style={styles.teamName}>
                    {summary.team}
                  </ThemedText>
                  <View style={styles.teamStats}>
                    <View style={styles.statItem}>
                      <ThemedText style={styles.statLabel}>Total Sales</ThemedText>
                      <ThemedText style={styles.statValue}>
                        {formatCurrency(summary.totalSales)}
                      </ThemedText>
                    </View>
                    <View style={styles.statItem}>
                      <ThemedText style={styles.statLabel}>Deals</ThemedText>
                      <ThemedText style={styles.statValue}>
                        {summary.dealCount}
                      </ThemedText>
                    </View>
                  </View>
                </View>

                {/* Deals List */}
                <View style={styles.dealsContainer}>
                  <ThemedText type="defaultSemiBold" style={styles.dealsTitle}>
                    Deals Breakdown
                  </ThemedText>

                  {summary.deals.map((deal, index) => (
                    <View key={index} style={styles.dealCard}>
                      <View style={styles.dealHeader}>
                        <ThemedText style={styles.dealClient}>
                          {deal.client || 'Unknown Client'}
                        </ThemedText>
                        <ThemedText style={styles.dealAmount}>
                          {formatCurrency(parseFloat(String(deal.net || '0').replace(/[^0-9.-]/g, '')) || 0)}
                        </ThemedText>
                      </View>

                      <View style={styles.dealDetails}>
                        <View style={styles.dealDetailRow}>
                          <ThemedText style={styles.dealLabel}>Date:</ThemedText>
                          <ThemedText style={styles.dealValue}>{deal.date}</ThemedText>
                        </View>

                        <View style={styles.dealDetailRow}>
                          <ThemedText style={styles.dealLabel}>Rep:</ThemedText>
                          <ThemedText style={styles.dealValue}>{deal.repName}</ThemedText>
                        </View>

                        <View style={styles.dealDetailRow}>
                          <ThemedText style={styles.dealLabel}>Sale Price:</ThemedText>
                          <ThemedText style={styles.dealValue}>{deal.salePrice}</ThemedText>
                        </View>

                        <View style={styles.dealDetailRow}>
                          <ThemedText style={styles.dealLabel}>Commission:</ThemedText>
                          <ThemedText style={styles.dealValue}>{deal.commission}</ThemedText>
                        </View>

                        {deal.notes && (
                          <View style={styles.dealNotes}>
                            <ThemedText style={styles.dealLabel}>Notes:</ThemedText>
                            <ThemedText style={styles.dealValue}>{deal.notes}</ThemedText>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
  },
  title: {
    marginBottom: 20,
  },
  monthSelector: {
    marginBottom: 20,
    maxHeight: 50,
  },
  monthButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  monthButtonActive: {
    backgroundColor: '#5B6FED',
    borderColor: '#5B6FED',
  },
  monthButtonText: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  monthButtonTextActive: {
    opacity: 1,
    color: '#FFFFFF',
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.5,
  },
  teamCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  teamHeader: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  teamName: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 'bold',
  },
  teamStats: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5B6FED',
  },
  dealsContainer: {
    gap: 12,
  },
  dealsTitle: {
    marginBottom: 12,
    fontSize: 16,
  },
  dealCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  dealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  dealClient: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  dealAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  dealDetails: {
    gap: 8,
  },
  dealDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealLabel: {
    fontSize: 13,
    opacity: 0.6,
  },
  dealValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  dealNotes: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
});
