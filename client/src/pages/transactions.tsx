import { useState } from "react";
import { Download, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import TransactionFilters from "@/components/transactions/transaction-filters";
import TransactionTable from "@/components/transactions/transaction-table";
import { useI18n } from "@/lib/i18n";

export interface TransactionFilters {
  search?: string;
  category?: string;
  type?: "income" | "expense";
  startDate?: string;
  endDate?: string;
}

export default function Transactions() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<TransactionFilters>({});

  const handleBackToDashboard = async () => {
    // Force refetch all dashboard-related queries
    await Promise.all([
      queryClient.refetchQueries({ queryKey: ["/api/dashboard/overview"] }),
      queryClient.refetchQueries({ queryKey: ["/api/dashboard/charts"] }),
      queryClient.refetchQueries({ queryKey: ["/api/transactions"] })
    ]);
    
    // Navigate to dashboard
    setLocation("/dashboard");
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("sessionToken");
      const response = await fetch("/api/export/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "transactions.csv";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t("transactionsTitle")}</h1>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {t("manageTransactions")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Button variant="outline" onClick={handleBackToDashboard} className="flex-1 sm:flex-none">
                <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{t("backToDashboard")}</span>
                <span className="sm:hidden">Dashboard</span>
              </Button>
              <Button variant="outline" onClick={handleExport} className="flex-1 sm:flex-none">
                <Download className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{t("exportCSV")}</span>
                <span className="sm:hidden">Export</span>
              </Button>
              <Button onClick={() => setLocation("/transactions/new")} className="flex-1 sm:flex-none">
                <Plus className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{t("addTransactionTitle")}</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Filters */}
        <TransactionFilters filters={filters} onFiltersChange={setFilters} />

        {/* Transactions Table */}
        <TransactionTable filters={filters} />
      </main>
    </>
  );
}

