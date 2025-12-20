/**
 * Role-based access control utilities
 */

/**
 * Check if a role has executive/full access privileges
 * Executive roles: Owner, VO, CEO, COO, Director
 */
export function isExecutiveRole(role: string | undefined): boolean {
  if (!role) return false;
  
  const executiveKeywords = ['Owner', 'VO', 'CEO', 'COO', 'Director'];
  return executiveKeywords.some(keyword => role.includes(keyword));
}

/**
 * Check if a role is a Team Lead
 */
export function isTeamLeadRole(role: string | undefined): boolean {
  if (!role) return false;
  return role.includes('Team Lead');
}

/**
 * Check if a role is a Rep (not executive, not team lead)
 */
export function isRepRole(role: string | undefined): boolean {
  if (!role) return false;
  return !isExecutiveRole(role) && !isTeamLeadRole(role);
}

/**
 * Check if a user can see all teams' data
 */
export function canSeeAllTeams(role: string | undefined): boolean {
  return isExecutiveRole(role);
}

/**
 * Check if a user can see their team's data
 */
export function canSeeTeamData(role: string | undefined): boolean {
  return isExecutiveRole(role) || isTeamLeadRole(role);
}

/**
 * Check if a user can switch profiles (view as other users)
 */
export function canSwitchProfiles(role: string | undefined): boolean {
  return isExecutiveRole(role) || isTeamLeadRole(role);
}
