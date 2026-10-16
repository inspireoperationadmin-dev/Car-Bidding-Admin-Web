import React from 'react';
import {
  User,
  Car,
  DollarSign,
  Clock,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  FileText,
  Star,
  Calendar,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';

export interface BidDetailProps {
  id: string | number;
  requestId: string | number;
  mechanicName: string;
  mechanicEmail?: string;
  mechanicPhone?: string;
  mechanicAddress?: string;
  mechanicRating?: number;
  mechanicReviews?: number;
  price: number;
  estimatedDurationDays: number;
  estimatedDurationHours: number;
  status: 'ACTIVE' | 'WITHDRAWN' | 'SELECTED' | 'REJECTED';
  carModel: string;
  carYear?: number;
  damageDescription?: string;
  adminMaxPrice?: number;
  notes?: string;
  appointmentDates?: string[];
  createdAt: string | Date;
  updatedAt?: string | Date;
}

interface BidDetailModalProps {
  open: boolean;
  onClose: () => void;
  bid: BidDetailProps | null;
}

export const BidDetailModal: React.FC<BidDetailModalProps> = ({ open, onClose, bid }) => {
  if (!bid) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-5 border-b bg-muted/30">
          <div className="flex items-center justify-between pr-6">
            <div className="flex items-center gap-2">
              <DialogTitle className="text-base font-bold">
                Bid Submission #{bid.id}
              </DialogTitle>
              <Badge
                variant={
                  bid.status === 'SELECTED'
                    ? 'success'
                    : bid.status === 'ACTIVE'
                    ? 'info'
                    : 'destructive'
                }
              >
                {bid.status}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Top Grid: Mechanic Info & Vehicle Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mechanic Dossier */}
            <div className="rounded-xl border p-4 bg-card space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <User className="w-4 h-4" />
                Mechanic Profile
              </div>

              <div className="flex items-center gap-3">
                <Avatar className="w-11 h-11 bg-primary/10 text-primary font-bold text-sm">
                  <AvatarFallback>{bid.mechanicName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
                    {bid.mechanicName}
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold mt-0.5">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span>{bid.mechanicRating || 5.0}</span>
                    <span className="text-muted-foreground">({bid.mechanicReviews || 0} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span className="truncate">{bid.mechanicEmail || 'No email provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>{bid.mechanicPhone || 'No direct phone'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{bid.mechanicAddress || 'Workshop location on file'}</span>
                </div>
              </div>
            </div>

            {/* Request Summary */}
            <div className="rounded-xl border p-4 bg-card space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Car className="w-4 h-4" />
                Vehicle Request #{bid.requestId}
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-sm text-foreground">{bid.carModel}</p>
                <p className="text-muted-foreground">Model Year: {bid.carYear || 'N/A'}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-muted/40 border text-xs space-y-1">
                <span className="text-muted-foreground block font-semibold text-[10px] uppercase tracking-wider">
                  Admin Max Budget
                </span>
                <span className="font-bold text-sm text-foreground">
                  €{bid.adminMaxPrice?.toLocaleString() || 'Uncapped'}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing & Offer Card */}
          <div className="rounded-xl border-2 border-primary/40 bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Offered Repair Bid
                </span>
                <span className="text-3xl font-black text-primary">
                  €{bid.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Turnaround Time
                </span>
                <span className="text-lg font-bold text-foreground flex items-center gap-1 justify-end">
                  <Clock className="w-4 h-4 text-primary" />
                  {bid.estimatedDurationDays}d {bid.estimatedDurationHours}h
                </span>
              </div>
            </div>

            {/* 20% deposit breakdown */}
            <div className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-primary/5 text-muted-foreground font-medium">
              <span>Customer 20% Selection Deposit:</span>
              <span className="font-bold text-foreground">€{(bid.price * 0.2).toFixed(2)}</span>
            </div>

            {/* Mechanic's notes */}
            {bid.notes && (
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  Mechanic's Work Proposal
                </span>
                <p className="text-xs text-foreground/90 p-3 rounded-lg bg-muted/30 border border-dashed leading-relaxed">
                  {bid.notes}
                </p>
              </div>
            )}
            {/* 3 Offered Appointment Dates */}
            <div className="space-y-2 p-3.5 rounded-xl border bg-muted/20">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                Offered Customer Appointment Slots (3 Required)
              </span>
              {bid.appointmentDates && bid.appointmentDates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {bid.appointmentDates.slice(0, 3).map((slot, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg border bg-card text-center text-xs font-semibold text-foreground shadow-2xs"
                    >
                      <span className="text-[10px] text-primary block uppercase tracking-wider font-bold">Option {i + 1}</span>
                      <span>{new Date(slot).toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Flexible scheduling: Specific appointment confirmed once customer completes 20% deposit.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Dismiss
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};