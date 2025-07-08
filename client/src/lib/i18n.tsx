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
    monthlyProgress: "Progresso Mensal",
    defineYourMonthlyLimit: "Defina seu limite mensal",
    monthlySpendingLimit: "Limite mensal de gastos",
    enterMaxAmountWish: "Insira o valor máximo que você deseja gastar por mês",
    clickToDefineLimit: "Clique para definir seu limite mensal",
    setMonthlyLimit: "Definir Limite Mensal",
    configureMaxValue: "Configure o valor máximo que você deseja gastar por mês para acompanhar seu progresso.",
    withinLimit: "No limite",
    attention: "Atenção",
    atTheLimit: "No limite",
    exceeded: "Excedido",
    limitExceeded: "Limite excedido",
    expenseVsLimit: "Gastos vs. limite definido",
    
    // Motivational Messages
    under_control: "Gastos sob controle - parabéns! ✨",
    be_careful: "Cuidado para não extrapolar! ⚡",
    out_of_control: "Gastos fora de controle! 📈",
    
    // Financial Trend Chart
    financialTrendAnalysis: "Análise de Tendência Financeira",
    lastThreeMonthsProjection: "Últimos 3 meses + Projeção para 3 meses",
    monthlyIncome: "Receitas",
    monthlyExpenses: "Despesas",
    averageBalance: "Saldo Médio",
    historicalData: "Dados Históricos",
    projectionBased: "Projeção (baseada em tendências)",
    insufficientData: "Dados Insuficientes",
    insufficientDataMessage: "Para gerar a análise de tendência, você precisa ter pelo menos 3 transações registradas. Continue registrando suas transações para unlock esta funcionalidade.",

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
    transactionHeader: "Transação",
    dateHeader: "Data",
    amountHeader: "Valor",
    sourceHeader: "Origem",
    actionsHeader: "Ações",
    editAction: "Editar",
    deleteAction: "Excluir",
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
    
    // User Management
    userManagement: "Gerenciamento de Usuários",
    adminPanel: "Painel Administrativo",
    searchByNameOrCpf: "Buscar por nome ou CPF...",
    addNewUser: "Adicionar Novo Usuário",
    systemUsers: "Usuários do Sistema",
    manageUserAccounts: "Gerenciar contas de usuário, permissões e níveis de acesso",
    fullNameField: "Nome Completo",
    enterFullName: "Digite o nome completo",
    status: "Status",
    role: "Função",
    created: "Criado",
    actions: "Ações",
    active: "Ativo",
    inactive: "Inativo",
    admin: "Administrador",
    userRole: "Usuário",
    editUser: "Editar Usuário",
    updateUserInformation: "Atualizar informações do usuário",
    createNewUserAccount: "Criar uma nova conta de usuário",
    enterCpfDigits: "Digite o CPF (11 dígitos)",
    enterPhoneNumber: "Digite o número de telefone",
    updateUser: "Atualizar Usuário",
    createUser: "Criar Usuário",
    deleteUser: "Excluir Usuário",
    deleteUserConfirmation: "Tem certeza de que deseja excluir este usuário? Esta ação não pode ser desfeita.",
    userRegisteredSuccessfully: "Usuário registrado com sucesso",
    userUpdatedSuccessfully: "Usuário atualizado com sucesso",
    userDeletedSuccessfully: "Usuário excluído com sucesso",
    failedToRegisterUser: "Falha ao registrar usuário",
    failedToUpdateUser: "Falha ao atualizar usuário",
    failedToDeleteUser: "Falha ao excluir usuário",
    noUsersFound: "Nenhum usuário encontrado",
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
    monthlyProgress: "Monthly Progress",
    defineYourMonthlyLimit: "Define your monthly limit",
    monthlySpendingLimit: "Monthly spending limit",
    enterMaxAmountWish: "Enter the maximum amount you wish to spend per month",
    clickToDefineLimit: "Click to define your monthly limit",
    setMonthlyLimit: "Set Monthly Limit",
    configureMaxValue: "Configure the maximum value you want to spend per month to track your progress.",
    withinLimit: "Within limit",
    attention: "Attention",
    atTheLimit: "At the limit",
    exceeded: "Exceeded",
    limitExceeded: "Limit exceeded",
    expenseVsLimit: "Expenses vs. defined limit",
    
    // Motivational Messages
    under_control: "Spending under control - congratulations! ✨",
    be_careful: "Be careful not to exceed! ⚡",
    out_of_control: "Spending out of control! 📈",
    
    // Financial Trend Chart
    financialTrendAnalysis: "Financial Trend Analysis",
    lastThreeMonthsProjection: "Last 3 months + 3-month projection",
    monthlyIncome: "Income",
    monthlyExpenses: "Expenses",
    averageBalance: "Average Balance",
    historicalData: "Historical Data",
    projectionBased: "Projection (based on trends)",
    insufficientData: "Insufficient Data",
    insufficientDataMessage: "To generate the trend analysis, you need to have at least 3 recorded transactions. Continue recording your transactions to unlock this feature.",
    be_careful: "Be careful not to overspend! ⚡",
    out_of_control: "Spending out of control! 📈",

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
    transactionHeader: "Transaction",
    dateHeader: "Date",
    amountHeader: "Amount",
    sourceHeader: "Source",
    actionsHeader: "Actions",
    editAction: "Edit",
    deleteAction: "Delete",
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
    
    // User Management
    userManagement: "User Management",
    adminPanel: "Admin Panel",
    searchByNameOrCpf: "Search by name or CPF...",
    addNewUser: "Add New User",
    systemUsers: "System Users",
    manageUserAccounts: "Manage user accounts, permissions, and access levels",
    fullNameField: "Full Name",
    enterFullName: "Enter full name",
    status: "Status",
    role: "Role",
    created: "Created",
    actions: "Actions",
    active: "Active",
    inactive: "Inactive",
    admin: "Admin",
    userRole: "User",
    editUser: "Edit User",
    updateUserInformation: "Update user information",
    createNewUserAccount: "Create a new user account",
    enterCpfDigits: "Enter CPF (11 digits)",
    enterPhoneNumber: "Enter phone number",
    updateUser: "Update User",
    createUser: "Create User",
    deleteUser: "Delete User",
    deleteUserConfirmation: "Are you sure you want to delete this user? This action cannot be undone.",
    userRegisteredSuccessfully: "User registered successfully",
    userUpdatedSuccessfully: "User updated successfully", 
    userDeletedSuccessfully: "User deleted successfully",
    failedToRegisterUser: "Failed to register user",
    failedToUpdateUser: "Failed to update user",
    failedToDeleteUser: "Failed to delete user",
    noUsersFound: "No users found",
    somethingWentWrong: "Something went wrong",
    networkError: "Network error",
    serverError: "Server error",
    

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
    monthlyProgress: "Progreso Mensual",
    defineYourMonthlyLimit: "Define tu límite mensual",
    monthlySpendingLimit: "Límite mensual de gastos",
    enterMaxAmountWish: "Ingresa el monto máximo que deseas gastar por mes",
    clickToDefineLimit: "Haz clic para definir tu límite mensual",
    setMonthlyLimit: "Definir Límite Mensual",
    configureMaxValue: "Configura el valor máximo que deseas gastar por mes para seguir tu progreso.",
    withinLimit: "Dentro del límite",
    attention: "Atención",
    atTheLimit: "En el límite",
    exceeded: "Excedido",
    limitExceeded: "Límite excedido",
    expenseVsLimit: "Gastos vs. límite definido",
    
    // Motivational Messages
    under_control: "Gastos bajo control - ¡felicitaciones! ✨",
    be_careful: "¡Cuidado de no exceder! ⚡",
    out_of_control: "¡Gastos fuera de control! 📈",
    
    // Financial Trend Chart
    financialTrendAnalysis: "Análisis de Tendencia Financiera",
    lastThreeMonthsProjection: "Últimos 3 meses + Proyección para 3 meses",
    monthlyIncome: "Ingresos",
    monthlyExpenses: "Gastos",
    averageBalance: "Balance Promedio",
    historicalData: "Datos Históricos",
    projectionBased: "Proyección (basada en tendencias)",
    insufficientData: "Datos Insuficientes",
    insufficientDataMessage: "Para generar el análisis de tendencias, necesitas tener al menos 3 transacciones registradas. Continúa registrando tus transacciones para desbloquear esta funcionalidad.",

    // Transaction Form
    transactionType: "Tipo de Transacción",
    income: "Ingreso",
    expense: "Gasto",
    amount: "Monto",
    category: "Categoría",
    dateForm: "Fecha",
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
    transactionHeader: "Transacción",
    dateHeader: "Fecha",
    amountHeader: "Monto",
    sourceHeader: "Origen",
    actionsHeader: "Acciones",
    editAction: "Editar",
    deleteAction: "Eliminar",
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
    
    // User Management
    userManagement: "Gestión de Usuarios",
    adminPanel: "Panel de Administración",
    searchByNameOrCpf: "Buscar por nombre o CPF...",
    addNewUser: "Agregar Nuevo Usuario",
    systemUsers: "Usuarios del Sistema",
    manageUserAccounts: "Administrar cuentas de usuario, permisos y niveles de acceso",
    fullNameField: "Nombre Completo",
    enterFullName: "Ingrese nombre completo",
    status: "Estado",
    role: "Rol",
    created: "Creado",
    actions: "Acciones",
    active: "Activo",
    inactive: "Inactivo",
    admin: "Administrador",
    userRole: "Usuario",
    editUser: "Editar Usuario",
    updateUserInformation: "Actualizar información del usuario",
    createNewUserAccount: "Crear una nueva cuenta de usuario",
    enterCpfDigits: "Ingrese CPF (11 dígitos)",
    enterPhoneNumber: "Ingrese número de teléfono",
    updateUser: "Actualizar Usuario",
    createUser: "Crear Usuario",
    deleteUser: "Eliminar Usuario",
    deleteUserConfirmation: "¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.",
    userRegisteredSuccessfully: "Usuario registrado exitosamente",
    userUpdatedSuccessfully: "Usuario actualizado exitosamente",
    userDeletedSuccessfully: "Usuario eliminado exitosamente",
    failedToRegisterUser: "Error al registrar usuario",
    failedToUpdateUser: "Error al actualizar usuario",
    failedToDeleteUser: "Error al eliminar usuario",
    noUsersFound: "No se encontraron usuarios",
  },
} as const;

type Language = keyof typeof translations;
type TranslationKey = keyof typeof translations["pt-BR"];

interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
  formatCurrency: (amount: number) => string;
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

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat(language === "pt-BR" ? "pt-BR" : "en-US", {
      style: "currency",
      currency: language === "pt-BR" ? "BRL" : "USD",
    }).format(amount);
  };

  const value: I18nContextType = {
    language,
    setLanguage,
    t,
    formatCurrency,
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