import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Coffee, Car, ShoppingBag, Utensils } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { Transaction, Category } from "@shared/schema";
import { useI18n } from "@/lib/i18n";

interface TransactionWithCategory extends Transaction {
  category: Category;
}

interface TopCategory {
  name: string;
  amount: number;
  color: string;
}

interface DashboardData {
  recentTransactions: TransactionWithCategory[];
  topCategories: TopCategory[];
  budgetAlert?: {
    category: string;
    percentage: number;
  };
}

const categoryIcons: Record<string, React.ComponentType<any>> = {
  "Food & Drinks": Utensils,
  "Transportation": Car,
  "Shopping": ShoppingBag,
  "Entertainment": Coffee,
};

export default function RecentTransactions() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ["/api/transactions", "page=1&limit=5"],
  });

  // Get all transactions to calculate top categories
  const { data: allTransactionsData } = useQuery({
    queryKey: ["/api/transactions", "page=1&limit=1000"],
  });

  // Calculate top categories from current month transactions only
  const calculateTopCategories = (): TopCategory[] => {
    const transactions = (allTransactionsData as any)?.transactions || [];
    const categoryMap = new Map<string, { amount: number; color: string; name: string }>();
    
    // Get current month boundaries
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    transactions.forEach((transaction: any) => {
      if (transaction.type === 'expense') {
        // Check if transaction is in current month
        const transactionDate = new Date(transaction.transactionDate || transaction.date);
        if (transactionDate >= currentMonthStart && transactionDate <= currentMonthEnd) {
          const categoryName = transaction.category.name;
          const amount = parseFloat(transaction.amount);
          
          if (categoryMap.has(categoryName)) {
            categoryMap.get(categoryName)!.amount += amount;
          } else {
            categoryMap.set(categoryName, {
              name: categoryName,
              amount: amount,
              color: transaction.category.color || '#8B5CF6'
            });
          }
        }
      }
    });
    
    // Convert to array and sort by amount (descending)
    return Array.from(categoryMap.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Top 5 categories
  };

  // Transform the data to match expected format
  const data: DashboardData = {
    recentTransactions: (transactionsData as any)?.transactions || [],
    topCategories: calculateTopCategories(),
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("pt-BR", { 
        month: "short", 
        day: "numeric" 
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 sm:space-x-4">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="text-right shrink-0">
                    <Skeleton className="h-4 w-16 mb-1" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Skeleton className="w-3 h-3 rounded-full mr-3" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {/* Recent Transactions */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg sm:text-xl">{t("recentTransactions")}</CardTitle>
                <CardDescription className="text-sm">{t("latestFinancialActivity")}</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation("/transactions")}
                className="shrink-0"
              >
{t("viewAll")}
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {data.recentTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm">{t("noTransactions")}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setLocation("/transactions/new")}
                  >
                    Add your first transaction
                  </Button>
                </div>
              ) : (
                data.recentTransactions.map((transaction) => {
                  const IconComponent = categoryIcons[transaction.category.name] || Coffee;
                  const isIncome = transaction.type === "income";
                  
                  return (
                    <div key={transaction.id} className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isIncome 
                          ? "bg-green-100 dark:bg-green-900/20" 
                          : "bg-red-100 dark:bg-red-900/20"
                      }`}>
                        <IconComponent className={`h-4 w-4 ${
                          isIncome 
                            ? "text-green-600 dark:text-green-400" 
                            : "text-red-600 dark:text-red-400"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {transaction.description}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {transaction.category.name}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className={`text-sm font-medium ${
                          isIncome 
                            ? "text-green-600 dark:text-green-400" 
                            : "text-red-600 dark:text-red-400"
                        }`}>
                          {isIncome ? "+" : "-"}{formatCurrency(parseFloat(transaction.amount))}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(transaction.transactionDate)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-4 sm:space-y-6">
        {/* Top Categories */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">{t("topCategories")}</CardTitle>
            <CardDescription className="text-sm">{t("thisMonthSpending")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.topCategories.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No spending data yet
              </p>
            ) : (
              data.topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3 shrink-0" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm text-muted-foreground truncate">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(category.amount)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Budget Alert */}
        {data.budgetAlert && (
          <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 dark:text-orange-400 text-sm">!</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                    Budget Alert
                  </h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    You've spent {data.budgetAlert.percentage}% of your monthly budget for{" "}
                    {data.budgetAlert.category}.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
