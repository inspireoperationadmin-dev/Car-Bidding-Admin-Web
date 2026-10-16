import { Menu, Search, Bell } from "lucide-react";
import UserMenu from "./UserMenu";
import { ThemeToggle } from "../theme/ThemeToggle";

interface HeaderProps {
  isMobile: boolean;
  onMenuClick: () => void;
}

export default function Header({ isMobile, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-border/70 bg-card/80 px-4 md:px-8 backdrop-blur-xl transition-all">
      {/* Left section: mobile hamburger + search */}
      <div className="flex items-center gap-3">
        {isMobile && (
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-background text-foreground hover:bg-muted"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="relative hidden items-center sm:flex">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search auctions, requests, users, VINs..."
            className="h-9 w-64 md:w-80 rounded-full border border-border/70 bg-muted/40 pl-9 pr-4 text-xs font-medium text-foreground placeholder:text-muted-foreground/70 transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Right section: live status, theme toggle, notifications, profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Environment pill */}
        <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Production Ready</span>
        </div>

        {/* Theme Toggle (Light / Dark) */}
        <ThemeToggle />

        {/* Notification Bell */}
        <button
          type="button"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card text-foreground transition-all hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-card animate-pulse" />
        </button>

        <div className="h-5 w-px bg-border/60 mx-1" />

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
}