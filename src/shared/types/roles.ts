export type Role = "developer" | "administrator"

export interface RolePermissions {
  canManageUsers: boolean
  canManagePlugins: boolean
  canManageLicenses: boolean
  canManageDeployments: boolean
  canViewAnalytics: boolean
  canViewAuditLogs: boolean
  canManageSettings: boolean
}

const DEVELOPER_PERMISSIONS: RolePermissions = {
  canManageUsers: true,
  canManagePlugins: true,
  canManageLicenses: true,
  canManageDeployments: true,
  canViewAnalytics: true,
  canViewAuditLogs: true,
  canManageSettings: true,
}

const ADMINISTRATOR_PERMISSIONS: RolePermissions = {
  canManageUsers: false,
  canManagePlugins: true,
  canManageLicenses: true,
  canManageDeployments: true,
  canViewAnalytics: true,
  canViewAuditLogs: true,
  canManageSettings: true,
}

export function getRolePermissions(role: Role): RolePermissions {
  switch (role) {
    case "developer":
      return DEVELOPER_PERMISSIONS
    case "administrator":
      return ADMINISTRATOR_PERMISSIONS
    default:
      return ADMINISTRATOR_PERMISSIONS
  }
}
