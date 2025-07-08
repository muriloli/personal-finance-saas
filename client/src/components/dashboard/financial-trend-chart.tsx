import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Calendar, DollarSign } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useTransactions } from '@/hooks/use-transactions';

interface MonthlyData {
  month: string;
  monthKey: string;
  income: number;
  expenses: number;
  balance: number;
  isProjected?: boolean;
}

interface TrendAnalysis {
  incomeDirection: 'up' | 'down' | 'stable';
  expenseDirection: 'up' | 'down' | 'stable';
  balanceDirection: 'up' | 'down' | 'stable';
  incomeChange: number;
  expenseChange: number;
  balanceChange: number;
  avgMonthlyIncome: number;
  avgMonthlyExpenses: number;
  avgMonthlyBalance: number;
}

export default function FinancialTrendChart() {
  const { t, formatCurrency } = useI18n();
  const { transactions } = useTransactions();
  const [trendData, setTrendData] = useState<MonthlyData[]>([]);
  const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null);
  const [hasMinimumData, setHasMinimumData] = useState(false);

  useEffect(() => {
    if (!transactions || transactions.length === 0) return;
    
    // Group transactions by month
    const monthlyMap = new Map<string, { income: number; expenses: number }>();
    const now = new Date();
    
    transactions.forEach(transaction => {
      // Handle different date field names
      const dateField = transaction.transactionDate || transaction.date;
      const date = new Date(dateField);
      
      // Validate date
      if (isNaN(date.getTime())) {
        console.warn('Invalid date for transaction:', transaction);
        return;
      }
      
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { income: 0, expenses: 0 });
      }
      
      const monthData = monthlyMap.get(monthKey)!;
      const amount = parseFloat(transaction.amount);
      
      if (transaction.type === 'income') {
        monthData.income += amount;
      } else {
        monthData.expenses += amount;
      }
    });

    // Get last 6 months to check for minimum 3 months of data
    const months: MonthlyData[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      
      const data = monthlyMap.get(monthKey) || { income: 0, expenses: 0 };
      months.push({
        month: monthName,
        monthKey,
        income: data.income,
        expenses: data.expenses,
        balance: data.income - data.expenses,
        isProjected: false
      });
    }

    // Check if we have at least 3 months with financial activity
    // Count months that have any transactions (income OR expenses > 0)
    const activeMonths = months.filter(m => m.income > 0 || m.expenses > 0);
    
    // For now, let's be less strict and show the chart if we have any transactions
    // This allows users to see the trend analysis even with less than 3 months
    const hasMinimum = transactions.length >= 3; // At least 3 transactions instead of 3 months
    
    // Remove debug logs for production
    
    setHasMinimumData(hasMinimum);

    if (!hasMinimum) {
      setTrendData([]);
      setAnalysis(null);
      return;
    }

    // Use only the last 3 months for analysis
    const lastThreeMonths = months.slice(-3);
    
    // Calculate trend analysis
    const incomeValues = lastThreeMonths.map(m => m.income);
    const expenseValues = lastThreeMonths.map(m => m.expenses);
    const balanceValues = lastThreeMonths.map(m => m.balance);

    const avgIncome = incomeValues.reduce((a, b) => a + b, 0) / incomeValues.length;
    const avgExpenses = expenseValues.reduce((a, b) => a + b, 0) / expenseValues.length;
    const avgBalance = balanceValues.reduce((a, b) => a + b, 0) / balanceValues.length;

    // Calculate linear regression for trends
    const getDirection = (values: number[]) => {
      const n = values.length;
      const sumX = (n * (n - 1)) / 2;
      const sumY = values.reduce((a, b) => a + b, 0);
      const sumXY = values.reduce((sum, y, i) => sum + (i * y), 0);
      const sumX2 = values.reduce((sum, _, i) => sum + (i * i), 0);
      
      const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
      const change = ((values[n-1] - values[0]) / values[0]) * 100;
      
      if (Math.abs(slope) < avgIncome * 0.05) return { direction: 'stable' as const, change: 0 };
      return { 
        direction: slope > 0 ? 'up' as const : 'down' as const, 
        change: isNaN(change) ? 0 : change 
      };
    };

    const incomeAnalysis = getDirection(incomeValues);
    const expenseAnalysis = getDirection(expenseValues);
    const balanceAnalysis = getDirection(balanceValues);

    setAnalysis({
      incomeDirection: incomeAnalysis.direction,
      expenseDirection: expenseAnalysis.direction,
      balanceDirection: balanceAnalysis.direction,
      incomeChange: incomeAnalysis.change,
      expenseChange: expenseAnalysis.change,
      balanceChange: balanceAnalysis.change,
      avgMonthlyIncome: avgIncome,
      avgMonthlyExpenses: avgExpenses,
      avgMonthlyBalance: avgBalance
    });

    // Generate projections for next 3 months
    const projectedMonths: MonthlyData[] = [];
    for (let i = 1; i <= 3; i++) {
      const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthName = futureDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      
      // Simple projection based on trends
      const projectedIncome = Math.max(0, avgIncome + (avgIncome * incomeAnalysis.change * i * 0.01));
      const projectedExpenses = Math.max(0, avgExpenses + (avgExpenses * expenseAnalysis.change * i * 0.01));
      
      projectedMonths.push({
        month: monthName,
        monthKey: `projected-${i}`,
        income: projectedIncome,
        expenses: projectedExpenses,
        balance: projectedIncome - projectedExpenses,
        isProjected: true
      });
    }

    setTrendData([...lastThreeMonths, ...projectedMonths]);
  }, [transactions]);

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTrendChange = (change: number) => {
    if (Math.abs(change) < 0.1) return '0%';
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
          <p className="font-medium text-card-foreground">
            {label} {data.isProjected && '(Projeção)'}
          </p>
          <p className="text-green-600 dark:text-green-400">
            Receitas: {formatCurrency(data.income)}
          </p>
          <p className="text-red-600 dark:text-red-400">
            Despesas: {formatCurrency(data.expenses)}
          </p>
          <p className="text-blue-600 dark:text-blue-400">
            Saldo: {formatCurrency(data.balance)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!hasMinimumData) {
    return (
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <Calendar className="w-5 h-5" />
            Análise de Tendência Financeira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">
              Dados Insuficientes
            </h3>
            <p className="text-muted-foreground max-w-md">
              Para gerar a análise de tendência, você precisa ter pelo menos 3 transações registradas. 
              Continue registrando suas transações para unlock esta funcionalidade.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <TrendingUp className="w-5 h-5" />
          Análise de Tendência Financeira
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Últimos 3 meses + Projeção para 3 meses
        </p>
      </CardHeader>
      <CardContent>
        {/* Trend Analysis Summary */}
        {analysis && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Receitas</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(analysis.avgMonthlyIncome)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(analysis.incomeDirection)}
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {formatTrendChange(analysis.incomeChange)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Despesas</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(analysis.avgMonthlyExpenses)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(analysis.expenseDirection)}
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {formatTrendChange(analysis.expenseChange)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Saldo Médio</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(analysis.avgMonthlyBalance)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(analysis.balanceDirection)}
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {formatTrendChange(analysis.balanceChange)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trend Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Historical data lines (solid) */}
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Receitas"
                connectNulls={false}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="Despesas"
                connectNulls={false}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Saldo"
                connectNulls={false}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend for projected data */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-foreground"></div>
              <span>Dados Históricos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 border-t-2 border-dashed border-muted-foreground"></div>
              <span>Projeção (baseada em tendências)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}