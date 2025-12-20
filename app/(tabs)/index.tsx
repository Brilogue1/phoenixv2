import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View, RefreshControl, Image } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GradientBackground } from '@/components/gradient-background';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { WeekNavigation } from '@/components/week-navigation';
import { ImprovedCard, CardDetailRow } from '@/components/improved-itinerary-card';
import { useAuth } from '@/hooks/use-auth';
import { useUserProfile } from '@/hooks/use-user-profile';
import { UserProfileSelector } from '@/components/user-profile-selector';
import { fetchFlights, fetchRentalCars, fetchHotelInfo, fetchUpdates, type Flight, type RentalCar, type HotelInfo, type Update } from '@/lib/google-sheets';
import { NotificationBanner } from '@/components/notification-banner';
import { AccessDenied } from '@/components/access-denied';
import { isExecutiveRole, isTeamLeadRole, canSwitchProfiles } from '@/lib/role-utils';

export default function HomeScreen() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, error: profileError } = useUserProfile();
  const insets = useSafeAreaInsets();

  const [currentWeek, setCurrentWeek] = useState(1);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [rentalCars, setRentalCars] = useState<RentalCar[]>([]);
  const [hotelInfo, setHotelInfo] = useState<HotelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [testProfile, setTestProfile] = useState<any>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [dismissedUpdates, setDismissedUpdates] = useState<string[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  const loadData = useCallback(async () => {
    console.log('[HomeScreen] loadData called, setting loading to true');
    setLoading(true);
    try {
      console.log('[HomeScreen] Fetching flights...');
      let flightsData: Flight[] = [];
      try {
        flightsData = await fetchFlights();
        console.log('[HomeScreen] Flights fetched:', flightsData.length);
      } catch (err) {
        console.error('[HomeScreen] Error fetching flights:', err);
      }

      console.log('[HomeScreen] Fetching rental cars...');
      let carsData: RentalCar[] = [];
      try {
        carsData = await fetchRentalCars();
        console.log('[HomeScreen] Rental cars fetched:', carsData.length);
      } catch (err) {
        console.error('[HomeScreen] Error fetching rental cars:', err);
      }

      console.log('[HomeScreen] Fetching hotel info...');
      let hotelData: HotelInfo[] = [];
      try {
        hotelData = await fetchHotelInfo();
        console.log('[HomeScreen] Hotel info fetched:', hotelData.length);
      } catch (err) {
        console.error('[HomeScreen] Error fetching hotel info:', err);
      }

      let updatesData: Update[] = [];
      try {
        updatesData = await fetchUpdates();
      } catch (err: any) {
        console.error('[HomeScreen] Error fetching updates:', err);
      }

      // Load dismissed updates from AsyncStorage
      try {
        const dismissed = await AsyncStorage.getItem('dismissed_updates');
        if (dismissed) {
          setDismissedUpdates(JSON.parse(dismissed));
        }
      } catch (err) {
        console.error('[HomeScreen] Error loading dismissed updates:', err);
      }

      console.log('[HomeScreen] All data fetched:', {
        flights: flightsData.length,
        cars: carsData.length,
        hotels: hotelData.length,
      });
      
      setFlights(flightsData);
      setRentalCars(carsData);
      setHotelInfo(hotelData);
      setUpdates(updatesData);
      console.log('[HomeScreen] State updated, setting loading to false');
    } catch (error) {
      console.error('[HomeScreen] Error loading itinerary data:', error);
    } finally {
      console.log('[HomeScreen] Finally block - setting loading to false');
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Load test profile from AsyncStorage
  useEffect(() => {
    async function loadTestProfile() {
      const saved = await AsyncStorage.getItem('test_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert to full profile format
        setTestProfile({
          ...parsed,
          isOwner: isExecutiveRole(parsed.role),
          isTeamLead: isTeamLeadRole(parsed.role),
          canSeeAllTeams: isExecutiveRole(parsed.role),
          canSeeTeamData: isTeamLeadRole(parsed.role) || isExecutiveRole(parsed.role),
        });
      }
    }
    loadTestProfile();
  }, []);

  useEffect(() => {
    // Load data regardless of authentication status
    console.log('[HomeScreen] useEffect triggered, calling loadData');
    loadData();
    loadLoggedInUser();
    
    // Failsafe: force loading to false after 5 seconds
    const timeout = setTimeout(() => {
      console.log('[HomeScreen] Timeout reached, forcing loading to false');
      setLoading(false);
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [loadData]);

  const loadLoggedInUser = async () => {
    try {
      const userStr = await AsyncStorage.getItem('logged_in_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setLoggedInUser(user);
        // If user is a Rep, set their profile as the test profile automatically
        if (!isExecutiveRole(user.role) && !isTeamLeadRole(user.role)) {
          setTestProfile({
            name: user.name,
            email: user.email,
            team: user.team,
            role: user.role,
            title: '',
            phone: '',
            repAirportCode: '',
          });
        }
      }
    } catch (error) {
      console.error('Failed to load logged-in user:', error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  if (authLoading || profileLoading) {
    return (
      <GradientBackground>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </GradientBackground>
    );
  }

  // Check if user is authorized (exists in Employees sheet)
  if (isAuthenticated && profileError) {
    return <AccessDenied />;
  }

  // Allow access without authentication for now
  // if (!isAuthenticated) {
  //   router.replace('/modal');
  //   return null;
  // }

  // Use test profile if available, otherwise use db profile or default to Lance (Owner)
  const displayProfile = testProfile || profile || {
    name: 'Lance Hamilton',
    email: 'Admin@ky-travels.com',
    team: 'All Teams',
    title: 'Owner',
    role: 'Owner',
    phone: '',
    repAirportCode: 'OKC',
    isOwner: true,
    isTeamLead: false,
    canSeeAllTeams: true,
    canSeeTeamData: true,
  };

  // Filter data based on user role
  console.log('[HomeScreen] Filtering data for profile:', displayProfile);
  console.log('[HomeScreen] Total flights:', flights.length);
  
  const userFlights = displayProfile.canSeeAllTeams
    ? flights
    : displayProfile.canSeeTeamData
    ? flights.filter((f) => {
        const employee = flights.find((e) => e.repEmail === f.repEmail);
        return employee;
      })
    : flights.filter((f) => {
        console.log('[HomeScreen] Comparing:', f.repEmail.toLowerCase(), 'vs', displayProfile.email.toLowerCase());
        return f.repEmail.toLowerCase() === displayProfile.email.toLowerCase();
      });
  
  console.log('[HomeScreen] Filtered flights:', userFlights.length, userFlights);

  const userRentalCars = displayProfile.canSeeAllTeams
    ? rentalCars
    : rentalCars.filter((c) => c.repEmail.toLowerCase() === displayProfile.email.toLowerCase());

  const userHotelInfo = displayProfile.canSeeAllTeams
    ? hotelInfo
    : hotelInfo.filter((h) => h.team === displayProfile.team);

  // Get current week data
  const getWeekData = (week: number) => {
    const weekKey = `week${week}` as 'week1' | 'week2' | 'week3';
    return {
      flight: userFlights[0],
      rentalCar: userRentalCars[0],
      hotel: userHotelInfo[0],
      weekKey,
    };
  };

  const { flight, rentalCar, hotel, weekKey } = getWeekData(currentWeek);

  const getWeekLabel = () => {
    if (!flight) return `Week ${currentWeek}`;
    // Map week1/week2/week3 to the correct camelCase property names
    const dateKey = `${weekKey}FlyDate` as keyof Flight;
    const dateStr = flight[dateKey] as string;
    
    console.log('Week key:', weekKey, 'Date key:', dateKey, 'Date value:', dateStr, 'Flight object:', flight);
    
    if (!dateStr) return `Week ${currentWeek}`;
    
    // Parse date string (format: "12/19" or "1/1")
    const [month, day] = dateStr.split('/');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[parseInt(month) - 1];
    
    // Add ordinal suffix (st, nd, rd, th)
    const dayNum = parseInt(day);
    let suffix = 'th';
    if (dayNum === 1 || dayNum === 21 || dayNum === 31) suffix = 'st';
    else if (dayNum === 2 || dayNum === 22) suffix = 'nd';
    else if (dayNum === 3 || dayNum === 23) suffix = 'rd';
    
    return `${monthName}. ${dayNum}${suffix}`;
  };

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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
      >
        {/* Notification Banners */}
        {updates
          .filter(update => {
            // Filter out dismissed updates
            if (dismissedUpdates.includes(update.id)) return false;
            
            // Check targeting
            const currentProfile = testProfile || profile;
            if (!currentProfile) return update.target === 'All';
            
            // Show if targeted to All
            if (update.target === 'All') return true;
            
            // Show if targeted to user's team
            if (update.target === currentProfile.team) return true;
            
            // Show if targeted to user's email
            if (update.target === currentProfile.email) return true;
            
            return false;
          })
          .map(update => (
            <NotificationBanner
              key={update.id}
              updateId={update.id}
              message={update.message}
              onDismiss={() => {
                setDismissedUpdates(prev => [...prev, update.id]);
              }}
            />
          ))}

        {/* User Profile Card */}
        <Pressable
          style={styles.profileCard}
          onPress={() => {
            // Only show profile selector for executives and Team Leads
            if (loggedInUser && canSwitchProfiles(loggedInUser.role)) {
              setShowProfileSelector(true);
            }
          }}
        >
          <Image
            source={require('@/assets/images/phoenix-logo.png')}
            style={styles.phoenixLogo}
          />
          <View style={styles.profileInfo}>
            <ThemedText type="subtitle" style={{ color: '#fff' }}>
              {displayProfile.name}
            </ThemedText>
            <ThemedText style={{ color: 'rgba(255,255,255,0.8)' }}>{displayProfile.team}</ThemedText>
            {loggedInUser && canSwitchProfiles(loggedInUser.role) && (
              <ThemedText style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Tap to change profile</ThemedText>
            )}
          </View>
        </Pressable>

        {/* Week Navigation */}
        <WeekNavigation
          currentWeek={currentWeek}
          weekLabel={getWeekLabel()}
          onPrevious={() => setCurrentWeek((w) => Math.max(1, w - 1))}
          onNext={() => setCurrentWeek((w) => Math.min(3, w + 1))}
          canGoPrevious={currentWeek > 1}
          canGoNext={currentWeek < 3}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <>
            {/* Flight Info */}
            {flight && (
              <ImprovedCard title="✈️ Flight Information" accentColor="#007AFF">
                <CardDetailRow
                  label="Date"
                  value={flight[`${weekKey}FlyDate` as keyof Flight] as string}
                />
                <CardDetailRow
                  label="Confirmation #"
                  value={flight[`${weekKey}Confirmation` as keyof Flight] as string}
                />
                <CardDetailRow
                  label="Arrival/Departure Time"
                  value={flight[`${weekKey}ArrivalDeparture` as keyof Flight] as string}
                />
                <CardDetailRow
                  label="Flight Cost"
                  value={`$${flight[`${weekKey}CostOfFlight` as keyof Flight]}`}
                />
              </ImprovedCard>
            )}

            {/* Rental Car */}
            {rentalCar && (
              <ImprovedCard title="🚗 Rental Car" accentColor="#8E44AD">
                <CardDetailRow
                  label="Date"
                  value={rentalCar[`${weekKey}Date` as keyof RentalCar] as string}
                />
                <CardDetailRow
                  label="Rental Car Info"
                  value={rentalCar[`${weekKey}RentalCarInfo` as keyof RentalCar] as string}
                />
                <CardDetailRow
                  label="Vendor"
                  value={rentalCar[`${weekKey}Vendor` as keyof RentalCar] as string}
                />
                <CardDetailRow
                  label="Confirmation #"
                  value={rentalCar[`${weekKey}Confirmation` as keyof RentalCar] as string}
                />
                <CardDetailRow
                  label="Pick-up/Return Time"
                  value={rentalCar[`${weekKey}PickupReturn` as keyof RentalCar] as string}
                />
              </ImprovedCard>
            )}

            {/* Hotel & Events */}
            {hotel && (
              <ImprovedCard title="🏨 Hotel & Events" accentColor="#FF9500">
                <CardDetailRow
                  label="Date"
                  value={hotel[`${weekKey}Date` as keyof HotelInfo] as string}
                />
                <CardDetailRow
                  label="Reservation #"
                  value={hotel[`${weekKey}Reservation` as keyof HotelInfo] as string}
                />
                <CardDetailRow
                  label="Hotel Name"
                  value={hotel[`${weekKey}HotelName` as keyof HotelInfo] as string}
                />
                <CardDetailRow
                  label="Address"
                  value={hotel[`${weekKey}Address` as keyof HotelInfo] as string}
                />
                <CardDetailRow
                  label="Food"
                  value={hotel[`${weekKey}Food` as keyof HotelInfo] as string}
                />
                <CardDetailRow
                  label="Conference Room Confirmation #"
                  value={hotel[`${weekKey}ConferenceConfirmation` as keyof HotelInfo] as string}
                />
              </ImprovedCard>
            )}
          </>
        )}
      </ScrollView>

      {/* Profile Selector Modal */}
      <UserProfileSelector
        visible={showProfileSelector}
        onClose={() => setShowProfileSelector(false)}
        onSelectProfile={(newProfile) => {
          setTestProfile({
            ...newProfile,
            isOwner: isExecutiveRole(newProfile.role),
            isTeamLead: isTeamLeadRole(newProfile.role),
            canSeeAllTeams: isExecutiveRole(newProfile.role),
            canSeeTeamData: isTeamLeadRole(newProfile.role) || isExecutiveRole(newProfile.role),
          });
          // Reload data with new profile
          loadData();
        }}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  phoenixLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  profileInfo: {
    flex: 1,
  },
});
