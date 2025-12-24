import { useState, useEffect } from 'react';
import { Modal, Pressable, StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { fetchEmployees, type Employee } from '@/lib/google-sheets';
import { isExecutiveRole, isTeamLeadRole } from '@/lib/role-utils';

interface TestProfile {
  name: string;
  email: string;
  team: string;
  role: string;
  title: string;
  phone: string;
  repAirportCode: string;
}

interface UserProfileSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectProfile: (profile: TestProfile) => void;
}

export function UserProfileSelector({ visible, onClose, onSelectProfile }: UserProfileSelectorProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');
  const [profiles, setProfiles] = useState<TestProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      // Always fetch fresh data when modal opens to catch new employees
      loadProfiles();
    }
  }, [visible]);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      // Get logged-in user info
      const loggedInUserStr = await AsyncStorage.getItem('logged_in_user');
      const loggedInUser = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;

      console.log('[UserProfileSelector] Fetching employees...');
      const employees = await fetchEmployees();
      console.log(`[UserProfileSelector] Fetched ${employees.length} employees`);
      console.log('[UserProfileSelector] Employee names:', employees.map(e => e.name));
      
      // Convert Employee[] to TestProfile[]
      let testProfiles = employees.map((emp: Employee) => ({
        name: emp.name,
        email: emp.email,
        team: emp.team,
        role: emp.role,
        title: emp.title,
        phone: emp.phone,
        repAirportCode: emp.repAirportCode,
      }));

      // Filter profiles based on logged-in user's role
      if (loggedInUser) {
        console.log(`[UserProfileSelector] Logged in as: ${loggedInUser.name} (${loggedInUser.role})`);
        
        if (isExecutiveRole(loggedInUser.role)) {
          // Executives (Owner, VO, CEO, COO, Director) see all profiles
          console.log('[UserProfileSelector] Executive role - showing ALL profiles');
          setProfiles(testProfiles);
        } else if (isTeamLeadRole(loggedInUser.role)) {
          // Team Lead sees only their team members
          const filteredProfiles = testProfiles.filter(
            (profile) => profile.team === loggedInUser.team
          );
          console.log(`[UserProfileSelector] Team Lead role - showing ${filteredProfiles.length} profiles from team ${loggedInUser.team}`);
          setProfiles(filteredProfiles);
        } else {
          // Reps don't see profile selector (but if they somehow access it, show only themselves)
          const filteredProfiles = testProfiles.filter(
            (profile) => profile.email === loggedInUser.email
          );
          console.log(`[UserProfileSelector] Rep role - showing only own profile`);
          setProfiles(filteredProfiles);
        }
      } else {
        // No logged-in user, show all (fallback)
        console.log('[UserProfileSelector] No logged in user - showing all profiles');
        setProfiles(testProfiles);
      }
      
      console.log(`[UserProfileSelector] Final profile count: ${testProfiles.length}`);
    } catch (error) {
      console.error('Failed to load employees:', error);
      // Fallback to default profiles if fetch fails
      setProfiles([
        {
          name: 'Lance Hamilton',
          email: 'Admin@ky-travels.com',
          team: 'Corporate',
          role: 'Owner',
          title: 'COO',
          phone: '(405) 695-1498',
          repAirportCode: 'OKC',
        },
        {
          name: 'Ralph Hunter',
          email: 'Hunter11oaks@yahoo.com',
          team: 'KYT2',
          role: 'Team Lead KYT2',
          title: 'Option/Owner',
          phone: '(256) 347-3880',
          repAirportCode: 'MDE',
        },
        {
          name: 'TEST TEST',
          email: 'bri@investorplug.io',
          team: 'KYT2',
          role: 'Rep',
          title: 'CEO',
          phone: '6037939945',
          repAirportCode: 'BOS',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProfile = async (profile: TestProfile) => {
    await AsyncStorage.setItem('test_profile', JSON.stringify(profile));
    onSelectProfile(profile);
    onClose();
  };

  const getRoleBadgeColor = (role: string) => {
    if (isExecutiveRole(role)) return '#FF9500';
    if (isTeamLeadRole(role)) return '#007AFF';
    return '#34C759';
  };

  const getAccessLevelText = (profile: TestProfile) => {
    if (isExecutiveRole(profile.role)) {
      return '✓ Can see all teams and all data';
    }
    if (isTeamLeadRole(profile.role)) {
      return `✓ Can see all ${profile.team} team data`;
    }
    return '✓ Can see own data only';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={[styles.modal, { backgroundColor }]}>
          <ThemedText type="title" style={styles.modalTitle}>
            Select Profile
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: textColor }]}>
            Choose a profile to test different access levels ({profiles.length} employees)
          </ThemedText>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={primaryColor} />
              <ThemedText style={{ marginTop: 12 }}>Loading employees...</ThemedText>
            </View>
          ) : (
            <ScrollView style={styles.profileList}>
              {profiles.map((profile) => (
                <Pressable
                  key={profile.email}
                  style={[styles.profileCard, { borderColor: primaryColor }]}
                  onPress={() => handleSelectProfile(profile)}
                >
                  <View style={styles.profileHeader}>
                    <ThemedText type="defaultSemiBold" style={styles.profileName}>
                      {profile.name}
                    </ThemedText>
                    <View
                      style={[
                        styles.roleBadge,
                        { backgroundColor: getRoleBadgeColor(profile.role) },
                      ]}
                    >
                      <ThemedText style={styles.roleBadgeText}>{profile.role}</ThemedText>
                    </View>
                  </View>
                  <ThemedText style={[styles.profileDetail, { color: textColor }]}>
                    {profile.email}
                  </ThemedText>
                  <ThemedText style={[styles.profileDetail, { color: textColor }]}>
                    Team: {profile.team}
                  </ThemedText>
                  <ThemedText style={[styles.accessLevel, { color: primaryColor }]}>
                    {getAccessLevelText(profile)}
                  </ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          )}

          <Pressable
            style={[styles.closeButton, { backgroundColor: '#ccc' }]}
            onPress={onClose}
          >
            <ThemedText style={styles.closeButtonText}>Cancel</ThemedText>
          </Pressable>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
    opacity: 0.7,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileList: {
    marginBottom: 16,
  },
  profileCard: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileName: {
    flex: 1,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  profileDetail: {
    fontSize: 14,
    marginBottom: 4,
  },
  accessLevel: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '600',
  },
  closeButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontWeight: '600',
  },
});
