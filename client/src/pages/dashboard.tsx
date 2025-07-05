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

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
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
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleTheme}
                className="relative h-9 w-9 rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
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
