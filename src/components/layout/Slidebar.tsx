import { X, Sparkles } from "lucide-react";
import SidebarMenu from "./SidebarMenu";
import { cn } from "../../lib/utils";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
}

export default function Sidebar({ mobileOpen, onClose, isMobile }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-border/70 bg-card/95 backdrop-blur-xl transition-transform duration-300 ease-in-out md:translate-x-0 shadow-lg md:shadow-none",
          isMobile
            ? mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-18 items-center justify-between border-b border-border/70 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 shadow-md shadow-blue-500/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-foreground">
                  Thriio
                </span>
                <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <p className="text-[11px] font-medium text-muted-foreground">
                Vehicle Repair & Bidding
              </p>
            </div>
          </div>

          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Menu Navigation Area */}
        <div className="flex-1 overflow-y-auto">
          <SidebarMenu onItemClick={isMobile ? onClose : undefined} />
        </div>
      </aside>
    </>
  );
}
