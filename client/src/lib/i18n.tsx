import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Translation objects
const translations = {
  "pt-BR": {
    // Navigation
    dashboard: "Painel",
    transactions: "Transações",
    addTransaction: "Nova Transação",
    settings: "Configurações",
    help: "Ajuda",
    logout: "Sair",

    // Dashboard
    totalIncome: "Receita Total",
    totalExpenses: "Despesas Totais",
    currentBalance: "Saldo Atual",
    monthlySavings: "Economia Mensal",
    recentTransactions: "Transações Recentes",
    incomeVsExpenses: "Receitas vs Despesas",
    expensesByCategory: "Despesas por Categoria",
    noTransactions: "Nenhuma transação encontrada",
    viewAll: "Ver Todas",

    // Transaction Form
    transactionType: "Tipo de Transação",
    income: "Receita",
    expense: "Despesa",
    amount: "Valor",
    category: "Categoria",
    date: "Data",
    description: "Descrição",
    save: "Salvar",
    cancel: "Cancelar",
    addTransactionTitle: "Adicionar Nova Transação",
    editTransactionTitle: "Editar Transação",

    // Settings
    personalInfo: "Informações Pessoais",
    name: "Nome",
    cpf: "CPF",
    phone: "Telefone",
    preferences: "Preferências",
    language: "Idioma",
    theme: "Tema",
    currency: "Moeda",
    dateFormat: "Formato de Data",
    notifications: "Notificações",
    dailyReminder: "Lembrete Diário",
    monthlyReport: "Relatório Mensal",
    expenseAlerts: "Alertas de Gastos",
    whatsappNotifications: "Notificações WhatsApp",
    dataManagement: "Gerenciamento de Dados",
    exportData: "Exportar Dados",
    downloadCSV: "Baixar CSV",

    // Common
    search: "Pesquisar",
    filter: "Filtrar",
    clear: "Limpar",
    apply: "Aplicar",
    edit: "Editar",
    delete: "Excluir",
    confirm: "Confirmar",
    loading: "Carregando...",
    error: "Erro",
    success: "Sucesso",

    // Language options
    "pt-BR-label": "Português (Brasil)",
    "en-US-label": "English (US)",

    // Theme options
    light: "Claro",
    dark: "Escuro",
    auto: "Automático",

    // Login
    loginTitle: "Entrar no Sistema",
    enterCPF: "Digite seu CPF",
    login: "Entrar",
    invalidCPF: "CPF inválido ou usuário não encontrado",

    // Help
    helpTitle: "Central de Ajuda",
    faq: "Perguntas Frequentes",
    guides: "Guias",
    support: "Suporte",
  },
  "en-US": {
    // Navigation
    dashboard: "Dashboard",
    transactions: "Transactions",
    addTransaction: "New Transaction",
    settings: "Settings",
    help: "Help",
    logout: "Logout",

    // Dashboard
    totalIncome: "Total Income",
    totalExpenses: "Total Expenses",
    currentBalance: "Current Balance",
    monthlySavings: "Monthly Savings",
    recentTransactions: "Recent Transactions",
    incomeVsExpenses: "Income vs Expenses",
    expensesByCategory: "Expenses by Category",
    noTransactions: "No transactions found",
    viewAll: "View All",

    // Transaction Form
    transactionType: "Transaction Type",
    income: "Income",
    expense: "Expense",
    amount: "Amount",
    category: "Category",
    date: "Date",
    description: "Description",
    save: "Save",
    cancel: "Cancel",
    addTransactionTitle: "Add New Transaction",
    editTransactionTitle: "Edit Transaction",

    // Settings
    personalInfo: "Personal Information",
    name: "Name",
    cpf: "CPF",
    phone: "Phone",
    preferences: "Preferences",
    language: "Language",
    theme: "Theme",
    currency: "Currency",
    dateFormat: "Date Format",
    notifications: "Notifications",
    dailyReminder: "Daily Reminder",
    monthlyReport: "Monthly Report",
    expenseAlerts: "Expense Alerts",
    whatsappNotifications: "WhatsApp Notifications",
    dataManagement: "Data Management",
    exportData: "Export Data",
    downloadCSV: "Download CSV",

    // Common
    search: "Search",
    filter: "Filter",
    clear: "Clear",
    apply: "Apply",
    edit: "Edit",
    delete: "Delete",
    confirm: "Confirm",
    loading: "Loading...",
    error: "Error",
    success: "Success",

    // Language options
    "pt-BR-label": "Português (Brasil)",
    "en-US-label": "English (US)",

    // Theme options
    light: "Light",
    dark: "Dark",
    auto: "Auto",

    // Login
    loginTitle: "Login to System",
    enterCPF: "Enter your CPF",
    login: "Login",
    invalidCPF: "Invalid CPF or user not found",

    // Help
    helpTitle: "Help Center",
    faq: "FAQ",
    guides: "Guides",
    support: "Support",
  },
};

type Language = keyof typeof translations;
type TranslationKey = keyof typeof translations["pt-BR"];

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function I18nProvider({ children, defaultLanguage = "pt-BR" }: I18nProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get language from localStorage first
    const stored = localStorage.getItem("language");
    if (stored && Object.keys(translations).includes(stored)) {
      return stored as Language;
    }
    return defaultLanguage;
  });

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations["pt-BR"][key] || key;
  };

  const value: I18nContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

// Helper function to format currency based on language
export function formatCurrency(amount: number, language: Language = "pt-BR"): string {
  if (language === "en-US") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  } else {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  }
}

// Helper function to format date based on language
export function formatDate(date: Date | string, language: Language = "pt-BR"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (language === "en-US") {
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } else {
    return dateObj.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}