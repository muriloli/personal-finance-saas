import { useAuth } from "@/hooks/use-auth";
import FinancialCards from "@/components/dashboard/financial-cards";
import Charts from "@/components/dashboard/charts";
import FinancialTrendChart from "@/components/dashboard/financial-trend-chart";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { t } = useI18n();

  return (
    <>
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t("dashboard")}</h1>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {user?.name ? (
                  `${t("welcomeBack")}, ${user.name}! ${t("financialOverview")}.`
                ) : (
                  `${t("welcomeBack")}! ${t("financialOverview")}.`
                )}
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <Button onClick={() => setLocation("/transactions/new")} className="flex-1 sm:flex-none">
                <Plus className="mr-2 h-4 w-4" />
                <span className="xl:hidden">Add</span>
                <span className="hidden xl:inline">{t("addTransaction")}</span>
              </Button>
              <UserProfileDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {/* Financial Overview Cards */}
        <FinancialCards />

        {/* Charts Section */}
        <Charts />

        {/* Financial Trend Chart */}
        <div className="mt-8 mb-8">
          <FinancialTrendChart />
        </div>

        {/* Recent Transactions */}
        <RecentTransactions />
      </main>
    </>
  );
}
