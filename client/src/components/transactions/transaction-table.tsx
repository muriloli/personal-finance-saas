import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, MoreHorizontal, ArrowUpDown } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Transaction, Category } from "@shared/schema";
import { TransactionFilters } from "@/pages/transactions";
import { apiRequest } from "@/lib/queryClient";
import { useI18n } from "@/lib/i18n";

interface TransactionWithCategory extends Transaction {
  category: Category;
}

interface TransactionTableProps {
  filters: TransactionFilters;
}

interface TransactionsResponse {
  transactions: TransactionWithCategory[];
  total: number;
  page: number;
  totalPages: number;
}

type SortField = "description" | "transactionDate" | "amount";
type SortDirection = "asc" | "desc";

export default function TransactionTable({ filters }: TransactionTableProps) {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [sortField, setSortField] = useState<SortField>("transactionDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Create a more reliable query key that React Query can track properly
  const queryKey = [
    "/api/transactions",
    {
      page: page.toString(),
      limit: limit.toString(),
      search: filters.search || "",
      category: filters.category || "",
      type: filters.type || "",
      startDate: filters.startDate || "",
      endDate: filters.endDate || "",
      sortField,
      sortDirection,
    },
  ];

  const { data, isLoading } = useQuery<TransactionsResponse>({
    queryKey,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("sessionToken");
      return apiRequest("DELETE", `/api/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({
        title: t("transactionDeleted"),
        description: t("transactionDeletedDesc"),
      });
    },
    onError: () => {
      toast({
        title: t("errorTitle"),
        description: t("failedDelete"),
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    // Fix timezone issue: parse date as local date to avoid UTC conversion
    const [year, month, day] = dateString.split('-');
    const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return localDate.toLocaleDateString("pt-BR");
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleEdit = (id: string) => {
    setLocation(`/transactions/edit/${id}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No transactions found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your filters or add a new transaction
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 font-medium hover:bg-transparent" 
                    onClick={() => handleSort("description")}
                  >
                    {t("transaction")}
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === "description" ? "text-primary" : ""}`} />
                  </Button>
                </TableHead>
                <TableHead>{t("category")}</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 font-medium hover:bg-transparent" 
                    onClick={() => handleSort("transactionDate")}
                  >
                    {t("date")}
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === "transactionDate" ? "text-primary" : ""}`} />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-0 font-medium hover:bg-transparent" 
                    onClick={() => handleSort("amount")}
                  >
                    {t("amount")}
                    <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === "amount" ? "text-primary" : ""}`} />
                  </Button>
                </TableHead>
                <TableHead>{t("source")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.transactions.map((transaction) => {
                const isIncome = transaction.type === "income";
                
                return (
                  <TableRow key={transaction.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isIncome 
                            ? "bg-green-100 dark:bg-green-900/20" 
                            : "bg-red-100 dark:bg-red-900/20"
                        }`}>
                          <span className={`text-sm ${
                            isIncome 
                              ? "text-green-600 dark:text-green-400" 
                              : "text-red-600 dark:text-red-400"
                          }`}>
                            {isIncome ? "↑" : "↓"}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {transaction.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={
                          isIncome 
                            ? "border-green-200 text-green-700 dark:border-green-700 dark:text-green-300" 
                            : "border-red-200 text-red-700 dark:border-red-700 dark:text-red-300"
                        }
                      >
                        {transaction.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(transaction.transactionDate)}
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        isIncome 
                          ? "text-green-600 dark:text-green-400" 
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        {isIncome ? "+" : "-"}{formatCurrency(parseFloat(transaction.amount))}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {transaction.source === "whatsapp" ? "WhatsApp" : "Web"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(transaction.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t("edit")}
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t("delete")}
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t("deleteTransaction")}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t("deleteConfirmMessage")}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(transaction.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  {t("delete")}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {data.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {t("showing")} {((data.page - 1) * limit) + 1} {t("to")} {Math.min(data.page * limit, data.total)} {t("of")} {data.total} {t("results")}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                {t("previous")}
              </Button>
              <div className="flex items-center space-x-1">
                {[...Array(data.totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(i + 1)}
                    className="w-8 h-8 p-0"
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === data.totalPages}
              >
                {t("next")}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
