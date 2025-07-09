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
  const { t, formatCurrency } = useI18n();
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
    if (percentage <= 60) return "#10B981"; // Green: 0-60%
    if (percentage <= 85) return "#F59E0B"; // Yellow: 61-85%
    return "#EF4444"; // Red: 86-100%+
  };

  // SVG Gauge Chart
  const GaugeChart = () => {
    // Responsive sizing
    const baseSize = 280;
    const strokeWidth = 32; // Even thicker gauge bar
    const radius = (baseSize - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const halfCircumference = circumference / 2;
    
    const progressOffset = expenseLimit 
      ? halfCircumference - (percentage / 100) * halfCircumference
      : halfCircumference;

    // Motivational message based on percentage
    const getMotivationalMessage = () => {
      if (percentage <= 60) return t('under_control'); // Green: 0-60%
      if (percentage <= 85) return t('be_careful');    // Yellow: 61-85%
      return t('out_of_control');                      // Red: 86-100%+
    };

    // Status text based on percentage - "at the limit" only for 95%+
    const getStatusText = () => {
      if (percentage <= 70) return t('withinLimit');
      if (percentage <= 90) return t('attention');
      if (percentage >= 95) return t('atTheLimit');
      return t('exceeded');
    };

    return (
      <div className="relative flex flex-col items-center justify-center h-full py-4 sm:py-6">
        <div className="relative w-full max-w-xs sm:max-w-sm">
          <svg
            width="100%"
            height="auto"
            className="drop-shadow-sm"
            viewBox={`0 0 ${baseSize} ${baseSize / 2 + 40}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background arc */}
            <path
              d={`M ${strokeWidth/2} ${baseSize/2} A ${radius} ${radius} 0 0 1 ${baseSize - strokeWidth/2} ${baseSize/2}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="text-muted/30 dark:text-muted/20"
            />
            
            {/* Progress arc */}
            {expenseLimit && (
              <path
                d={`M ${strokeWidth/2} ${baseSize/2} A ${radius} ${radius} 0 0 1 ${baseSize - strokeWidth/2} ${baseSize/2}`}
                fill="none"
                stroke={getColor()}
                strokeWidth={strokeWidth}
                strokeDasharray={`${halfCircumference} ${circumference}`}
                strokeDashoffset={progressOffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
                style={{
                  filter: `drop-shadow(0 0 8px ${getColor()}50)`
                }}
              />
            )}
            
            {/* Start and end markers */}
            <circle cx={strokeWidth/2} cy={baseSize/2} r="5" fill="currentColor" className="text-muted/40" />
            <circle cx={baseSize - strokeWidth/2} cy={baseSize/2} r="5" fill="currentColor" className="text-muted/40" />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center"
               style={{ top: '15%' }}>
            {expenseLimit ? (
              <div className="space-y-1">
                <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
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
                    <span className="text-xs text-red-500 ml-1">{t('limitExceeded')}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-w-28">
                <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mx-auto">
                  <Settings className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('clickToDefineLimit')}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Motivational message only */}
        {expenseLimit && (
          <div className="mt-3 flex flex-col items-center">
            <div className="text-sm font-medium text-center px-2"
                 style={{ color: getColor() }}>
              {getMotivationalMessage()}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg hover:-translate-y-1 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">{t('monthlyProgress')}</CardTitle>
        <CardDescription className="text-sm">
          {expenseLimit ? t('expenseVsLimit') : t('defineYourMonthlyLimit')}
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
                {expenseLimit ? t('setMonthlyLimit') : t('setMonthlyLimit')}
              </DialogTitle>
              <DialogDescription>
                {t('configureMaxValue')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="limit">{t('monthlySpendingLimit')}</Label>
                <Input
                  id="limit"
                  type="text"
                  value={limitInput}
                  onChange={handleInputChange}
                  placeholder="R$ 0,00"
                  className="text-right"
                />
                <p className="text-xs text-muted-foreground">
                  {t('enterMaxAmountWish')}
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={updateLimitMutation.isPending}
                >
                  {t('cancel')}
                </Button>
                <Button
                  onClick={handleSaveLimit}
                  disabled={updateLimitMutation.isPending}
                >
                  {updateLimitMutation.isPending ? t('saving') : t('save')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}