import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/components/layout/theme-provider";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Moon, Sun, Globe, LogOut, User } from "lucide-react";
import { getInitials } from "@/lib/utils";

export default function UserProfileDropdown() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const toggleTheme = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  const handleLanguageChange = (newLanguage: "pt-BR" | "en-US" | "es-ES") => {
    setLanguage(newLanguage);
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case "pt-BR":
        return "Português";
      case "en-US":
        return "English";
      case "es-ES":
        return "Español";
      default:
        return "Português";
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full hover:bg-accent"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        {/* User Info Section */}
        <div className="flex flex-col space-y-1 p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.cpf}</p>
              {user.phone && (
                <p className="text-xs text-muted-foreground">{user.phone}</p>
              )}
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Theme Toggle */}
        <DropdownMenuItem 
          onClick={toggleTheme} 
          className="cursor-pointer"
          onSelect={(e) => e.preventDefault()}
        >
          <div className="flex items-center space-x-3 w-full">
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="flex-1">
              {theme === "dark" ? t("lightMode") || "Modo Claro" : t("darkMode") || "Modo Escuro"}
            </span>
          </div>
        </DropdownMenuItem>

        {/* Language Selector */}
        <div className="px-2 py-1">
          <div className="flex items-center space-x-3 px-2 py-1.5">
            <Globe className="h-4 w-4" />
            <div className="flex-1">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full h-8 text-sm">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="es-ES">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 dark:text-red-400">
          <LogOut className="mr-3 h-4 w-4" />
          <span>{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}