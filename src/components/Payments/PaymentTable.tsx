import React from 'react';
import { Eye, ArrowUpDown, CreditCard } from 'lucide-react';
import type { PaymentDto } from '../../store/slices/paymentSlice';
import PaymentStatusBadge from './PaymentStatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

interface PaymentTableProps {
  payments: PaymentDto[];
  onView: (id: number) => void;
  onSort?: (field: string) => void;
  loading?: boolean;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  onView,
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
                onClick={() => onSort?.('customerName')}
                className="flex items-center gap-1 font-semibold text-xs uppercase tracking-wider hover:text-foreground"
              >
                Customer <ArrowUpDown className="w-3 h-3" />
              </button>
            </TableHead>
            <TableHead>
              <button
                onClick={() => onSort?.('amount')}
                className="flex items-center gap-1 font-semibold text-xs uppercase tracking-wider hover:text-foreground"
              >
                Amount <ArrowUpDown className="w-3 h-3" />
              </button>
            </TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Method</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Date</TableHead>
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
          ) : payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                <p className="text-sm font-medium">No payment transactions found.</p>
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <p className="font-semibold text-sm text-foreground">
                    {payment.customerName || 'Unknown Customer'}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">TX #{payment.id}</p>
                </TableCell>

                <TableCell>
                  <span className="font-extrabold text-sm text-foreground">
                    €{payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs uppercase font-mono font-semibold text-muted-foreground">
                    <CreditCard className="w-3.5 h-3.5 text-primary" />
                    {payment.paymentMethod || 'STRIPE'}
                  </div>
                </TableCell>

                <TableCell>
                  <PaymentStatusBadge status={payment.status} />
                </TableCell>

                <TableCell className="text-xs text-muted-foreground">
                  {new Date(payment.createdAt).toLocaleDateString(undefined, {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(payment.id)}
                    className="h-8 px-2.5 text-xs gap-1.5 hover:bg-muted"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Inspect
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};