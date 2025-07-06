import UserProfileDropdown from "@/components/UserProfileDropdown";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function Header() {
  return (
    <header className="hidden lg:flex lg:h-16 lg:items-center lg:justify-end lg:px-6 lg:border-b lg:border-border lg:bg-card">
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserProfileDropdown />
      </div>
    </header>
  );
}