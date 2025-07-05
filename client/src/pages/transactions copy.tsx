import { useState } from "react";
import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import TransactionFilters from "@/components/transactions/transaction-filters";
import TransactionTable from "@/components/transactions/transaction-table";

export interface TransactionFilters {
  search?: string;
  category?: string;
  type?: "income" | "expense";
  startDate?: string;
  endDate?: string;
}

export default function Transactions() {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState<TransactionFilters>({});

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
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage and view all your financial transactions.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
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
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Filters */}
        <TransactionFilters filters={filters} onFiltersChange={setFilters} />

        {/* Transactions Table */}
        <TransactionTable filters={filters} />
      </main>
    </>
  );
}
