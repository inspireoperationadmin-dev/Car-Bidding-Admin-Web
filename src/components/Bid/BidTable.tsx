import React from 'react';
import { Eye, ArrowUpDown, Clock } from 'lucide-react';
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
import { Skeleton } from '../ui/skeleton';

export interface BidDto {
  id: number;
  requestId: number;
  mechanicName: string;
  mechanicEmail?: string;
  price: number;
  estimatedDurationDays: number;
  estimatedDurationHours: number;
  status: 'ACTIVE' | 'WITHDRAWN' | 'SELECTED' | 'REJECTED';
  createdAt: string | Date;
  updatedAt?: string | Date;
}

interface BidTableProps {
  bids: BidDto[];
  onView: (id: number) => void;
  onSort?: (field: string) => void;
  loading?: boolean;
}

const getStatusBadge = (status: string) => {
  switch (status.toUpperCase()) {
    case 'SELECTED':
      return <Badge variant="success">Selected & Awarded</Badge>;
    case 'ACTIVE':
      return <Badge variant="info">Active Bid</Badge>;
    case 'WITHDRAWN':
      return <Badge variant="warning">Withdrawn</Badge>;
    case 'REJECTED':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const BidTable: React.FC<BidTableProps> = ({
  bids,
  onView,
  onSort,
  loading,
}) => {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Mechanic</TableHead>
            <TableHead>
              <button
                onClick={() => onSort?.('price')}
                className="flex items-center gap-1 font-semibold text-xs uppercase tracking-wider hover:text-foreground"
              >
                Bid Offer <ArrowUpDown className="w-3 h-3" />
              </button>
            </TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Estimated Turnaround</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Submitted</TableHead>
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
          ) : bids.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-36 text-center text-muted-foreground text-sm">
                No mechanic bids found for this repair request.
              </TableCell>
            </TableRow>
          ) : (
            bids.map((bid) => (
              <TableRow key={bid.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <p className="font-semibold text-sm text-foreground">{bid.mechanicName}</p>
                  <p className="text-xs text-muted-foreground">{bid.mechanicEmail || 'Verified Pro'}</p>
                </TableCell>

                <TableCell>
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-sm text-foreground">
                      €{bid.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      Deposit: €{(bid.price * 0.2).toFixed(2)} (20%)
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1 text-xs text-foreground font-medium">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>
                      {bid.estimatedDurationDays}d {bid.estimatedDurationHours}h
                    </span>
                  </div>
                </TableCell>

                <TableCell>{getStatusBadge(bid.status)}</TableCell>

                <TableCell className="text-xs text-muted-foreground">
                  {new Date(bid.createdAt).toLocaleDateString(undefined, {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(bid.id)}
                    className="h-8 px-2.5 text-xs gap-1.5"
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