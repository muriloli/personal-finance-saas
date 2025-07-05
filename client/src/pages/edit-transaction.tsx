import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useParams } from "wouter";
import TransactionForm from "@/components/forms/transaction-form";

export default function EditTransaction() {
  const [, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();

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
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Edit Transaction</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Update the transaction details.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <TransactionForm 
            transactionId={id} 
            onSuccess={() => setLocation("/transactions")}
          />
        </div>
      </main>
    </>
  );
}