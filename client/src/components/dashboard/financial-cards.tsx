import { useQuery } from "@tanstack/react-query";
import { ArrowUpIcon, ArrowDownIcon, Wallet, PiggyBank } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n";
import { StaggerContainer, StaggerItem, ScaleOnHover } from "@/components/layout/page-transition";

interface DashboardOverview {
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  monthlySavings: number;
  incomeChange: number;
  expenseChange: number;
  balanceChange: number;
  savingsRate: number;
}

export default function FinancialCards() {
  const { t } = useI18n();
  const { data: overview, isLoading } = useQuery<DashboardOverview>({
    queryKey: ["/api/dashboard/overview"],
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-lg mr-4" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
              <div className="mt-4">
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!overview) return null;

  const cards = [
    {
      title: t("totalIncome"),
      value: overview.totalIncome,
      change: overview.incomeChange,
      icon: ArrowUpIcon,
      iconBg: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400",
      changeColor: "text-green-600 dark:text-green-400",
    },
    {
      title: t("totalExpenses"),
      value: overview.totalExpenses,
      change: overview.expenseChange,
      icon: ArrowDownIcon,
      iconBg: "bg-red-100 dark:bg-red-900/20",
      iconColor: "text-red-600 dark:text-red-400",
      changeColor: "text-red-600 dark:text-red-400",
    },
    {
      title: t("currentBalance"),
      value: overview.currentBalance,
      change: overview.balanceChange,
      icon: Wallet,
      iconBg: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      changeColor: overview.balanceChange >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
    },
    {
      title: t("monthlySavings"),
      value: overview.monthlySavings,
      change: overview.savingsRate,
      icon: PiggyBank,
      iconBg: "bg-orange-100 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400",
      changeColor: "text-green-600 dark:text-green-400",
      suffix: t("savingsRate"),
    },
  ];

  return (
    <StaggerContainer>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <StaggerItem key={index}>
              <ScaleOnHover>
                <Card className="hover:shadow-md transition-shadow h-full">
            <CardContent className="p-4 sm:p-6 h-full flex flex-col">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${card.iconBg} rounded-lg p-2 sm:p-3`}>
                  <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${card.iconColor}`} />
                </div>
                <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                    {card.title}
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">
                    {formatCurrency(card.value)}
                  </p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex-1 flex flex-col justify-end">
                <div className="flex items-center text-xs sm:text-sm">
                  <span className={`flex items-center ${card.changeColor}`}>
                    <ArrowUpIcon className="mr-1 h-3 w-3" />
                    {formatPercentage(card.change)}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    {t("fromLastMonth")} {card.suffix && `• ${card.suffix}`}
                  </span>
                </div>
              </div>
            </CardContent>
                </Card>
              </ScaleOnHover>
            </StaggerItem>
          );
        })}
      </div>
    </StaggerContainer>
  );
}
