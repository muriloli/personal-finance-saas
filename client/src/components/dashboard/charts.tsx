import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/layout/page-transition";
import GaugeChart from "./gauge-chart";
import { useTheme } from "@/components/layout/theme-provider";

interface ChartData {
  incomeVsExpenses: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
  expensesByCategory: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const chartConfig = {
  income: {
    label: "Income",
    color: "#10B981", // Green color for income
  },
  expenses: {
    label: "Expenses", 
    color: "#EF4444", // Red color for expenses
  },
};

export default function Charts() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const { data: rawChartData, isLoading } = useQuery<any>({
    queryKey: ["/api/dashboard/charts"],
  });
  
  // Get chart text color based on theme
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const textColor = isDark ? '#ffffff' : '#374151';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Convert string values to numbers for proper chart rendering
  const chartData: ChartData | undefined = rawChartData ? {
    incomeVsExpenses: rawChartData.incomeVsExpenses.map((item: any) => ({
      month: item.month,
      income: parseFloat(item.income) || 0,
      expenses: parseFloat(item.expenses) || 0,
    })),
    expensesByCategory: rawChartData.expensesByCategory.map((item: any) => ({
      name: item.name,
      value: parseFloat(item.value) || 0,
      color: item.color,
    })),
  } : undefined;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
        <Card>
          <CardHeader className="pb-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 sm:h-48 md:h-64 xl:h-80 2xl:h-96 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 sm:h-48 md:h-64 xl:h-80 2xl:h-96 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 sm:h-48 md:h-64 xl:h-80 2xl:h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!chartData) return null;

  return (
    <StaggerContainer>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8">
        {/* Income vs Expenses Chart */}
        <StaggerItem>
          <Card className="flex flex-col h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">{t("incomeVsExpenses")}</CardTitle>
              <CardDescription className="text-sm">{t("lastSixMonths")}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ChartContainer config={chartConfig} className="h-40 sm:h-48 md:h-64 xl:h-80 2xl:h-96 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.incomeVsExpenses} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <XAxis 
                      dataKey="month" 
                      fontSize={9}
                      tickLine={false}
                      axisLine={false}
                      interval={0}
                      tick={{ fill: textColor }}
                      stroke={textColor}
                    />
                    <YAxis
                      fontSize={9}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => {
                        if (value >= 1000) {
                          return `R$${(value / 1000).toFixed(0)}k`;
                        }
                        return `R$${value.toFixed(0)}`;
                      }}
                      width={40}
                      domain={['dataMin - 100', 'dataMax + 100']}
                      tick={{ fill: textColor }}
                      stroke={textColor}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value) => [formatCurrency(value as number)]}
                    />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: "#10B981", strokeWidth: 2, r: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={{ fill: "#EF4444", strokeWidth: 2, r: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Expenses by Category Chart */}
        <StaggerItem>
          <Card className="flex flex-col h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">{t("expensesByCategory")}</CardTitle>
              <CardDescription className="text-sm">{t("currentMonthBreakdown")}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="h-40 sm:h-48 md:h-64 xl:h-80 2xl:h-96 flex-1 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.expensesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius="25%"
                      outerRadius="70%"
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.expensesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border border-border rounded-lg p-2 shadow-md">
                              <p className="font-medium text-sm">{data.name}</p>
                              <p className="text-primary text-sm">{formatCurrency(data.value)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="mt-3 sm:mt-4 space-y-2">
                {chartData.expensesByCategory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center flex-1 min-w-0">
                      <div 
                        className="w-3 h-3 rounded-full mr-2 shrink-0" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground truncate">{item.name}</span>
                    </div>
                    <span className="text-foreground font-medium ml-2 shrink-0">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </StaggerItem>

        {/* Monthly Budget Gauge Chart */}
        <StaggerItem>
          <GaugeChart />
        </StaggerItem>
      </div>
    </StaggerContainer>
  );
}
