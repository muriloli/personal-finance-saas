import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import TransactionForm from "@/components/forms/transaction-form";
import { useI18n } from "@/lib/i18n";

export default function NewTransaction() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();

  return (
    <>
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/transactions")}
              className="mr-3 sm:mr-4 shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-foreground">{t("addTransactionTitle")}</h1>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {t("recordNewTransaction")}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <TransactionForm />
        </div>
      </main>
    </>
  );
}