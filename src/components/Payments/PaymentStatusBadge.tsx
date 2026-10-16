import React from 'react';
import {
  CheckCircle2,
  Clock,
  RotateCw,
  XCircle,
  CornerUpLeft,
} from 'lucide-react';
import { Badge } from '../ui/badge';

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REFUNDED'
  | 'DEPOSIT_PAID'
  | 'RELEASED';

interface PaymentStatusBadgeProps {
  status: PaymentStatus | string;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  const upperStatus = status.toUpperCase();

  switch (upperStatus) {
    case 'COMPLETED':
    case 'RELEASED':
      return (
        <Badge variant="success" className="gap-1 font-semibold text-xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {upperStatus}
        </Badge>
      );
    case 'DEPOSIT_PAID':
      return (
        <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30 gap-1 font-semibold text-xs">
          <CheckCircle2 className="w-3.5 h-3.5" />
          20% DEPOSIT PAID
        </Badge>
      );
    case 'PROCESSING':
      return (
        <Badge variant="info" className="gap-1 font-semibold text-xs">
          <RotateCw className="w-3.5 h-3.5 animate-spin" />
          PROCESSING
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge variant="warning" className="gap-1 font-semibold text-xs">
          <Clock className="w-3.5 h-3.5" />
          PENDING
        </Badge>
      );
    case 'FAILED':
      return (
        <Badge variant="destructive" className="gap-1 font-semibold text-xs">
          <XCircle className="w-3.5 h-3.5" />
          FAILED
        </Badge>
      );
    case 'REFUNDED':
      return (
        <Badge variant="outline" className="gap-1 font-semibold text-xs">
          <CornerUpLeft className="w-3.5 h-3.5" />
          REFUNDED
        </Badge>
      );
    default:
      return <Badge variant="outline">{upperStatus}</Badge>;
  }
};

export default PaymentStatusBadge;