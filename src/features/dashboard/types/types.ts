export interface DashboardStats {
  totalLicenses: number
  activeLicenses: number
  revokedLicenses: number
  expiredLicenses: number
  totalDeployments: number
  totalPlugins: number
  licenseRequestsToday: number
  failedAuthAttempts: number
}

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface PluginInstallationData {
  name: string
  count: number
}

export interface ValidationRateData {
  name: string
  value: number
  fill: string
}
