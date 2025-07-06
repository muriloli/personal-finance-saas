import { useState } from "react";
import { useLocation } from "wouter";
import { ChartLine, Home, CreditCard, Plus, Settings, HelpCircle, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/lib/i18n";


export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { t } = useI18n();

  const navigation = [
    { name: t("dashboard"), href: "/dashboard", icon: Home },
    { name: t("transactions"), href: "/transactions", icon: CreditCard },
    { name: t("addTransaction"), href: "/transactions/new", icon: Plus },
    { name: t("settings"), href: "/settings", icon: Settings },
    { name: t("help"), href: "/help", icon: HelpCircle },
  ];

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-card border-r border-border">
        {/* Logo */}
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary">
          <ChartLine className="h-8 w-8 text-primary-foreground mr-3" />
          <h1 className="text-xl font-bold text-primary-foreground">FinanceFlow</h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
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
                onClick={() => setLocation(item.href)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            );
          })}
        </nav>
        
        {/* Language Selector */}
        <div className="flex-shrink-0 px-4 pb-4 border-t border-border pt-4">
          <div className="mb-2">
            <p className="text-xs font-medium text-muted-foreground mb-2">Idioma / Language</p>
            <LanguageSelector />
          </div>
        </div>

        {/* User Profile */}
        <div className="flex-shrink-0 p-4 border-t border-border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-xs text-muted-foreground hover:text-foreground p-0 h-auto"
              >
                <LogOut className="mr-1 h-3 w-3" />
                {t("logout")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
