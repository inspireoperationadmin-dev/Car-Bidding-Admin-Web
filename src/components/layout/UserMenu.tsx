import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutThunk } from "../../store/slices/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { LogOut, Shield, User } from "lucide-react";

export default function UserMenu() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  if (!user) return null;

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  const initials =
    user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : user.firstName
      ? user.firstName.slice(0, 2).toUpperCase()
      : user.email.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative flex items-center gap-3 rounded-full border border-border/60 bg-card p-1 pr-3 text-left transition-all hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <Avatar className="h-8 w-8 border border-primary/20">
            <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left md:block">
            <p className="text-xs font-semibold leading-tight text-foreground">
              {user.firstName ? `${user.firstName} ${user.lastName || ""}` : "System Admin"}
            </p>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              {user.role}
            </p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none text-foreground">
              {user.firstName ? `${user.firstName} ${user.lastName || ""}` : "Administrator"}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/users")} className="gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>User Management</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/verification")} className="gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <span>Mechanic Approvals</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
