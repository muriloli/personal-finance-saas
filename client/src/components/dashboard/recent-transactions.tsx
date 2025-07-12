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

interface DashboardData {
  recentTransactions: TransactionWithCategory[];
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

  // Transform the data to match expected format
  const data: DashboardData = {
    recentTransactions: (transactionsData as any)?.transactions || [],
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    // Fix timezone issue: parse date as local date to avoid UTC conversion
    const [year, month, day] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
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
    );
  }

  if (!data) return null;

  return (
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
  );
}
