import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Calendar, DollarSign, Settings } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useTransactions } from '@/hooks/use-transactions';
import { useTheme } from '@/components/layout/theme-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const { theme } = useTheme();
  const [trendData, setTrendData] = useState<MonthlyData[]>([]);
  const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null);
  const [hasMinimumData, setHasMinimumData] = useState(false);
  const [trendPerspective, setTrendPerspective] = useState<'pessimistic' | 'realistic' | 'optimistic'>('realistic');
  
  // Get chart text color based on theme
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const textColor = isDark ? '#ffffff' : '#374151';

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
    
    // Require at least 3 months with transactions for meaningful trend analysis
    const hasMinimum = activeMonths.length >= 3;
    
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
    
    // Calculate perspective-adjusted averages for the cards
    const perspectiveFactors = {
      pessimistic: { 
        trendFactor: 0.4,
        maxGrowth: 0.08,
        dampingMultiplier: 0.15,
        negativeBoost: 2.2
      },
      realistic: { 
        trendFactor: 0.3,
        maxGrowth: 0.05,
        dampingMultiplier: 0.2,
        negativeBoost: 1.0
      },
      optimistic: { 
        trendFactor: 0.8,
        maxGrowth: 0.15,
        dampingMultiplier: 0.05,
        negativeBoost: 0.5
      }
    };
    
    const factors = perspectiveFactors[trendPerspective];
    
    // Apply perspective adjustments to averages
    let adjustedIncomeChange = incomeAnalysis.change * factors.trendFactor;
    let adjustedExpenseChange = expenseAnalysis.change * factors.trendFactor;
    let adjustedBalanceChange = balanceAnalysis.change * factors.trendFactor;
    
    // Apply perspective-specific adjustments
    if (trendPerspective === 'pessimistic') {
      // In pessimistic mode: reduce income growth, increase expense growth
      if (adjustedIncomeChange > 0) adjustedIncomeChange *= 0.3; // Reduce positive income trends
      if (adjustedExpenseChange < 0) adjustedExpenseChange *= 0.3; // Reduce positive expense reductions
      adjustedIncomeChange -= 5; // Add a pessimistic penalty to income
      adjustedExpenseChange += 8; // Add a pessimistic penalty to expenses
    } else if (trendPerspective === 'optimistic') {
      // In optimistic mode: boost income, reduce expenses  
      if (adjustedIncomeChange < 0) adjustedIncomeChange *= 0.3; // Reduce negative income trends
      if (adjustedExpenseChange > 0) adjustedExpenseChange *= 0.3; // Reduce negative expense increases
      adjustedIncomeChange += 8; // Add optimistic boost to income
      adjustedExpenseChange -= 5; // Add optimistic reduction to expenses
    }
    
    // Apply negative boost for realistic mode only
    if (trendPerspective === 'realistic') {
      if (adjustedIncomeChange < 0) adjustedIncomeChange *= factors.negativeBoost;
      if (adjustedExpenseChange > 0) adjustedExpenseChange *= factors.negativeBoost;
      if (adjustedBalanceChange < 0) adjustedBalanceChange *= factors.negativeBoost;
    }
    
    // Calculate adjusted averages based on perspective
    const adjustedAvgIncome = avgIncome * (1 + (adjustedIncomeChange * 0.01));
    const adjustedAvgExpenses = avgExpenses * (1 + (adjustedExpenseChange * 0.01));
    const adjustedAvgBalance = adjustedAvgIncome - adjustedAvgExpenses;

    setAnalysis({
      incomeDirection: incomeAnalysis.direction,
      expenseDirection: expenseAnalysis.direction,
      balanceDirection: balanceAnalysis.direction,
      incomeChange: adjustedIncomeChange,
      expenseChange: adjustedExpenseChange,
      balanceChange: adjustedBalanceChange,
      avgMonthlyIncome: adjustedAvgIncome,
      avgMonthlyExpenses: adjustedAvgExpenses,
      avgMonthlyBalance: adjustedAvgBalance
    });

    // Generate projections for next 3 months based on selected perspective
    const projectedMonths: MonthlyData[] = [];
    for (let i = 1; i <= 3; i++) {
      const futureDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthName = futureDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      
      const factors = perspectiveFactors[trendPerspective];
      const dampingFactor = Math.max(0.3, 1 - (i * factors.dampingMultiplier));
      
      // Apply perspective-based adjustments
      let incomeChangeAdjusted = incomeAnalysis.change * factors.trendFactor;
      let expenseChangeAdjusted = expenseAnalysis.change * factors.trendFactor;
      
      // Apply perspective-specific adjustments for projections
      if (trendPerspective === 'pessimistic') {
        // In pessimistic mode: reduce income growth, increase expense growth
        if (incomeChangeAdjusted > 0) incomeChangeAdjusted *= 0.3; // Reduce positive income trends
        if (expenseChangeAdjusted < 0) expenseChangeAdjusted *= 0.3; // Reduce positive expense reductions
        incomeChangeAdjusted -= 5; // Add a pessimistic penalty to income
        expenseChangeAdjusted += 8; // Add a pessimistic penalty to expenses
      } else if (trendPerspective === 'optimistic') {
        // In optimistic mode: boost income, reduce expenses  
        if (incomeChangeAdjusted < 0) incomeChangeAdjusted *= 0.3; // Reduce negative income trends
        if (expenseChangeAdjusted > 0) expenseChangeAdjusted *= 0.3; // Reduce negative expense increases
        incomeChangeAdjusted += 8; // Add optimistic boost to income
        expenseChangeAdjusted -= 5; // Add optimistic reduction to expenses
      } else {
        // Realistic mode: apply negative boost
        if (incomeChangeAdjusted < 0) incomeChangeAdjusted *= factors.negativeBoost;
        if (expenseChangeAdjusted > 0) expenseChangeAdjusted *= factors.negativeBoost;
      }
      
      // Cap the change rate and apply dampening
      const cappedIncomeChange = Math.min(Math.max(incomeChangeAdjusted, -factors.maxGrowth * 100), factors.maxGrowth * 100);
      const cappedExpenseChange = Math.min(Math.max(expenseChangeAdjusted, -factors.maxGrowth * 100), factors.maxGrowth * 100);
      
      // Calculate projections
      const incomeGrowth = (avgIncome * cappedIncomeChange * dampingFactor * 0.01);
      const expenseGrowth = (avgExpenses * cappedExpenseChange * dampingFactor * 0.01);
      
      // Add some randomness to make it more realistic (±3%)
      const randomFactor = 0.97 + (Math.random() * 0.06);
      
      // Apply perspective multipliers
      let perspectiveIncomeMultiplier = 1.0;
      let perspectiveExpenseMultiplier = 1.0;
      
      if (trendPerspective === 'pessimistic') {
        perspectiveIncomeMultiplier = 0.9; // Reduce income by 10%
        perspectiveExpenseMultiplier = 1.1; // Increase expenses by 10%
      } else if (trendPerspective === 'optimistic') {
        perspectiveIncomeMultiplier = 1.1; // Increase income by 10%
        perspectiveExpenseMultiplier = 0.9; // Reduce expenses by 10%
      }
      
      const projectedIncome = Math.max(0, (avgIncome + incomeGrowth * randomFactor) * perspectiveIncomeMultiplier);
      const projectedExpenses = Math.max(0, (avgExpenses + expenseGrowth * randomFactor) * perspectiveExpenseMultiplier);
      
      projectedMonths.push({
        month: monthName,
        monthKey: `projected-${i}`,
        income: projectedIncome,
        expenses: projectedExpenses,
        balance: projectedIncome - projectedExpenses,
        isProjected: true
      });
    }

    // Combine historical and projected data with connection point
    const combinedData = [];
    
    // Add historical data
    for (let i = 0; i < lastThreeMonths.length; i++) {
      const month = lastThreeMonths[i];
      combinedData.push({
        month: month.month,
        monthKey: month.monthKey,
        income: month.income,
        expenses: month.expenses,
        balance: month.balance,
        incomeProjected: null,
        expensesProjected: null,
        balanceProjected: null,
        isProjected: false
      });
    }
    
    // Add connection point (last historical month with projected values)
    if (lastThreeMonths.length > 0 && projectedMonths.length > 0) {
      const lastHistorical = lastThreeMonths[lastThreeMonths.length - 1];
      combinedData[combinedData.length - 1] = {
        ...combinedData[combinedData.length - 1],
        incomeProjected: lastHistorical.income,
        expensesProjected: lastHistorical.expenses,
        balanceProjected: lastHistorical.balance
      };
    }
    
    // Add projected data
    for (let i = 0; i < projectedMonths.length; i++) {
      const month = projectedMonths[i];
      combinedData.push({
        month: month.month,
        monthKey: month.monthKey,
        income: null,
        expenses: null,
        balance: null,
        incomeProjected: month.income,
        expensesProjected: month.expenses,
        balanceProjected: month.balance,
        isProjected: true
      });
    }
    
    setTrendData(combinedData);
  }, [transactions, trendPerspective]);

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
      const isProjected = data.isProjected;
      
      // Get values from the appropriate data keys
      const income = data.income || data.incomeProjected || 0;
      const expenses = data.expenses || data.expensesProjected || 0;
      const balance = data.balance || data.balanceProjected || 0;
      
      return (
        <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
          <p className="font-medium text-card-foreground">
            {label} {isProjected && `(${t("projectionBased")})`}
          </p>
          <p className="text-green-600 dark:text-green-400">
            {t("income")}: {formatCurrency(income)}
          </p>
          <p className="text-red-600 dark:text-red-400">
            {t("expense")}: {formatCurrency(expenses)}
          </p>
          <p className="text-blue-600 dark:text-blue-400">
            {t("currentBalance")}: {formatCurrency(balance)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!hasMinimumData) {
    return (
      <Card className="bg-card border-border shadow-sm hidden xl:block">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Calendar className="w-5 h-5" />
                {t("financialTrendAnalysis")}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Select value={trendPerspective} onValueChange={(value: 'pessimistic' | 'realistic' | 'optimistic') => setTrendPerspective(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={t("trendPerspective")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pessimistic">{t("pessimistic")}</SelectItem>
                  <SelectItem value="realistic">{t("realistic")}</SelectItem>
                  <SelectItem value="optimistic">{t("optimistic")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">
              {t("insufficientData")}
            </h3>
            <p className="text-muted-foreground max-w-md">
              {t("insufficientDataMessage")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border shadow-sm hidden xl:block">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <TrendingUp className="w-5 h-5" />
              {t("financialTrendAnalysis")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("lastThreeMonthsProjection")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={trendPerspective} onValueChange={(value: 'pessimistic' | 'realistic' | 'optimistic') => setTrendPerspective(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t("trendPerspective")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pessimistic">{t("pessimistic")}</SelectItem>
                <SelectItem value="realistic">{t("realistic")}</SelectItem>
                <SelectItem value="optimistic">{t("optimistic")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Trend Analysis Summary */}
        {analysis && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-background border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t("monthlyIncome")}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">{t("monthlyExpenses")}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">{t("averageBalance")}</p>
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
              <XAxis 
                dataKey="month" 
                stroke={textColor}
                fontSize={12}
                tick={{ fill: textColor }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke={textColor}
                fontSize={12}
                tickFormatter={(value) => {
                  if (value >= 1000) {
                    return `${formatCurrency(value / 1000 * 1000).slice(0, -3)}k`;
                  }
                  return formatCurrency(value);
                }}
                tick={{ fill: textColor }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* Historical data lines (solid) */}
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10b981" 
                strokeWidth={3}
                name={t("income")}
                connectNulls={false}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#ef4444" 
                strokeWidth={3}
                name={t("expense")}
                connectNulls={false}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name={t("currentBalance")}
                connectNulls={false}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
              />
              
              {/* Projected data lines (dashed) */}
              <Line 
                type="monotone" 
                dataKey="incomeProjected" 
                stroke="#10b981" 
                strokeWidth={3}
                name=""
                connectNulls={false}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                strokeDasharray="8 4"
                legendType="none"
              />
              <Line 
                type="monotone" 
                dataKey="expensesProjected" 
                stroke="#ef4444" 
                strokeWidth={3}
                name=""
                connectNulls={false}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 5 }}
                strokeDasharray="8 4"
                legendType="none"
              />
              <Line 
                type="monotone" 
                dataKey="balanceProjected" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name=""
                connectNulls={false}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                strokeDasharray="8 4"
                legendType="none"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend for projected data */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-foreground"></div>
              <span>{t("historicalData")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 border-t-2 border-dashed border-muted-foreground"></div>
              <span>{t("projectionBased")}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}