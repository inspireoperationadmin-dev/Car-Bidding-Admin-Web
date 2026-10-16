import React from 'react';
import {
  User,
  Car,
  Image as ImageIcon,
  Gavel,
  MapPin,
  FileText,
  Calendar,
  DollarSign,
  AlertTriangle,
  Clock,
  Wrench,
} from 'lucide-react';
import type { RequestDto } from './RequestTable';
import { ImageGallery } from '../images/ImageGallery';
import { RequestReviewForm } from './RequestReviewForm';
import { RepairProgressTracker } from './RepairProgressTracker';
import { LowBidsReviewModal } from './LowBidsReviewModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface RequestDetailModalProps {
  open: boolean;
  onClose: () => void;
  request: RequestDto | null;
  onReviewSubmit: (id: number, data: any) => void;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  open,
  onClose,
  request,
  onReviewSubmit,
}) => {
  const [showLowBidsModal, setShowLowBidsModal] = React.useState(false);

  if (!request) return null;

  const isPending = request.status === 'PENDING';

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="p-5 border-b bg-muted/30">
          <div className="flex items-center justify-between pr-6">
            <div className="flex items-center gap-2.5">
              <DialogTitle className="text-lg font-bold">
                Repair Request #{request.id}
              </DialogTitle>
              <Badge variant={isPending ? 'warning' : 'info'}>
                {request.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Top Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Section */}
            <div className="rounded-xl border p-4 bg-card space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <User className="w-4 h-4" />
                Customer Dossier
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-muted">
                  <span className="text-muted-foreground">Full Name</span>
                  <span className="font-semibold text-foreground">{request.customerName || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-muted">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-semibold text-foreground">{request.customerEmail || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Location
                  </span>
                  <span className="font-semibold text-foreground">{request.location || 'Remote / Unspecified'}</span>
                </div>
              </div>
            </div>

            {/* Vehicle Section */}
            <div className="rounded-xl border p-4 bg-card space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Car className="w-4 h-4" />
                Vehicle Specifications
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-muted">
                  <span className="text-muted-foreground">Make & Model</span>
                  <span className="font-semibold text-foreground">
                    {request.carBrand} {request.carModel}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-muted">
                  <span className="text-muted-foreground">Year</span>
                  <span className="font-semibold text-foreground">{request.carYear || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">License Plate</span>
                  <span className="font-mono font-bold text-foreground">
                    {request.numberPlate || 'Not Registered'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Issue Description */}
          <div className="rounded-xl border p-4 bg-card space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              Customer Reported Issue
            </div>
            <p className="text-sm text-foreground/90 leading-relaxed bg-muted/30 p-3 rounded-lg border border-dashed">
              {request.description || 'No detailed issue description provided by customer.'}
            </p>
          </div>

          {/* Photos */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
              <ImageIcon className="w-4 h-4" />
              Inspection & Damage Photos ({request.images?.length || 0})
            </div>
            <ImageGallery images={request.images && request.images.length > 0 ? request.images : []} />
          </div>

          {/* Pricing, Radius & Budget Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border bg-primary/5 border-primary/20 gap-3">
            <div className="flex items-center gap-2.5">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Admin Max Budget</p>
                <p className="text-lg font-black text-foreground">
                  {request.adminMaxPrice ? `€${request.adminMaxPrice.toLocaleString()}` : 'Not Established Yet'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-lg border bg-card text-xs flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="font-semibold text-foreground">
                  {request.biddingRadiusKm || 25} km Eligibility Radius
                </span>
              </div>
              <div className="text-right text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(request.createdAt).toLocaleDateString('en-GB')}
              </div>
            </div>
          </div>

          {/* Under Admin Review Banner */}
          {request.isUnderAdminReview && (
            <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">
                    Low Bids Warning &bull; Admin Oversight Required
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {request.reviewReason || "This job received less than 3 bids before the bidding deadline."}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="default"
                onClick={() => setShowLowBidsModal(true)}
                className="gap-1.5 text-xs font-semibold whitespace-nowrap shadow-sm"
              >
                <span>Intervene / Resolve</span>
              </Button>
            </div>
          )}

          {/* Admin Review Action (Only for PENDING requests) */}
          {isPending && (
            <div className="rounded-xl border-2 border-dashed border-primary/40 p-5 bg-card space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Gavel className="w-4 h-4" />
                Action Required: Review & Approve Submission
              </div>
              <RequestReviewForm
                requestId={request.id}
                onSubmitSuccess={(payload: any) => {
                  onReviewSubmit(request.id, payload);
                  onClose();
                }}
              />
            </div>
          )}

          {/* Live Repair Work Telemetry & Tracking (For active / completed requests) */}
          {!isPending && (
            <div className="pt-2 border-t">
              <RepairProgressTracker requestId={request.id} />
            </div>
          )}
        </div>

        {/* Low Bids Resolution Modal */}
        <LowBidsReviewModal
          open={showLowBidsModal}
          onClose={() => setShowLowBidsModal(false)}
          request={{
            id: request.id,
            carBrand: request.carBrand,
            carModel: request.carModel,
            bidsCount: request.bidCount,
            biddingRadiusKm: request.biddingRadiusKm ?? 25,
            reviewReason: request.reviewReason,
          }}
          onSuccess={() => {
            onReviewSubmit(request.id, { action: 'RESOLVED_LOW_BIDS' });
            onClose();
          }}
        />

        {/* Footer */}
        {!isPending && (
          <div className="p-4 border-t bg-muted/20 flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close Dossier
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};