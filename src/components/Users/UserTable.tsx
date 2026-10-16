import React from 'react';
import { Eye, ShieldAlert, CheckCircle2, ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';

export interface UserDto {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdDate: string;
}

interface UserTableProps {
  users: UserDto[];
  onView: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onSort?: (field: string) => void;
  loading?: boolean;
}

const getRoleBadge = (role: string) => {
  switch (role.toUpperCase()) {
    case 'ADMIN':
      return <Badge variant="default">Admin</Badge>;
    case 'STAFF':
      return <Badge variant="secondary">Staff</Badge>;
    case 'MECHANIC':
      return <Badge variant="info">Mechanic</Badge>;
    case 'CUSTOMER':
      return <Badge variant="outline">Customer</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onView,
  onToggleStatus,
  onSort,
  loading,
}) => {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>
              <button
                onClick={() => onSort?.('name')}
                className="flex items-center gap-1 font-semibold text-xs uppercase tracking-wider hover:text-foreground"
              >
                User <ArrowUpDown className="w-3 h-3" />
              </button>
            </TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Email</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Role</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Joined</TableHead>
            <TableHead className="text-right font-semibold text-xs uppercase tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={6}>
                  <Skeleton className="h-12 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                <p className="text-sm font-medium">No users found matching current filters.</p>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 bg-primary/10 text-primary font-bold text-xs">
                      <AvatarFallback>
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm text-foreground leading-tight">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">ID: #{user.id}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="font-mono text-xs text-muted-foreground">
                  {user.email}
                </TableCell>

                <TableCell>{getRoleBadge(user.role)}</TableCell>

                <TableCell>
                  {user.isActive ? (
                    <Badge variant="success" className="gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                      Deactivated
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="text-xs text-muted-foreground">
                  {user.createdDate
                    ? new Date(user.createdDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(user.id)}
                      className="h-8 px-2.5 text-xs gap-1 hover:bg-muted"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Button>
                    <Button
                      variant={user.isActive ? 'ghost' : 'outline'}
                      size="sm"
                      onClick={() => onToggleStatus(user.id)}
                      className={`h-8 px-2.5 text-xs gap-1 ${
                        user.isActive
                          ? 'text-destructive hover:bg-destructive/10'
                          : 'text-emerald-600 border-emerald-500/40 hover:bg-emerald-500/10'
                      }`}
                    >
                      {user.isActive ? (
                        <>
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Suspend
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Activate
                        </>
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};