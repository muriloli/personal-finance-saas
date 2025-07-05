import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { I18nProvider } from "@/lib/i18n";
import { queryClient } from "./lib/queryClient";

// Pages
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Transactions from "@/pages/transactions.tsx";
import NewTransaction from "@/pages/new-transaction";
import EditTransaction from "@/pages/edit-transaction";
import Settings from "@/pages/settings";
import Help from "@/pages/help";
import NotFound from "@/pages/not-found";
import Unauthorized from "@/pages/unauthorized";

// Layout
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col flex-1">
        <MobileNav />
        <div className="pt-16 lg:pt-0 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/unauthorized" component={Unauthorized} />
      {isAuthenticated ? (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/transactions" component={Transactions} />
          <Route path="/transactions/new" component={NewTransaction} />
          <Route path="/transactions/edit/:id" component={EditTransaction} />
          <Route path="/settings" component={Settings} />
          <Route path="/help" component={Help} />
          <Route component={NotFound} />
        </>
      ) : (
        <Route component={Login} />
      )}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
