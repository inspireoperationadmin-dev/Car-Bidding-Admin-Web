import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import apiClient from '@/api/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface LowBidsReviewModalProps {
  open: boolean;
  onClose: () => void;
  request: {
    id: number;
    carBrand: string;
    carModel: string;
    bidsCount?: number;
    biddingRadiusKm?: number;
    reviewReason?: string | null;
  } | null;
  onSuccess: () => void;
}

export const LowBidsReviewModal: React.FC<LowBidsReviewModalProps> = ({
  open,
  onClose,
  request,
  onSuccess,
}) => {
  const [action, setAction] = useState<'APPROVE_CURRENT_BIDS' | 'EXTEND_TIME' | 'EXPAND_RADIUS'>('EXTEND_TIME');
  const [additionalHours, setAdditionalHours] = useState<number>(12);
  const [newRadiusKm, setNewRadiusKm] = useState<number>(50);
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || !request) return null;

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`/requests/${request.id}/resolve-low-bids`, {
        action,
        additionalHours,
        newRadiusKm,
        adminNotes,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit decision');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Low Bids Review & Intervention
              </DialogTitle>
              <DialogDescription className="text-xs">
                Request #{request.id} &bull; {request.carBrand} {request.carModel}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Reason Alert */}
          <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200">
            <p className="font-semibold">
              {request.reviewReason ||
                `Only ${request.bidsCount || 0} bid(s) received (minimum 3 required).`}
            </p>
            <p className="text-[11px] mt-0.5 opacity-80">
              Platform governance requires Admin oversight to protect the customer from insufficient bid competition.
            </p>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs">
              {error}
            </div>
          )}

          {/* Action Chooser */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Select Resolution Action
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAction('APPROVE_CURRENT_BIDS')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  action === 'APPROVE_CURRENT_BIDS'
                    ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                    : 'border-border bg-card hover:bg-muted/50 text-muted-foreground'
                }`}
              >
                <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-emerald-500" />
                <span className="block text-xs font-semibold">Accept Bids</span>
                <span className="text-[10px] opacity-75">Proceed to customer</span>
              </button>

              <button
                type="button"
                onClick={() => setAction('EXTEND_TIME')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  action === 'EXTEND_TIME'
                    ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                    : 'border-border bg-card hover:bg-muted/50 text-muted-foreground'
                }`}
              >
                <Clock className="h-4 w-4 mx-auto mb-1 text-amber-500" />
                <span className="block text-xs font-semibold">Extend Time</span>
                <span className="text-[10px] opacity-75">Add 6h, 12h, or 24h</span>
              </button>

              <button
                type="button"
                onClick={() => setAction('EXPAND_RADIUS')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  action === 'EXPAND_RADIUS'
                    ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                    : 'border-border bg-card hover:bg-muted/50 text-muted-foreground'
                }`}
              >
                <MapPin className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                <span className="block text-xs font-semibold">Expand Radius</span>
                <span className="text-[10px] opacity-75">Reach more shops</span>
              </button>
            </div>
          </div>

          {/* Action Specific Fields */}
          {action === 'EXTEND_TIME' && (
            <div className="space-y-2 p-3 rounded-xl border bg-muted/20">
              <Label className="text-xs font-semibold">Additional Bidding Hours</Label>
              <div className="flex items-center gap-2">
                {[6, 12, 24, 48].map((h) => (
                  <Button
                    key={h}
                    type="button"
                    size="sm"
                    variant={additionalHours === h ? 'default' : 'outline'}
                    onClick={() => setAdditionalHours(h)}
                    className="flex-1 text-xs h-8"
                  >
                    +{h} Hours
                  </Button>
                ))}
              </div>
            </div>
          )}

          {action === 'EXPAND_RADIUS' && (
            <div className="space-y-3 p-3 rounded-xl border bg-muted/20">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">New Shop Eligibility Radius (KM)</Label>
                <div className="flex items-center gap-2">
                  {[35, 50, 75, 100].map((r) => (
                    <Button
                      key={r}
                      type="button"
                      size="sm"
                      variant={newRadiusKm === r ? 'default' : 'outline'}
                      onClick={() => setNewRadiusKm(r)}
                      className="flex-1 text-xs h-8"
                    >
                      {r} km
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Window Extension</Label>
                <div className="flex items-center gap-2">
                  {[12, 24, 48].map((h) => (
                    <Button
                      key={h}
                      type="button"
                      size="sm"
                      variant={additionalHours === h ? 'default' : 'outline'}
                      onClick={() => setAdditionalHours(h)}
                      className="flex-1 text-xs h-8"
                    >
                      +{h}h
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {action === 'APPROVE_CURRENT_BIDS' && (
            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200">
              <p className="font-semibold">Confirm Override & Unlock Bids</p>
              <p className="text-[11px] mt-0.5 opacity-80">
                The customer will be notified that bidding is closed and can now view the existing {request.bidsCount || 0} submitted offer(s).
              </p>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Admin Audit Notes (Optional)</Label>
            <Input
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Extended bidding window by 12h due to weekend lull..."
              className="text-xs"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={handleSubmit}
            disabled={loading}
            className="gap-1.5 font-semibold"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
            <span>Apply Resolution</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
