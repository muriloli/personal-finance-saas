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
    topCategories: "Principais Categorias",
    noTransactions: "Nenhuma transação encontrada",
    viewAll: "Ver Todas",
    welcomeBack: "Bem-vindo de volta",
    financialOverview: "Aqui está sua visão geral financeira",
    fromLastMonth: "do mês passado",
    lastSixMonths: "Comparação dos últimos 6 meses",
    currentMonthBreakdown: "Detalhamento do mês atual",
    thisMonthSpending: "Gastos deste mês",
    latestFinancialActivity: "Sua atividade financeira mais recente",
    savingsRate: "taxa de economia",

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
    recordNewTransaction: "Registre uma nova transação de receita ou despesa",
    selectCategory: "Selecione uma categoria",
    addNote: "Adicione uma nota sobre esta transação...",
    transactionPreview: "Visualização da Transação",
    newTransaction: "Nova Transação",
    updating: "Atualizando...",
    adding: "Adicionando...",
    updateTransaction: "Atualizar Transação",
    addTransaction: "Adicionar Transação",
    successTitle: "Sucesso!",
    transactionAdded: "Transação adicionada com sucesso.",
    transactionUpdated: "Transação atualizada com sucesso.",
    errorTitle: "Erro",
    failedCreate: "Falha ao criar transação. Tente novamente.",
    failedUpdate: "Falha ao atualizar transação. Tente novamente.",

    // Transactions Page
    transactionsTitle: "Transações",
    manageTransactions: "Gerencie e visualize todas as suas transações financeiras.",
    backToDashboard: "Voltar ao Dashboard",
    exportCSV: "Exportar CSV",
    searchTransactions: "Buscar transações...",
    allCategories: "Todas as Categorias",
    allTypes: "Todos os Tipos",
    startDate: "Data Início",
    endDate: "Data Fim",
    transaction: "Transação",
    actions: "Ações",
    source: "Origem",
    web: "Web",
    
    // Financial Cards
    totalIncome: "Receita Total",
    totalExpenses: "Despesas Totais",
    currentBalance: "Saldo Atual",
    monthlySavings: "Economia Mensal",
    fromLastMonth: "do mês passado",
    savingsRate: "taxa de economia",

    // Transaction table messages
    transactionDeleted: "Transação excluída",
    transactionDeletedDesc: "A transação foi removida com sucesso.",
    failedDelete: "Falha ao excluir transação. Tente novamente.",
    edit: "Editar",
    delete: "Excluir",

    // User Profile
    language: "Idioma",
    logout: "Sair",
    lightMode: "Modo Claro",
    darkMode: "Modo Escuro",

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
    "es-ES-label": "Español (España)",

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
    topCategories: "Top Categories",
    noTransactions: "No transactions found",
    viewAll: "View All",
    welcomeBack: "Welcome back",
    financialOverview: "Here's your financial overview",
    fromLastMonth: "from last month",
    lastSixMonths: "Last 6 months comparison",
    currentMonthBreakdown: "Current month breakdown",
    thisMonthSpending: "This month's spending",
    latestFinancialActivity: "Your latest financial activity",
    savingsRate: "savings rate",

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
    recordNewTransaction: "Record a new income or expense transaction",
    selectCategory: "Select a category",
    addNote: "Add a note about this transaction...",
    transactionPreview: "Transaction Preview",
    newTransaction: "New Transaction",
    updating: "Updating...",
    adding: "Adding...",
    updateTransaction: "Update Transaction",
    addTransaction: "Add Transaction",
    successTitle: "Success!",
    transactionAdded: "Transaction added successfully.",
    transactionUpdated: "Transaction updated successfully.",
    errorTitle: "Error",
    failedCreate: "Failed to create transaction. Please try again.",
    failedUpdate: "Failed to update transaction. Please try again.",

    // Transactions Page
    transactionsTitle: "Transactions",
    manageTransactions: "Manage and view all your financial transactions.",
    backToDashboard: "Back to Dashboard",
    exportCSV: "Export CSV",
    searchTransactions: "Search transactions...",
    allCategories: "All Categories",
    allTypes: "All Types",
    startDate: "Start Date",
    endDate: "End Date",
    transaction: "Transaction",
    actions: "Actions",
    source: "Source",
    web: "Web",
    
    // Financial Cards
    totalIncome: "Total Income",
    totalExpenses: "Total Expenses",
    currentBalance: "Current Balance",
    monthlySavings: "Monthly Savings",
    fromLastMonth: "from last month",
    savingsRate: "savings rate",

    // Transaction table messages
    transactionDeleted: "Transaction deleted",
    transactionDeletedDesc: "The transaction has been removed successfully.",
    failedDelete: "Failed to delete transaction. Please try again.",
    edit: "Edit",
    delete: "Delete",

    // User Profile
    language: "Language",
    logout: "Logout",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",

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
    "es-ES-label": "Español (España)",

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
  "es-ES": {
    // Navigation
    dashboard: "Panel",
    transactions: "Transacciones",
    addTransaction: "Nueva Transacción",
    settings: "Configuraciones",
    help: "Ayuda",
    logout: "Salir",

    // Dashboard
    totalIncome: "Ingresos Totales",
    totalExpenses: "Gastos Totales",
    currentBalance: "Saldo Actual",
    monthlySavings: "Ahorros Mensuales",
    recentTransactions: "Transacciones Recientes",
    incomeVsExpenses: "Ingresos vs Gastos",
    expensesByCategory: "Gastos por Categoría",
    topCategories: "Principales Categorías",
    noTransactions: "No se encontraron transacciones",
    viewAll: "Ver Todas",
    welcomeBack: "Bienvenido de vuelta",
    financialOverview: "Aquí está tu resumen financiero",
    fromLastMonth: "del mes pasado",
    lastSixMonths: "Comparación de los últimos 6 meses",
    currentMonthBreakdown: "Desglose del mes actual",
    thisMonthSpending: "Gastos de este mes",
    latestFinancialActivity: "Tu actividad financiera más reciente",
    savingsRate: "tasa de ahorro",

    // Transaction Form
    transactionType: "Tipo de Transacción",
    income: "Ingreso",
    expense: "Gasto",
    amount: "Monto",
    category: "Categoría",
    date: "Fecha",
    description: "Descripción",
    save: "Guardar",
    cancel: "Cancelar",
    addTransactionTitle: "Agregar Nueva Transacción",
    editTransactionTitle: "Editar Transacción",
    recordNewTransaction: "Registra una nueva transacción de ingreso o gasto",
    selectCategory: "Selecciona una categoría",
    addNote: "Añade una nota sobre esta transacción...",
    transactionPreview: "Vista Previa de Transacción",
    newTransaction: "Nueva Transacción",
    updating: "Actualizando...",
    adding: "Agregando...",
    updateTransaction: "Actualizar Transacción",
    addTransaction: "Agregar Transacción",
    successTitle: "¡Éxito!",
    transactionAdded: "Transacción agregada exitosamente.",
    transactionUpdated: "Transacción actualizada exitosamente.",
    errorTitle: "Error",
    failedCreate: "Error al crear transacción. Inténtalo de nuevo.",
    failedUpdate: "Error al actualizar transacción. Inténtalo de nuevo.",

    // Transactions Page
    transactionsTitle: "Transacciones",
    manageTransactions: "Gestiona y visualiza todas tus transacciones financieras.",
    backToDashboard: "Volver al Dashboard",
    exportCSV: "Exportar CSV",
    searchTransactions: "Buscar transacciones...",
    allCategories: "Todas las Categorías",
    allTypes: "Todos los Tipos",
    startDate: "Fecha Inicio",
    endDate: "Fecha Fin",
    transaction: "Transacción",
    actions: "Acciones",
    source: "Origen",
    web: "Web",
    
    // Financial Cards
    totalIncome: "Ingresos Totales",
    totalExpenses: "Gastos Totales",
    currentBalance: "Saldo Actual",
    monthlySavings: "Ahorro Mensual",
    fromLastMonth: "del mes pasado",
    savingsRate: "tasa de ahorro",

    // Transaction table messages
    transactionDeleted: "Transacción eliminada",
    transactionDeletedDesc: "La transacción ha sido eliminada exitosamente.",
    failedDelete: "Error al eliminar transacción. Inténtalo de nuevo.",
    edit: "Editar",
    delete: "Eliminar",

    // User Profile
    language: "Idioma",
    logout: "Cerrar sesión",
    lightMode: "Modo Claro",
    darkMode: "Modo Oscuro",

    // Settings
    personalInfo: "Información Personal",
    name: "Nombre",
    cpf: "CPF",
    phone: "Teléfono",
    preferences: "Preferencias",
    theme: "Tema",
    currency: "Moneda",
    dateFormat: "Formato de Fecha",
    notifications: "Notificaciones",
    dailyReminder: "Recordatorio Diario",
    monthlyReport: "Informe Mensual",
    expenseAlerts: "Alertas de Gastos",
    whatsappNotifications: "Notificaciones WhatsApp",
    dataManagement: "Gestión de Datos",
    exportData: "Exportar Datos",
    downloadCSV: "Descargar CSV",

    // Common
    search: "Buscar",
    filter: "Filtrar",
    clear: "Limpiar",
    apply: "Aplicar",
    confirm: "Confirmar",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",

    // Language options
    "pt-BR-label": "Português (Brasil)",
    "en-US-label": "English (US)",
    "es-ES-label": "Español (España)",

    // Theme options
    light: "Claro",
    dark: "Oscuro",
    auto: "Automático",

    // Login
    loginTitle: "Iniciar Sesión",
    enterCPF: "Ingrese su CPF",
    login: "Iniciar Sesión",
    invalidCPF: "CPF inválido o usuario no encontrado",

    // Help
    helpTitle: "Centro de Ayuda",
    faq: "Preguntas Frecuentes",
    guides: "Guías",
    support: "Soporte",
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