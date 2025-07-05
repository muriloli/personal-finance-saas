import { useAuth } from "@/hooks/use-auth";
import FinancialCards from "@/components/dashboard/financial-cards";
import Charts from "@/components/dashboard/charts";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import { Plus, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/layout/theme-provider";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [, setLocation] = useLocation();

  // Debug: log user data
  console.log("Dashboard - user data:", user);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {user?.name ? (
                  `Welcome back, ${user.name}! Here's your financial overview.`
                ) : (
                  "Welcome back! Here's your financial overview."
                )}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button onClick={() => setLocation("/transactions/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
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
