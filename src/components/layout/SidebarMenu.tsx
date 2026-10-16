import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Gavel,
  ClipboardList,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Users as UsersIcon,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarMenuProps {
  onItemClick?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Live Auctions", href: "/bids", icon: Gavel, badge: "Live" },
      { title: "Repair Requests", href: "/requests", icon: ClipboardList },
    ],
  },
  {
    group: "Financials",
    items: [
      { title: "Payments (20/80)", href: "/payments", icon: CreditCard },
      { title: "Payment Reports", href: "/paymentreports", icon: BarChart3 },
    ],
  },
  {
    group: "Platform Administration",
    items: [
      { title: "Mechanic Verification", href: "/verification", icon: ShieldCheck },
      { title: "User Directory", href: "/users", icon: UsersIcon },
      { title: "Audit & Reports", href: "/reports", icon: FileSpreadsheet },
    ],
  },
];

export default function SidebarMenu({ onItemClick }: SidebarMenuProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col justify-between px-3 py-4">
      <div className="space-y-6">
        {navGroups.map((group) => (
          <div key={group.group} className="space-y-1.5">
            <h4 className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
              {group.group}
            </h4>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => {
                      navigate(item.href);
                      if (onItemClick) onItemClick();
                    }}
                    className={cn(
                      "group relative flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 font-semibold"
                        : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "h-4 w-4 transition-transform duration-200 group-hover:scale-110",
                          isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      <span>{item.title}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-primary/10 via-accent/30 to-background p-3.5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-foreground">Backend Connected</span>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
          Thriio Automotive Core v1.0.0
        </p>
      </div>
    </div>
  );
}
