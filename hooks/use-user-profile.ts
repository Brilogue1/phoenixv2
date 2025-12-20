import { useEffect, useState } from 'react';
import { useAuth } from './use-auth';
import { fetchEmployees, type Employee } from '@/lib/google-sheets';

export interface UserProfile extends Employee {
  isOwner: boolean;
  isTeamLead: boolean;
  canSeeAllTeams: boolean;
  canSeeTeamData: boolean;
}

export function useUserProfile() {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!isAuthenticated || !user?.email) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all employees
        const employees = await fetchEmployees();

        // Find the current user by email
        const employee = employees.find(
          (emp) => emp.email.toLowerCase() === user.email?.toLowerCase()
        );

        if (!employee) {
          setError('User not found in employee database');
          setProfile(null);
          setLoading(false);
          return;
        }

        // Determine user role and permissions
        const isOwner = employee.role.toLowerCase() === 'owner';
        const isTeamLead = employee.role.toLowerCase().includes('team lead');

        const userProfile: UserProfile = {
          ...employee,
          isOwner,
          isTeamLead,
          canSeeAllTeams: isOwner,
          canSeeTeamData: isOwner || isTeamLead,
        };

        setProfile(userProfile);
      } catch (err) {
        console.error('Error loading user profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [isAuthenticated, user?.email]);

  return { profile, loading, error };
}
