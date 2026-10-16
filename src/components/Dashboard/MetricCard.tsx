import { TrendingUp, TrendingDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  accentColor?: string;
}

export default function MetricCard({
  title,
  value,
  icon,
  change,
}: MetricCardProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-border hover:shadow-lg hover:-translate-y-1">
      {/* Subtle top brand gradient line */}
      <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 transition-opacity group-hover:opacity-100" />

      {/* Decorative ambient orb */}
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl pointer-events-none transition-all group-hover:bg-primary/10" />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
        {/* Icon & Title */}
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
          {change !== undefined && (
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold",
                isPositive
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-destructive/15 text-destructive border border-destructive/20"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {change}%
              </span>
            </div>
          )}
        </div>

        {/* Value and Label */}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
            {value}
          </p>
        </div>

        {change !== undefined && (
          <p className="text-[11px] font-medium text-muted-foreground/80">
            Compared to previous 30 days
          </p>
        )}
      </div>
    </div>
  );
}
