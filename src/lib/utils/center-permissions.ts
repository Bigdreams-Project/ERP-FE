/**
 * Utility functions for center-related permissions
 */

/**
 * Check if a user role can switch between centers
 * @param role - The user's role (case-insensitive)
 * @returns true if the role can switch centers, false otherwise
 */
export function canSwitchCenters(role?: string | null): boolean {
  if (!role) return false;
  
  const userRole = role.toUpperCase();
  const rolesThatCanSwitch = [
    "ADMIN",
    "CEO",
    "EXECUTIVE_DIRECTOR",
    "COO_HEAD_OFFICE",
    "REGIONAL_MANAGER",
    "FINANCE_OFFICER",
    "EXECUTIVE_ASSISTANT",
  ];
  
  return rolesThatCanSwitch.includes(userRole);
}

/**
 * Check if a user role should have access to the centers page
 * @param role - The user's role (case-insensitive)
 * @returns true if the role should see the centers page, false otherwise
 */
export function canAccessCentersPage(role?: string | null): boolean {
  if (!role) return false;
  
  const userRole = role.toUpperCase();
  // ADMIN, CEO, and EXECUTIVE_DIRECTOR should always see the centers page
  const rolesThatCanAccess = [
    "ADMIN",
    "CEO",
    "EXECUTIVE_DIRECTOR",
  ];
  
  return rolesThatCanAccess.includes(userRole);
}




