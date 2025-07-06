import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
    transactionPreview: "Prévia da Transação",
    newTransaction: "Nova Transação",
    updateTransaction: "Atualizar Transação",
    adding: "Adicionando...",

    // Transaction List
    all: "Todas",
    incomeOnly: "Receitas",
    expenseOnly: "Despesas",
    filter: "Filtrar",
    search: "Buscar",
    edit: "Editar",
    delete: "Excluir",
    deleteConfirm: "Tem certeza de que deseja excluir esta transação?",
    confirmDelete: "Confirmar Exclusão",
    deleteMessage: "Esta ação não pode ser desfeita.",
    successDelete: "Transação excluída com sucesso!",
    failedDelete: "Falha ao excluir transação. Tente novamente.",
    noTransactionsFound: "Nenhuma transação encontrada",
    showingTransactions: "Mostrando transações",
    lastUpdated: "Última atualização",
    loadingTransactions: "Carregando transações...",
    successCreate: "Transação criada com sucesso!",
    failedCreate: "Falha ao criar transação. Tente novamente.",
    successEdit: "Transação atualizada com sucesso!",
    failedEdit: "Falha ao atualizar transação. Tente novamente.",

    // Transaction Page
    transactionsTitle: "Transações",
    manageTransactions: "Gerencie suas transações financeiras",
    backToDashboard: "Voltar ao Painel",
    exportCSV: "Exportar CSV",
    searchTransactions: "Buscar transações",
    allCategories: "Todas as Categorias",
    allTypes: "Todos os Tipos",
    startDate: "Data Inicial",
    endDate: "Data Final",

    // Transaction Table
    transactionDeleted: "Transação excluída",
    transactionDeletedDesc: "A transação foi excluída com sucesso",
    errorTitle: "Erro",
    
    // Pagination
    showing: "Mostrando",
    to: "a",
    of: "de",
    results: "resultados",
    previous: "Anterior",
    next: "Próximo",
    
    // Table Headers
    transaction: "Transação",
    date: "Data",
    amount: "Valor",
    source: "Origem",
    actions: "Ações",
    edit: "Editar",
    delete: "Excluir",
    deleteTransaction: "Excluir Transação",
    deleteConfirmMessage: "Tem certeza de que deseja excluir esta transação? Esta ação não pode ser desfeita.",

    // User Profile
    language: "Idioma",
    lightMode: "Modo Claro",
    darkMode: "Modo Escuro",

    // Settings
    personalInfo: "Informações Pessoais",
    name: "Nome",
    cpf: "CPF",
    phone: "Telefone",
    preferences: "Preferências",
    notifications: "Notificações",
    privacy: "Privacidade",
    about: "Sobre",
    version: "Versão",
    theme: "Tema",
    currency: "Moeda",
    export: "Exportar",
    backup: "Backup",
    
    // Login
    login: "Entrar",
    loginTitle: "Entre em sua conta",
    loginSubtitle: "Digite seu CPF para acessar sua conta",
    cpfPlaceholder: "Digite seu CPF",
    enterCpf: "Digite seu CPF",
    loginError: "Erro ao fazer login. Verifique seu CPF e tente novamente.",
    loginSuccess: "Login realizado com sucesso!",
    loggingIn: "Entrando...",
    invalidCpf: "CPF inválido",
    cpfRequired: "CPF é obrigatório",

    // Common
    loading: "Carregando...",
    saving: "Salvando...",
    deleting: "Excluindo...",
    updating: "Atualizando...",
    creating: "Criando...",
    editing: "Editando...",
    searching: "Buscando...",
    filtering: "Filtrando...",
    processing: "Processando...",
    errorOccurred: "Ocorreu um erro",
    tryAgain: "Tente novamente",
    somethingWentWrong: "Algo deu errado",
    networkError: "Erro de rede",
    serverError: "Erro do servidor",
    
    // User Registration
    userRegistration: "Cadastro de Usuários",
    registerNewUser: "Cadastrar Novo Usuário",
    registerUserDescription: "Adicione um novo usuário ao sistema",
    fullName: "Nome Completo",
    enterFullName: "Digite o nome completo",
    registering: "Cadastrando",
    registerUser: "Cadastrar Usuário",
  },
  "en": {
    // Navigation
    dashboard: "Dashboard",
    transactions: "Transactions",
    addTransaction: "Add Transaction",
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
    updateTransaction: "Update Transaction",
    adding: "Adding...",

    // Transaction List
    all: "All",
    incomeOnly: "Income",
    expenseOnly: "Expenses",
    filter: "Filter",
    search: "Search",
    edit: "Edit",
    delete: "Delete",
    deleteConfirm: "Are you sure you want to delete this transaction?",
    confirmDelete: "Confirm Delete",
    deleteMessage: "This action cannot be undone.",
    successDelete: "Transaction deleted successfully!",
    failedDelete: "Failed to delete transaction. Please try again.",
    noTransactionsFound: "No transactions found",
    showingTransactions: "Showing transactions",
    lastUpdated: "Last updated",
    loadingTransactions: "Loading transactions...",
    successCreate: "Transaction created successfully!",
    failedCreate: "Failed to create transaction. Please try again.",
    successEdit: "Transaction updated successfully!",
    failedEdit: "Failed to update transaction. Please try again.",

    // Transaction Page
    transactionsTitle: "Transactions",
    manageTransactions: "Manage your financial transactions",
    backToDashboard: "Back to Dashboard",
    exportCSV: "Export CSV",
    searchTransactions: "Search transactions",
    allCategories: "All Categories",
    allTypes: "All Types",
    startDate: "Start Date",
    endDate: "End Date",

    // Transaction Table
    transactionDeleted: "Transaction deleted",
    transactionDeletedDesc: "Transaction has been deleted successfully",
    errorTitle: "Error",
    
    // Pagination
    showing: "Showing",
    to: "to",
    of: "of",
    results: "results",
    previous: "Previous",
    next: "Next",
    
    // Table Headers
    transaction: "Transaction",
    date: "Date",
    amount: "Amount",
    source: "Source",
    actions: "Actions",
    edit: "Edit",
    delete: "Delete",
    deleteTransaction: "Delete Transaction",
    deleteConfirmMessage: "Are you sure you want to delete this transaction? This action cannot be undone.",

    // User Profile
    language: "Language",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",

    // Settings
    personalInfo: "Personal Information",
    name: "Name",
    cpf: "CPF",
    phone: "Phone",
    preferences: "Preferences",
    notifications: "Notifications",
    privacy: "Privacy",
    about: "About",
    version: "Version",
    theme: "Theme",
    currency: "Currency",
    export: "Export",
    backup: "Backup",
    
    // Login
    login: "Login",
    loginTitle: "Login to your account",
    loginSubtitle: "Enter your CPF to access your account",
    cpfPlaceholder: "Enter your CPF",
    enterCpf: "Enter your CPF",
    loginError: "Login failed. Please check your CPF and try again.",
    loginSuccess: "Login successful!",
    loggingIn: "Logging in...",
    invalidCpf: "Invalid CPF",
    cpfRequired: "CPF is required",

    // Common
    loading: "Loading...",
    saving: "Saving...",
    deleting: "Deleting...",
    updating: "Updating...",
    creating: "Creating...",
    editing: "Editing...",
    searching: "Searching...",
    filtering: "Filtering...",
    processing: "Processing...",
    errorOccurred: "An error occurred",
    tryAgain: "Try again",
    somethingWentWrong: "Something went wrong",
    networkError: "Network error",
    serverError: "Server error",
    
    // User Registration
    userRegistration: "User Registration",
    registerNewUser: "Register New User",
    registerUserDescription: "Add a new user to the system",
    fullName: "Full Name",
    enterFullName: "Enter full name",
    registering: "Registering",
    registerUser: "Register User",
  },
  "es": {
    // Navigation
    dashboard: "Panel",
    transactions: "Transacciones",
    addTransaction: "Nueva Transacción",
    settings: "Configuraciones",
    help: "Ayuda",
    logout: "Cerrar sesión",

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
    addNote: "Agrega una nota sobre esta transacción...",
    transactionPreview: "Vista Previa de Transacción",
    newTransaction: "Nueva Transacción",
    updateTransaction: "Actualizar Transacción",
    adding: "Agregando...",

    // Transaction List
    all: "Todas",
    incomeOnly: "Ingresos",
    expenseOnly: "Gastos",
    filter: "Filtrar",
    search: "Buscar",
    edit: "Editar",
    delete: "Eliminar",
    deleteConfirm: "¿Estás seguro de que quieres eliminar esta transacción?",
    confirmDelete: "Confirmar Eliminación",
    deleteMessage: "Esta acción no se puede deshacer.",
    successDelete: "¡Transacción eliminada exitosamente!",
    failedDelete: "Error al eliminar transacción. Inténtalo de nuevo.",
    noTransactionsFound: "No se encontraron transacciones",
    showingTransactions: "Mostrando transacciones",
    lastUpdated: "Última actualización",
    loadingTransactions: "Cargando transacciones...",
    successCreate: "¡Transacción creada exitosamente!",
    failedCreate: "Error al crear transacción. Inténtalo de nuevo.",
    successEdit: "¡Transacción actualizada exitosamente!",
    failedEdit: "Error al actualizar transacción. Inténtalo de nuevo.",

    // Transaction Page
    transactionsTitle: "Transacciones",
    manageTransactions: "Gestiona tus transacciones financieras",
    backToDashboard: "Volver al Panel",
    exportCSV: "Exportar CSV",
    searchTransactions: "Buscar transacciones",
    allCategories: "Todas las Categorías",
    allTypes: "Todos los Tipos",
    startDate: "Fecha Inicial",
    endDate: "Fecha Final",

    // Transaction Table
    transactionDeleted: "Transacción eliminada",
    transactionDeletedDesc: "La transacción se eliminó con éxito",
    errorTitle: "Error",
    
    // Pagination
    showing: "Mostrando",
    to: "a",
    of: "de",
    results: "resultados",
    previous: "Anterior",
    next: "Siguiente",
    
    // Table Headers
    transaction: "Transacción",
    date: "Fecha",
    amount: "Monto",
    source: "Origen",
    actions: "Acciones",
    edit: "Editar",
    delete: "Eliminar",
    deleteTransaction: "Eliminar Transacción",
    deleteConfirmMessage: "¿Estás seguro de que quieres eliminar esta transacción? Esta acción no se puede deshacer.",

    // User Profile
    language: "Idioma",
    lightMode: "Modo Claro",
    darkMode: "Modo Oscuro",

    // Settings
    personalInfo: "Información Personal",
    name: "Nombre",
    cpf: "CPF",
    phone: "Teléfono",
    preferences: "Preferencias",
    notifications: "Notificaciones",
    privacy: "Privacidad",
    about: "Acerca de",
    version: "Versión",
    theme: "Tema",
    currency: "Moneda",
    export: "Exportar",
    backup: "Respaldo",
    
    // Login
    login: "Iniciar Sesión",
    loginTitle: "Inicia sesión en tu cuenta",
    loginSubtitle: "Ingresa tu CPF para acceder a tu cuenta",
    cpfPlaceholder: "Ingresa tu CPF",
    enterCpf: "Ingresa tu CPF",
    loginError: "Error al iniciar sesión. Verifica tu CPF e inténtalo de nuevo.",
    loginSuccess: "¡Inicio de sesión exitoso!",
    loggingIn: "Iniciando sesión...",
    invalidCpf: "CPF inválido",
    cpfRequired: "CPF es requerido",

    // Common
    loading: "Cargando...",
    saving: "Guardando...",
    deleting: "Eliminando...",
    updating: "Actualizando...",
    creating: "Creando...",
    editing: "Editando...",
    searching: "Buscando...",
    filtering: "Filtrando...",
    processing: "Procesando...",
    errorOccurred: "Ocurrió un error",
    tryAgain: "Inténtalo de nuevo",
    somethingWentWrong: "Algo salió mal",
    networkError: "Error de red",
    serverError: "Error del servidor",
    
    // User Registration
    userRegistration: "Registro de Usuario",
    registerNewUser: "Registrar Nuevo Usuario",
    registerUserDescription: "Agregar un nuevo usuario al sistema",
    fullName: "Nombre Completo",
    enterFullName: "Ingrese nombre completo",
    registering: "Registrando",
    registerUser: "Registrar Usuario",
  },
} as const;

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
    const stored = localStorage.getItem("language");
    return (stored as Language) || defaultLanguage;
  });

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

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function formatCurrency(amount: number, language: Language = "pt-BR"): string {
  const locale = language === "pt-BR" ? "pt-BR" : language === "en" ? "en-US" : "es-ES";
  const currency = language === "pt-BR" ? "BRL" : language === "en" ? "USD" : "EUR";
  
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function formatDate(date: Date | string, language: Language = "pt-BR"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const locale = language === "pt-BR" ? "pt-BR" : language === "en" ? "en-US" : "es-ES";
  
  return dateObj.toLocaleDateString(locale);
}