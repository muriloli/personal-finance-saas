// client/src/lib/transactions.ts

export interface Transaction {
  user_id: string;
  category_id: string;
  type: string; // 'income' ou 'expense'
  amount: number;
  description?: string;
  transaction_date: string; // Format: YYYY-MM-DD
  created_at?: string;
  updated_at?: string;
  source?: string;
}

export interface CreateTransactionData {
  amount: number;
  type: 'income' | 'expense';
  categoryId: string; // ✅ Mudança: era category_id
  description?: string;
  transactionDate: string; // ✅ Mudança: era transaction_date
  source?: string;
}

export interface TransactionFilters {
  categoryId?: string; // ✅ Mudança: era category_id
  type?: 'income' | 'expense' | 'all';
  startDate?: string;
  endDate?: string;
  search?: string;
}

export const TransactionService = {
  // Criar nova transação
  create: async (data: CreateTransactionData): Promise<Transaction> => {
    try {
      const token = localStorage.getItem('sessionToken');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token || !user.id) {
        throw new Error('User not authenticated');
      }

      const transactionData = {
        userId: user.id, // ✅ Incluir userId
        amount: data.amount.toString(), // ✅ String
        type: data.type,
        categoryId: data.categoryId,
        description: data.description || 'No description', // ✅ Garantir que não seja vazio
        transactionDate: data.transactionDate,
        source: data.source || 'web'
      };

      console.log('Creating transaction:', transactionData);

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create transaction');
      }

      return result.transaction || result;
    } catch (error) {
      console.error('Create transaction error:', error);
      throw error;
    }
  },

  // Listar transações com filtros
  list: async (filters: TransactionFilters = {}): Promise<Transaction[]> => {
    try {
      const token = localStorage.getItem('sessionToken');
      
      if (!token) {
        throw new Error('User not authenticated');
      }

      const params = new URLSearchParams();
      
      if (filters.categoryId && filters.categoryId !== 'all') {
        params.append('category', filters.categoryId); // ✅ Backend espera 'category'
      }
      if (filters.type && filters.type !== 'all') {
        params.append('type', filters.type);
      }
      if (filters.startDate) {
        params.append('start_date', filters.startDate);
      }
      if (filters.endDate) {
        params.append('end_date', filters.endDate);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }

      const queryString = params.toString();
      const url = `/api/transactions${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch transactions');
      }

      return result.transactions || result || [];
    } catch (error) {
      console.error('List transactions error:', error);
      throw error;
    }
  },

  // Atualizar transação
  update: async (id: string, data: Partial<CreateTransactionData>): Promise<Transaction> => {
    try {
      const token = localStorage.getItem('sessionToken');
      
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update transaction');
      }

      return result.transaction || result;
    } catch (error) {
      console.error('Update transaction error:', error);
      throw error;
    }
  },

  // Deletar transação
  delete: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('sessionToken');
      
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to delete transaction');
      }
    } catch (error) {
      console.error('Delete transaction error:', error);
      throw error;
    }
  },

  // Obter estatísticas (dashboard)
  getStats: async (period: 'month' | 'year' = 'month'): Promise<{
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    monthlyChange: number;
  }> => {
    try {
      const token = localStorage.getItem('sessionToken');
      
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`/api/transactions/stats?period=${period}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch stats');
      }

      return result.stats || result;
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  },

  // Categorias padrão
  getCategories: (): { income: string[]; expense: string[] } => {
    return {
      income: [
        'salary',
        'freelance', 
        'investment',
        'business',
        'gift',
        'other-income'
      ],
      expense: [
        'food',
        'transport',
        'shopping', 
        'bills',
        'healthcare',
        'entertainment',
        'education',
        'travel',
        'other-expense'
      ]
    };
  },

  // Nomes das categorias para exibição
  getCategoryNames: (): Record<string, string> => {
    return {
      // Income
      'salary': 'Salary',
      'freelance': 'Freelance',
      'investment': 'Investment',
      'business': 'Business',
      'gift': 'Gift',
      'other-income': 'Other Income',
      // Expense
      'food': 'Food',
      'transport': 'Transport',
      'shopping': 'Shopping',
      'bills': 'Bills',
      'healthcare': 'Healthcare',
      'entertainment': 'Entertainment',
      'education': 'Education',
      'travel': 'Travel',
      'other-expense': 'Other Expense'
    };
  },

  // Validação de dados
  validateTransaction: (data: CreateTransactionData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.amount || data.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!data.type || !['income', 'expense'].includes(data.type)) {
      errors.push('Type must be income or expense');
    }

    if (!data.categoryId || data.categoryId.trim() === '') { // ✅ Mudança
      errors.push('Category is required');
    }

    if (!data.transactionDate) { // ✅ Mudança
      errors.push('Date is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};