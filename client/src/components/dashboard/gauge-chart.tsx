import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings, TrendingUp, AlertTriangle } from "lucide-react";

interface UserSettings {
  expenseLimit: string | null;
}

interface DashboardData {
  totalExpenses: string;
}

export default function GaugeChart() {
  const { user } = useAuth();
  const { t } = useI18n();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [limitInput, setLimitInput] = useState("");

  // Fetch user settings
  const { data: userSettings, isLoading: settingsLoading } = useQuery<UserSettings>({
    queryKey: ["/api/settings"],
    enabled: !!user?.id,
  });

  // Fetch dashboard data for current expenses
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard/overview"],
    enabled: !!user?.id,
  });

  // Mutation to update expense limit
  const updateLimitMutation = useMutation({
    mutationFn: async (newLimit: number) => {
      const response = await apiRequest("/api/settings", "PUT", { 
        expenseLimit: newLimit.toString() 
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Limite atualizado",
        description: "Seu limite mensal foi salvo com sucesso.",
      });
      setIsDialogOpen(false);
      setLimitInput("");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Não foi possível salvar o limite mensal.",
        variant: "destructive",
      });
    },
  });

  const handleSaveLimit = () => {
    const limit = parseFloat(limitInput.replace(/[^\d,]/g, "").replace(",", "."));
    if (isNaN(limit) || limit <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido.",
        variant: "destructive",
      });
      return;
    }
    updateLimitMutation.mutate(limit);
  };

  const handleOpenDialog = () => {
    if (userSettings?.expenseLimit) {
      setLimitInput(formatCurrency(parseFloat(userSettings.expenseLimit)));
    }
    setIsDialogOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatCurrencyInput = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, "");
    const floatValue = parseFloat(numericValue) / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(floatValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatCurrencyInput(value);
    setLimitInput(formatted);
  };

  if (settingsLoading || dashboardLoading) {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="flex-1">
          <Skeleton className="h-40 sm:h-48 md:h-64 xl:h-80 2xl:h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  const currentExpenses = dashboardData ? parseFloat(dashboardData.totalExpenses) : 0;
  const expenseLimit = userSettings?.expenseLimit ? parseFloat(userSettings.expenseLimit) : null;

  // Calculate percentage if limit is set
  const percentage = expenseLimit ? Math.min((currentExpenses / expenseLimit) * 100, 100) : 0;
  const isOverBudget = expenseLimit && currentExpenses > expenseLimit;

  // Determine color based on percentage
  const getColor = () => {
    if (!expenseLimit) return "#E5E7EB"; // Gray for no limit
    if (percentage <= 70) return "#10B981"; // Green
    if (percentage <= 90) return "#F59E0B"; // Yellow
    return "#EF4444"; // Red
  };

  // SVG Gauge Chart
  const GaugeChart = () => {
    const size = 240;
    const strokeWidth = 16;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const halfCircumference = circumference / 2;
    
    const progressOffset = expenseLimit 
      ? halfCircumference - (percentage / 100) * halfCircumference
      : halfCircumference;

    return (
      <div className="relative flex flex-col items-center justify-center h-full py-6">
        <div className="relative">
          <svg
            width={size}
            height={size / 2 + 30}
            className="drop-shadow-sm"
            viewBox={`0 0 ${size} ${size / 2 + 30}`}
          >
            {/* Background arc */}
            <path
              d={`M ${strokeWidth/2} ${size/2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${size/2}`}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            
            {/* Progress arc */}
            {expenseLimit && (
              <path
                d={`M ${strokeWidth/2} ${size/2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth/2} ${size/2}`}
                fill="none"
                stroke={getColor()}
                strokeWidth={strokeWidth}
                strokeDasharray={`${halfCircumference} ${circumference}`}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
                style={{
                  filter: `drop-shadow(0 0 6px ${getColor()}40)`
                }}
              />
            )}
            
            {/* Start and end markers */}
            <circle cx={strokeWidth/2} cy={size/2} r="4" fill="#E5E7EB" />
            <circle cx={size - strokeWidth/2} cy={size/2} r="4" fill="#E5E7EB" />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center"
               style={{ top: '20%' }}>
            {expenseLimit ? (
              <div className="space-y-1">
                <div className="text-3xl font-bold text-foreground tracking-tight">
                  {Math.round(percentage)}%
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {formatCurrency(currentExpenses)}
                </div>
                <div className="text-xs text-muted-foreground opacity-75">
                  de {formatCurrency(expenseLimit)}
                </div>
                {isOverBudget && (
                  <div className="flex items-center justify-center mt-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-500 ml-1">Limite excedido</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-w-28">
                <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mx-auto">
                  <Settings className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Defina seu limite mensal
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Status indicator */}
        {expenseLimit && (
          <div className="mt-4 px-3 py-1 rounded-full text-xs font-medium"
               style={{
                 backgroundColor: `${getColor()}20`,
                 color: getColor()
               }}>
            {percentage <= 70 ? 'No limite' : percentage <= 90 ? 'Atenção' : 'Excedido'}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Progresso Mensal</CardTitle>
        <CardDescription className="text-sm">
          {expenseLimit ? "Gastos vs. limite definido" : "Defina seu limite mensal"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div 
              className="cursor-pointer hover:opacity-80 transition-opacity w-full flex items-center justify-center"
              onClick={handleOpenDialog}
            >
              <GaugeChart />
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {expenseLimit ? "Editar Limite Mensal" : "Definir Limite Mensal"}
              </DialogTitle>
              <DialogDescription>
                Configure o valor máximo que você deseja gastar por mês para acompanhar seu progresso.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="limit">Limite mensal de gastos</Label>
                <Input
                  id="limit"
                  type="text"
                  value={limitInput}
                  onChange={handleInputChange}
                  placeholder="R$ 0,00"
                  className="text-right"
                />
                <p className="text-xs text-muted-foreground">
                  Insira o valor máximo que você deseja gastar por mês
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={updateLimitMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveLimit}
                  disabled={updateLimitMutation.isPending}
                >
                  {updateLimitMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}