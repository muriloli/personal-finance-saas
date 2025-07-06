import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { Category } from "@shared/schema";
import { TransactionFilters } from "@/pages/transactions";
import { useI18n } from "@/lib/i18n";

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
}

export default function TransactionFiltersComponent({ filters, onFiltersChange }: TransactionFiltersProps) {
  const { t } = useI18n();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Sync local date state with filters prop
  useEffect(() => {
    if (filters.startDate) {
      setStartDate(parseISO(filters.startDate));
    } else {
      setStartDate(undefined);
    }
    
    if (filters.endDate) {
      setEndDate(parseISO(filters.endDate));
    } else {
      setEndDate(undefined);
    }
  }, [filters.startDate, filters.endDate]);

  const handleFilterChange = (key: keyof TransactionFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const handleDateChange = (type: "start" | "end", date: Date | undefined) => {
    if (type === "start") {
      const formattedDate = date ? format(date, "yyyy-MM-dd") : undefined;
      console.log(`Setting ${type} date:`, date, "formatted:", formattedDate);
      // When setting start date, if there's an end date and start date is after end date, clear end date
      if (formattedDate && filters.endDate && formattedDate > filters.endDate) {
        onFiltersChange({
          ...filters,
          startDate: formattedDate,
          endDate: undefined
        });
      } else {
        handleFilterChange("startDate", formattedDate);
      }
    } else {
      const formattedDate = date ? format(date, "yyyy-MM-dd") : undefined;
      console.log(`Setting ${type} date:`, date, "formatted:", formattedDate);
      // When setting end date, if there's a start date and end date is before start date, clear start date
      if (formattedDate && filters.startDate && formattedDate < filters.startDate) {
        onFiltersChange({
          ...filters,
          startDate: undefined,
          endDate: formattedDate
        });
      } else {
        handleFilterChange("endDate", formattedDate);
      }
    }
  };

  const clearFilters = () => {
    onFiltersChange({});
    // The useEffect will handle clearing the local state
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchTransactions")}
              className="pl-10"
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <Select value={filters.category || "all"} onValueChange={(value) => handleFilterChange("category", value === "all" ? undefined : value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("allCategories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allCategories")}</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={filters.type || "all"} onValueChange={(value) => handleFilterChange("type", value === "all" ? undefined : value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("allTypes")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allTypes")}</SelectItem>
              <SelectItem value="income">{t("income")}</SelectItem>
              <SelectItem value="expense">{t("expense")}</SelectItem>
            </SelectContent>
          </Select>

          {/* Start Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left">
                <Calendar className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "MMM dd, yyyy") : t("startDate")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={(date) => handleDateChange("start", date)}
                disabled={(date) => {
                  // Disable dates after end date if end date is set
                  return endDate ? date > endDate : false;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* End Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left">
                <Calendar className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "MMM dd, yyyy") : t("endDate")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={(date) => handleDateChange("end", date)}
                disabled={(date) => {
                  // Disable dates before start date if start date is set
                  return startDate ? date < startDate : false;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date Range Display */}
        {(filters.startDate || filters.endDate) && (
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {filters.startDate && filters.endDate
                ? `From ${format(parseISO(filters.startDate), "MMM dd, yyyy")} to ${format(parseISO(filters.endDate), "MMM dd, yyyy")}`
                : filters.startDate
                ? `From ${format(parseISO(filters.startDate), "MMM dd, yyyy")} onwards`
                : `Up to ${format(parseISO(filters.endDate!), "MMM dd, yyyy")}`}
            </span>
          </div>
        )}

        {/* Clear Filters */}
        {(filters.search || filters.category || filters.type || filters.startDate || filters.endDate) && (
          <div className="mt-4">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
