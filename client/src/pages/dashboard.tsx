import { useAuth } from "@/hooks/use-auth";
import FinancialCards from "@/components/dashboard/financial-cards";
import Charts from "@/components/dashboard/charts";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import { Plus, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/layout/theme-provider";
import { useLocation } from "wouter";
import LanguageSelector from "@/components/LanguageSelector";
import { useI18n } from "@/lib/i18n";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [, setLocation] = useLocation();
  const { t } = useI18n();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

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
              <div className="w-48">
                <LanguageSelector />
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleTheme}
                className="relative h-9 w-9 rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors shrink-0"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button onClick={() => setLocation("/transactions/new")} className="flex-1 sm:flex-none">
                <Plus className="mr-2 h-4 w-4" />
                <span className="xl:hidden">Add</span>
                <span className="hidden xl:inline">{t("addTransaction")}</span>
              </Button>
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

        {/* Recent Transactions */}
        <RecentTransactions />
      </main>
    </>
  );
}
