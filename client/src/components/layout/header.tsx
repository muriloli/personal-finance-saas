import UserProfileDropdown from "@/components/UserProfileDropdown";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function Header() {
  return (
    <header className="hidden lg:flex lg:h-16 lg:items-center lg:justify-end lg:px-6 lg:border-b lg:border-border lg:bg-card lg:sticky lg:top-0 lg:z-40">
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <UserProfileDropdown />
      </div>
    </header>
  );
}