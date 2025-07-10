import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowUp, ArrowDown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { transactionFormSchema, Category } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { z } from "zod";

type TransactionFormData = z.infer<typeof transactionFormSchema>;

interface TransactionFormProps {
  transactionId?: string;
  onSuccess?: () => void;
}

export default function TransactionForm({ transactionId, onSuccess }: TransactionFormProps) {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = useState<"income" | "expense">("expense");
  const { isAuthenticated, user } = useAuth();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch existing transaction data for editing
  const { data: existingTransaction } = useQuery({
    queryKey: ["/api/transactions", transactionId],
    queryFn: async () => {
      if (!transactionId) return null;
      const response = await apiRequest("GET", `/api/transactions/${transactionId}`);
      return response.json();
    },
    enabled: !!transactionId,
  });

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: "expense",
      amount: "",
      description: "",
      transactionDate: new Date().toLocaleDateString('en-CA'), // Format: YYYY-MM-DD
      categoryId: "",
      source: "web",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TransactionFormData) => {
      return apiRequest("POST", "/api/transactions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/overview"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/charts"] });
      toast({
        title: t("successTitle"),
        description: t("transactionAdded"),
      });
      if (onSuccess) {
        onSuccess();
      } else {
        setLocation("/transactions");
      }
    },
    onError: (error: any) => {
      toast({
        title: t("errorTitle"),
        description: error.message || t("failedCreate"),
        variant: "destructive",
      });
    },
  });

  const editMutation = useMutation({
    mutationFn: async (data: TransactionFormData) => {
      return apiRequest("PUT", `/api/transactions/${transactionId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/overview"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/charts"] });
      toast({
        title: t("successTitle"),
        description: t("transactionUpdated"),
      });
      if (onSuccess) {
        onSuccess();
      } else {
        setLocation("/transactions");
      }
    },
    onError: (error: any) => {
      toast({
        title: t("errorTitle"),
        description: error.message || t("failedUpdate"),
        variant: "destructive",
      });
    },
  });

  const handleCancel = () => {
    // Navigate back to transactions
    setLocation("/transactions");
  };

  const onSubmit = (data: TransactionFormData) => {
    if (transactionId) {
      editMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const watchedValues = form.watch();
  const filteredCategories = categories?.filter(cat => cat.type === selectedType) || [];

  // Update selected type when form type changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "type" && value.type) {
        setSelectedType(value.type as "income" | "expense");
        // Reset category when type changes
        form.setValue("categoryId", "");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Populate form with existing transaction data when editing
  useEffect(() => {
    if (existingTransaction) {
      const transaction = existingTransaction;
      form.reset({
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description || "",
        transactionDate: transaction.transactionDate,
        categoryId: transaction.categoryId,
        source: transaction.source || "web",
      });
      setSelectedType(transaction.type);
    }
  }, [existingTransaction, form]);

  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  const selectedCategory = filteredCategories.find(cat => cat.id === watchedValues.categoryId);

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Transaction Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">{t("transactionType")}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3"
                    >
                      <div className="relative">
                        <RadioGroupItem value="income" id="income" className="sr-only" />
                        <Label
                          htmlFor="income"
                          className={`flex items-center justify-center p-3 sm:p-4 text-sm font-medium rounded-lg cursor-pointer border-2 transition-colors ${
                            watchedValues.type === "income"
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                              : "border-border bg-background hover:bg-muted"
                          }`}
                        >
                          <ArrowUp className="mr-2 h-4 w-4 text-green-500" />
{t("income")}
                        </Label>
                      </div>
                      <div className="relative">
                        <RadioGroupItem value="expense" id="expense" className="sr-only" />
                        <Label
                          htmlFor="expense"
                          className={`flex items-center justify-center p-3 sm:p-4 text-sm font-medium rounded-lg cursor-pointer border-2 transition-colors ${
                            watchedValues.type === "expense"
                              ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                              : "border-border bg-background hover:bg-muted"
                          }`}
                        >
                          <ArrowDown className="mr-2 h-4 w-4 text-red-500" />
{t("expense")}
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("amount")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <span className="absolute left-8 top-3 text-muted-foreground text-sm">R$</span>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-14 sm:pl-16 text-base sm:text-lg py-3"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("category")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="py-3">
                        <SelectValue placeholder={t("selectCategory")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredCategories.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          No categories available for {selectedType}
                        </div>
                      ) : (
                        filteredCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center">
                              {category.color && (
                                <div
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: category.color }}
                                />
                              )}
                              {category.name}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="transactionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("date")}</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" className="py-3" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t("addNote")}
                      rows={3}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transaction Preview */}
            <div className="bg-muted rounded-lg p-4 border">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">{t("transactionPreview")}</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    selectedType === "income" 
                      ? "bg-green-100 dark:bg-green-900/20" 
                      : "bg-red-100 dark:bg-red-900/20"
                  }`}>
                    {selectedType === "income" ? (
                      <ArrowUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {watchedValues.description || t("newTransaction")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedType === "income" ? t("income") : t("expense")} • {
                        selectedCategory?.name || t("category")
                      } • {
                        watchedValues.transactionDate 
                          ? new Date(watchedValues.transactionDate).toLocaleDateString("pt-BR")
                          : "Today"
                      }
                    </p>
                  </div>
                </div>
                <p className={`text-lg font-bold ${
                  selectedType === "income" 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                }`}>
                  {selectedType === "income" ? "+" : "-"}
                  {formatCurrency(watchedValues.amount || "0")}
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleCancel}
                disabled={createMutation.isPending || editMutation.isPending}
              >
{t("cancel")}
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || editMutation.isPending}
                className="min-w-[120px]"
              >
                {(createMutation.isPending || editMutation.isPending) ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {transactionId ? t("updating") : t("adding")}
                  </>
                ) : (
                  transactionId ? t("updateTransaction") : t("addTransaction")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
