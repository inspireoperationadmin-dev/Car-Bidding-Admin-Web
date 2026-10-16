import React from 'react';
import { Eye, User, Car, Calendar, ArrowUpDown } from 'lucide-react';
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

export interface RequestDto {
  id: number;
  customerId: number;
  customerName?: string;
  customerEmail?: string;
  carBrand: string;
  numberPlate: string;
  carModel: string;
  carYear: string;
  description: string;
  status:
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'BIDDING'
    | 'BIDS_VIEWABLE'
    | 'MECHANIC_SELECTED'
    | 'COMPLETED'
    | 'CANCELLED';
  location?: string | null;
  createdAt: string | Date;
  adminMaxPrice: number;
  bidsViewable: boolean;
  images?: string[];
  selectedMechanicId?: number | null;
  biddingRadiusKm?: number | null;
  biddingAutoExtended?: boolean;
  isUnderAdminReview?: boolean;
  reviewReason?: string | null;
  bidCount?: number;
}

interface RequestTableProps {
  requests: RequestDto[];
  onView: (id: number) => void;
  onReview: (id: number) => void;
  onSort?: (field: string) => void;
  loading?: boolean;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PENDING':
      return <Badge variant="warning">Pending Review</Badge>;
    case 'APPROVED':
      return <Badge variant="success">Approved</Badge>;
    case 'BIDDING':
      return <Badge variant="info">Bidding Open</Badge>;
    case 'BIDS_VIEWABLE':
      return <Badge variant="secondary">Bids Viewable</Badge>;
    case 'MECHANIC_SELECTED':
      return <Badge className="bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30">Mechanic Selected</Badge>;
    case 'COMPLETED':
      return <Badge className="bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30">Completed</Badge>;
    case 'REJECTED':
      return <Badge variant="destructive">Rejected</Badge>;
    case 'CANCELLED':
      return <Badge variant="outline">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const RequestTable: React.FC<RequestTableProps> = ({
  requests,
  onView,
  onReview,
  onSort,
  loading,
}) => {
  const formatDate = (dateValue: string | Date) => {
    if (!dateValue) return 'N/A';
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>
              <button
                onClick={() => onSort?.('customerName')}
                className="flex items-center gap-1 font-semibold text-xs uppercase tracking-wider hover:text-foreground"
              >
                Customer <ArrowUpDown className="w-3 h-3" />
              </button>
            </TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Vehicle</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
            <TableHead>
              <button
                onClick={() => onSort?.('adminMaxPrice')}
                className="flex items-center gap-1 font-semibold text-xs uppercase tracking-wider hover:text-foreground"
              >
                Admin Max Budget <ArrowUpDown className="w-3 h-3" />
              </button>
            </TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Created</TableHead>
            <TableHead className="text-right font-semibold text-xs uppercase tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={7}>
                  <Skeleton className="h-12 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-40 text-center text-muted-foreground">
                <p className="text-sm font-medium">No repair requests found matching current filters.</p>
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-xs font-bold text-muted-foreground">
                  #{request.id}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 bg-primary/10 text-primary font-semibold text-xs">
                      <AvatarFallback>
                        {request.customerName ? request.customerName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm leading-tight text-foreground">
                        {request.customerName || 'Unknown Customer'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {request.customerEmail || 'No email provided'}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {request.carBrand} {request.carModel}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Car className="w-3 h-3" />
                      <span>{request.carYear || 'N/A'}</span>
                      {request.numberPlate && (
                        <span className="px-1.5 py-0.2 bg-muted rounded font-mono text-[10px]">
                          {request.numberPlate}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col gap-1 items-start">
                    {getStatusBadge(request.status)}
                    {request.isUnderAdminReview && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse">
                        ⚠️ &lt; 3 Bids Review
                      </span>
                    )}
                    {request.biddingAutoExtended && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-500">
                        ⏱️ +6h Extended
                      </span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  {request.status === 'PENDING' ? (
                    <span className="text-xs italic text-muted-foreground">Pending Review</span>
                  ) : (
                    <span className="font-bold text-sm text-foreground">
                      €{(request.adminMaxPrice ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(request.createdAt)}</span>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(request.id)}
                      className="h-8 px-2.5 text-xs gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </Button>
                    {request.status === 'PENDING' && (
                      <Button
                        size="sm"
                        onClick={() => onReview(request.id)}
                        className="h-8 px-3 text-xs font-semibold shadow-sm"
                      >
                        Review
                      </Button>
                    )}
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