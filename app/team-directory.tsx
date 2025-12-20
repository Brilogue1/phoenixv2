import { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientBackground } from '@/components/gradient-background';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/hooks/use-auth';
import { useUserProfile } from '@/hooks/use-user-profile';
import { fetchEmployees, type Employee } from '@/lib/google-sheets';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function TeamDirectoryScreen() {
  const { isAuthenticated } = useAuth();
  const { profile } = useUserProfile();
  const insets = useSafeAreaInsets();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const secondaryColor = useThemeColor({}, 'textSecondary');
  const primaryColor = useThemeColor({}, 'primary');

  // Use demo profile if not logged in
  const displayProfile = profile || {
    name: 'Demo User',
    email: 'demo@phoenixdm.co',
    team: 'KYT2',
    canSeeAllTeams: false,
  };

  useEffect(() => {
    async function loadEmployees() {
      try {
        const data = await fetchEmployees();
        setEmployees(data);
        setFilteredEmployees(data);
      } catch (error) {
        console.error('Error loading employees:', error);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated && profile) {
      loadEmployees();
    }
  }, [isAuthenticated, profile]);

  useEffect(() => {
    let filtered = employees;

    // Filter by team (unless owner who can see all)
    if (!displayProfile.canSeeAllTeams) {
      filtered = filtered.filter((emp) => emp.team === displayProfile.team);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(query) ||
          emp.title.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query)
      );
    }

    setFilteredEmployees(filtered);
  }, [searchQuery, employees, displayProfile]);

  const handleWhatsAppCall = (phone: string) => {
    // Remove non-numeric characters
    const cleanPhone = phone.replace(/\D/g, '');
    const url = `whatsapp://send?phone=${cleanPhone}`;
    Linking.openURL(url).catch(() => {
      alert('WhatsApp is not installed on this device');
    });
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <GradientBackground>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 20),
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color="#fff" />
          </Pressable>
          <ThemedText type="title" style={{ color: '#fff' }}>
            Team Directory
          </ThemedText>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor }]}>
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search team members..."
            placeholderTextColor={secondaryColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Team Members List */}
        <ScrollView style={styles.listContainer} contentContainerStyle={styles.listContent}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : filteredEmployees.length === 0 ? (
            <ThemedText style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
              No team members found
            </ThemedText>
          ) : (
            filteredEmployees.map((employee) => (
              <View key={employee.email} style={[styles.memberCard, { backgroundColor }]}>
                <View
                  style={[
                    styles.accentBorder,
                    { backgroundColor: employee.team === 'KYT2' ? '#8B5CF6' : '#4A5FE8' },
                  ]}
                />
                <View style={styles.memberContent}>
                  {/* Avatar */}
                  <View style={[styles.avatar, { backgroundColor: primaryColor }]}>
                    <ThemedText style={styles.avatarText}>
                      {employee.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </ThemedText>
                  </View>

                  {/* Info */}
                  <View style={styles.memberInfo}>
                    <ThemedText type="defaultSemiBold">{employee.name}</ThemedText>
                    <ThemedText style={{ color: secondaryColor, fontSize: 14 }}>
                      {employee.title}
                    </ThemedText>
                    <View style={[styles.teamBadge, { backgroundColor: `${primaryColor}20` }]}>
                      <ThemedText style={{ color: primaryColor, fontSize: 12 }}>
                        {employee.team}
                      </ThemedText>
                    </View>
                  </View>

                  {/* Actions */}
                  <View style={styles.actions}>
                    {employee.phone && (
                      <Pressable
                        onPress={() => handleWhatsAppCall(employee.phone)}
                        style={[styles.actionButton, { backgroundColor: '#25D366' }]}
                      >
                        <ThemedText style={styles.actionButtonText}>WhatsApp</ThemedText>
                      </Pressable>
                    )}
                    {employee.email && (
                      <Pressable
                        onPress={() => handleEmail(employee.email)}
                        style={[styles.actionButton, { backgroundColor: secondaryColor }]}
                      >
                        <ThemedText style={styles.actionButtonText}>Email</ThemedText>
                      </Pressable>
                    )}
                  </View>
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    padding: 12,
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  memberCard: {
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
  memberContent: {
    padding: 16,
    paddingLeft: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
    gap: 4,
  },
  teamBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  actions: {
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
