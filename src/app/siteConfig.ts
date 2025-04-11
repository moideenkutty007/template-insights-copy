export const siteConfig = {
  name: "Value Added Vault",
  url: "https://valueaddedvault.com",
  description: "Insights into team activity, capacity, efficiency, and profitability",
  baseLinks: {
    dashboard: "/",
    reports: {
      main: "/reports",
      teamActivity: "/reports/team-activity",
      capacity: "/reports/capacity",
      employeeEfficiency: "/reports/employee-efficiency",
      profitability: "/reports/profitability",
    },
    transactions: "/transactions",
    settings: {
      audit: "/settings/audit",
      users: "/settings/users",
      billing: "/settings/billing",
    },
    login: "/login",
    onboarding: "/onboarding/products",
  },
}

export type siteConfig = typeof siteConfig
