import React from 'react';
import {
  Receipt,
  User,
  CreditCard,
  Calendar,
  Loader2,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import type { PaymentDto } from '../../store/slices/paymentSlice';
import PaymentStatusBadge from './PaymentStatusBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';

export interface PaymentDetailModalProps {
  open: boolean;
  onClose: () => void;
  payment: PaymentDto | null;
  loading?: boolean;
}

export const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({
  open,
  onClose,
  payment,
  loading,
}) => {
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-5 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            <DialogTitle className="text-base font-bold">
              Payment Transaction Ledger
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : payment ? (
            <div className="space-y-5">
              {/* Header Status Row */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground">
                    Transaction
                  </span>
                  <p className="font-mono font-bold text-sm text-foreground">
                    #{payment.id}
                  </p>
                </div>
                <PaymentStatusBadge status={payment.status} />
              </div>

              {/* Customer and Method Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border bg-card space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                    <User className="w-3.5 h-3.5 text-primary" />
                    Customer
                  </div>
                  <p className="font-bold text-sm text-foreground truncate">
                    {payment.customerName || 'Unknown Customer'}
                  </p>
                </div>

                <div className="p-3 rounded-xl border bg-card space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                    <CreditCard className="w-3.5 h-3.5 text-primary" />
                    Method
                  </div>
                  <p className="font-mono font-bold text-xs uppercase text-foreground">
                    {payment.paymentMethod || 'Stripe Escrow'}
                  </p>
                </div>
              </div>

              {/* 20/80 Escrow Structure Breakdown */}
              <div className="rounded-xl border bg-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    20 / 80 Escrow Breakdown
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1.5 border-b border-muted">
                    <span className="text-muted-foreground">20% Selection Milestone</span>
                    <span className="font-semibold text-foreground">
                      €{(payment.amount * 0.2).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-muted">
                    <span className="text-muted-foreground">80% Job Completion Release</span>
                    <span className="font-semibold text-foreground">
                      €{(payment.amount * 0.8).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Amount Highlight */}
                <div className="mt-2 p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
                    Total Amount
                  </span>
                  <span className="text-2xl font-black text-foreground">
                    €{payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <Button onClick={onClose} variant="outline" className="w-full font-semibold">
                Dismiss
              </Button>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No payment details found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDetailModal;