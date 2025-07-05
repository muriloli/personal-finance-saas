// client/src/hooks/use-transactions.tsx

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { TransactionService } from '@/lib/transactions';
import type { Transaction, CreateTransactionData, TransactionFilters } from '@/lib/transactions';

export function useTransactions(filters: TransactionFilters = {}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query para listar transações
  const {
    data: transactions = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => TransactionService.list(filters),
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  // Mutation para criar transação
  const createMutation = useMutation({
    mutationFn: TransactionService.create,
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      toast({
        title: "Success!",
        description: "Transaction added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mutation para atualizar transação
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTransactionData> }) =>
      TransactionService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      toast({
        title: "Transaction updated!",
        description: "Transaction updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update transaction",
        variant: "destructive",
      });
    },
  });

  // Mutation para deletar transação
  const deleteMutation = useMutation({
    mutationFn: TransactionService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      toast({
        title: "Transaction deleted!",
        description: "Transaction deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete transaction",
        variant: "destructive",
      });
    },
  });

  return {
    // Data
    transactions,
    isLoading,
    error,
    
    // Actions
    createTransaction: createMutation.mutate,
    updateTransaction: updateMutation.mutate,
    deleteTransaction: deleteMutation.mutate,
    refetch,
    
    // Status
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

// Hook para estatísticas do dashboard
export function useTransactionStats(period: 'month' | 'year' = 'month') {
  const { toast } = useToast();

  const {
    data: stats,
    isLoading,
    error
  } = useQuery({
    queryKey: ['transaction-stats', period],
    queryFn: () => TransactionService.getStats(period),
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Dados com fallback seguro
  const safeStats = {
    totalIncome: stats?.totalIncome || 0,
    totalExpenses: stats?.totalExpenses || 0,
    balance: stats?.balance || 0,
    monthlyChange: stats?.monthlyChange || 0
  };

  return {
    stats: safeStats,
    isLoading,
    error
  };
}

// Hook para categorias - usando dados reais do backend
export function useCategories() {
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const token = localStorage.getItem('sessionToken');
      const response = await fetch('/api/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.json();
    },
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  const getCategoriesForType = (type: 'income' | 'expense') => {
    return categories.filter((cat: any) => cat.type === type);
  };

  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat: any) => cat.id === categoryId);
    return category?.name || categoryId;
  };

  return {
    categories,
    isLoading,
    error,
    getCategoriesForType,
    getCategoryName
  };
}