import { useState } from "react";
import { useLocation } from "wouter";
import { Menu, X, ChartLine, Home, CreditCard, Plus, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Transactions", href: "/transactions", icon: CreditCard },
  { name: "Add Transaction", href: "/transactions/new", icon: Plus },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
];

export default function MobileNav() {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  const handleNavigate = (href: string) => {
    setLocation(href);
    setOpen(false);
  };

  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <ChartLine className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-lg font-bold text-foreground">FinanceFlow</h1>
        </div>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex items-center mb-6">
              <ChartLine className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-lg font-bold text-foreground">FinanceFlow</h1>
            </div>
            
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href || 
                  (item.href === "/dashboard" && location === "/");
                
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-secondary text-secondary-foreground"
                    )}
                    onClick={() => handleNavigate(item.href)}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Button>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
