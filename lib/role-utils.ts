/**
 * Role and permission utilities
 */

// Executive roles that can see all data
const EXECUTIVE_ROLES = ['Owner', 'VO', 'CEO', 'COO', 'Director', 'Option/Owner', 'Director/Owner', 'Executive Assistant'];

// Team lead roles
const TEAM_LEAD_ROLES = ['Team Lead', 'Team Lead KYT1', 'Team Lead KYT2', 'Team Lead KYT3', 'Team Lead KYT4', 'Team Lead KYT5', 'Team Lead KYT6'];

// Isolated teams - these teams can ONLY see their own data
const ISOLATED_TEAMS = ['KYT5', 'KYT6'];

/**
 * Check if role is executive level (can see all teams)
 */
export function isExecutiveRole(role: string): boolean {
  if (!role) return false;
  return EXECUTIVE_ROLES.some(execRole => role.toLowerCase().includes(execRole.toLowerCase()));
}

/**
 * Check if role is team lead level
 */
export function isTeamLeadRole(role: string): boolean {
  if (!role) return false;
  return TEAM_LEAD_ROLES.some(leadRole => role.toLowerCase().includes(leadRole.toLowerCase()));
}

/**
 * Check if team is isolated (KYT5, KYT6)
 */
export function isIsolatedTeam(team: string): boolean {
  if (!team) return false;
  return ISOLATED_TEAMS.includes(team);
}

/**
 * Check if user can switch profiles
 */
export function canSwitchProfiles(role: string): boolean {
  return isExecutiveRole(role) || isTeamLeadRole(role);
}

/**
 * Check if user can see specific team's data
 * @param userTeam - The logged-in user's team
 * @param userRole - The logged-in user's role
 * @param targetTeam - The team they're trying to view
 */
export function canSeeTeamData(userTeam: string, userRole: string, targetTeam: string): boolean {
  // Executives can see all teams EXCEPT isolated teams if they're not part of them
  if (isExecutiveRole(userRole)) {
    // If target is isolated (KYT5/KYT6), only show if executive is FROM that team
    if (isIsolatedTeam(targetTeam)) {
      return userTeam === targetTeam;
    }
    return true; // Can see all non-isolated teams
  }
  
  // Team leads can only see their own team
  if (isTeamLeadRole(userRole)) {
    return userTeam === targetTeam;
  }
  
  // Reps can only see their own data (same team)
  return userTeam === targetTeam;
}

/**
 * Get visible teams for a user
 * @param userTeam - The logged-in user's team
 * @param userRole - The logged-in user's role
 * @param allTeams - All available teams
 */
export function getVisibleTeams(userTeam: string, userRole: string, allTeams: string[]): string[] {
  if (isExecutiveRole(userRole)) {
    // If executive is from isolated team, only show their team
    if (isIsolatedTeam(userTeam)) {
      return [userTeam];
    }
    // Otherwise, show all non-isolated teams
    return allTeams.filter(team => !isIsolatedTeam(team) || team === userTeam);
  }
  
  // Team leads and reps only see their own team
  return [userTeam];
}
