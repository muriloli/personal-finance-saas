import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Category } from "@shared/schema";
import { TransactionFilters } from "@/pages/transactions";

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
}

export default function TransactionFiltersComponent({ filters, onFiltersChange }: TransactionFiltersProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleFilterChange = (key: keyof TransactionFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const handleDateChange = (type: "start" | "end", date: Date | undefined) => {
    if (type === "start") {
      setStartDate(date);
      handleFilterChange("startDate", date ? format(date, "yyyy-MM-dd") : undefined);
    } else {
      setEndDate(date);
      handleFilterChange("endDate", date ? format(date, "yyyy-MM-dd") : undefined);
    }
  };

  const clearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    onFiltersChange({});
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-10"
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <Select value={filters.category || "all"} onValueChange={(value) => handleFilterChange("category", value === "all" ? undefined : value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
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
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          {/* Start Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left">
                <Calendar className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "MMM dd, yyyy") : "Start Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={(date) => handleDateChange("start", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* End Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left">
                <Calendar className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "MMM dd, yyyy") : "End Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={(date) => handleDateChange("end", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

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
