export const STORAGE_KEYS = {
  THEME: "omc:theme",
  RETURN_TO: "omc:return-to",
} as const;

export const APP_NAME = "OMC License Manager";
export const APP_DESCRIPTION =
  "Enterprise license management for Minecraft plugins";
export const APP_VERSION = "1.0.0";

export const LICENSE_KEY_PREFIX = "OMC";
export const LICENSE_KEY_SEGMENTS = 4;
export const LICENSE_KEY_SEGMENT_LENGTH = 4;

export const MINECRAFT_STANDALONE_SOFTWARE = [
  "Paper",
  "Purpur",
  "Spigot",
  "Bukkit",
  "Folia",
  "Fabric",
] as const;

export const MINECRAFT_PROXY_SOFTWARE = [
  "Velocity",
  "BungeeCord",
  "Waterfall",
] as const;

export const PAGE_SIZES = [10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 20;

export const AUDIT_ACTIONS = {
  LICENSE_GENERATED: "license.generated",
  LICENSE_REVOKED: "license.revoked",
  LICENSE_DELETED: "license.deleted",
  LICENSE_KEY_REGENERATED: "license.key_regenerated",
  PLUGIN_ADDED: "plugin.added",
  PLUGIN_EDITED: "plugin.edited",
  PLUGIN_DELETED: "plugin.deleted",
  DEPLOYMENT_RESET: "deployment.reset",
  DEPLOYMENT_SUSPENDED: "deployment.suspended",
  DEPLOYMENT_BLACKLISTED: "deployment.blacklisted",
  USER_LOGIN: "user.login",
  USER_FAILED_LOGIN: "user.failed_login",
  USER_INVITED: "user.invited",
  USER_ROLE_CHANGED: "user.role_changed",
  USER_DISABLED: "user.disabled",
  USER_ENABLED: "user.enabled",
  SETTINGS_UPDATED: "settings.updated",
} as const;
