const RoleHierarchy = {
  SUPER_USER: ['FLEET_OWNER', 'FLEET_MANAGER', 'SHIPMENT_MANAGER', 'DEFAULT_USER'],
  FLEET_OWNER: ['FLEET_MANAGER', 'DEFAULT_USER'],
  FLEET_MANAGER: ['SHIPMENT_MANAGER'],
  SHIPMENT_MANAGER: [],
  DEFAULT_USER: []
};

// List of valid roles
const RolesList = Object.keys(RoleHierarchy);

// Function to check if a user can change a role
const canChangeRole = (currentRole, newRole) => {
  return RoleHierarchy[currentRole] && RoleHierarchy[currentRole].includes(newRole);
};

module.exports = { RoleHierarchy, RolesList, canChangeRole };
