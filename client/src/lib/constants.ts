export const APP_NAME = "FinanceFlow";
export const APP_DESCRIPTION = "Personal Finance Management Platform";

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  TRANSACTIONS: "/transactions",
  NEW_TRANSACTION: "/transactions/new",
  SETTINGS: "/settings",
  HELP: "/help",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    ME: "/api/auth/me",
  },
  DASHBOARD: {
    OVERVIEW: "/api/dashboard/overview",
    CHARTS: "/api/dashboard/charts",
    RECENT: "/api/dashboard/recent",
  },
  TRANSACTIONS: {
    LIST: "/api/transactions",
    CREATE: "/api/transactions",
    UPDATE: (id: string) => `/api/transactions/${id}`,
    DELETE: (id: string) => `/api/transactions/${id}`,
  },
  CATEGORIES: {
    LIST: "/api/categories",
  },
  SETTINGS: {
    GET: "/api/settings",
    UPDATE: "/api/settings",
  },
  EXPORT: {
    TRANSACTIONS: "/api/export/transactions",
  },
} as const;

export const TRANSACTION_TYPES = {
  INCOME: "income",
  EXPENSE: "expense",
} as const;

export const TRANSACTION_SOURCES = {
  WEB: "web",
  WHATSAPP: "whatsapp",
} as const;

export const CURRENCIES = {
  BRL: { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  USD: { code: "USD", symbol: "$", name: "US Dollar" },
  EUR: { code: "EUR", symbol: "€", name: "Euro" },
} as const;

export const DATE_FORMATS = {
  "DD/MM/YYYY": "DD/MM/YYYY",
  "MM/DD/YYYY": "MM/DD/YYYY",
  "YYYY-MM-DD": "YYYY-MM-DD",
} as const;

export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export const DEFAULT_SETTINGS = {
  dailyReminder: false,
  reminderTime: "09:00",
  monthlyReport: true,
  expenseAlerts: true,
  expenseLimit: 5000,
  defaultCurrency: "BRL",
  dateFormat: "DD/MM/YYYY",
  theme: "light",
  whatsappNotifications: true,
  autoCategorization: true,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

export const SESSION_CONFIG = {
  DURATION: 60 * 60 * 1000, // 60 minutes in milliseconds
  REFRESH_THRESHOLD: 10 * 60 * 1000, // Refresh when 10 minutes left
} as const;

export const CHART_COLORS = [
  "#ef4444", // red-500
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#84cc16", // lime-500
  "#f97316", // orange-500
  "#6366f1", // indigo-500
] as const;

export const DEFAULT_CATEGORIES = {
  INCOME: [
    { name: "Salary", icon: "briefcase", color: "#10b981" },
    { name: "Freelance", icon: "laptop", color: "#3b82f6" },
    { name: "Investment", icon: "trending-up", color: "#8b5cf6" },
    { name: "Gift", icon: "gift", color: "#ec4899" },
    { name: "Other Income", icon: "plus-circle", color: "#6b7280" },
  ],
  EXPENSE: [
    { name: "Food & Drinks", icon: "utensils", color: "#ef4444" },
    { name: "Transportation", icon: "car", color: "#3b82f6" },
    { name: "Shopping", icon: "shopping-bag", color: "#f59e0b" },
    { name: "Entertainment", icon: "music", color: "#8b5cf6" },
    { name: "Bills & Utilities", icon: "file-text", color: "#06b6d4" },
    { name: "Healthcare", icon: "heart", color: "#ec4899" },
    { name: "Education", icon: "book", color: "#10b981" },
    { name: "Travel", icon: "plane", color: "#f97316" },
    { name: "Personal Care", icon: "user", color: "#84cc16" },
    { name: "Other Expenses", icon: "minus-circle", color: "#6b7280" },
  ],
} as const;

export const VALIDATION_RULES = {
  CPF: {
    MIN_LENGTH: 11,
    MAX_LENGTH: 11,
    PATTERN: /^\d{11}$/,
  },
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
  },
  AMOUNT: {
    MIN: 0.01,
    MAX: 999999.99,
  },
  DESCRIPTION: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 500,
  },
} as const;

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "This field is required",
  INVALID_CPF: "Please enter a valid CPF",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid phone number",
  INVALID_AMOUNT: "Please enter a valid amount",
  INVALID_DATE: "Please enter a valid date",
  SERVER_ERROR: "Something went wrong. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "Your session has expired. Please login again.",
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
} as const;

export const SUCCESS_MESSAGES = {
  TRANSACTION_CREATED: "Transaction added successfully!",
  TRANSACTION_UPDATED: "Transaction updated successfully!",
  TRANSACTION_DELETED: "Transaction deleted successfully!",
  SETTINGS_UPDATED: "Settings saved successfully!",
  DATA_EXPORTED: "Data exported successfully!",
  LOGIN_SUCCESS: "Welcome back!",
  LOGOUT_SUCCESS: "You have been logged out successfully.",
} as const;

export const FEATURE_FLAGS = {
  ENABLE_DARK_MODE: true,
  ENABLE_EXPORT: true,
  ENABLE_WHATSAPP_INTEGRATION: true,
  ENABLE_BUDGET_ALERTS: true,
  ENABLE_ANALYTICS: true,
} as const;
