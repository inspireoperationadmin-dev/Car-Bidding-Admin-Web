import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSelector } from 'react-redux';
import { CheckCircle2, XCircle, AlertTriangle, Loader2, MapPin, Clock, ShieldAlert } from 'lucide-react';
import type { RootState } from '@/store';
import apiClient from '@/api/client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

const reviewSchema = z
  .object({
    action: z.enum(['APPROVE', 'REJECT', 'REQUEST_CHANGES']),
    maxPrice: z.preprocess(
      (val) => (val === '' || val === undefined ? undefined : Number(val)),
      z.number().min(1, 'Price must be greater than zero').optional()
    ),
    biddingRadiusKm: z.preprocess(
      (val) => (val === '' || val === undefined ? 25 : Number(val)),
      z.number().min(1, 'Radius must be at least 1 km').default(25)
    ),
    biddingDurationHours: z.preprocess(
      (val) => (val === '' || val === undefined ? 24 : Number(val)),
      z.number().min(1, 'Duration must be at least 1 hour').default(24)
    ),
    notes: z.string().optional(),
    rejectionReason: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.action === 'APPROVE') return data.maxPrice !== undefined;
      return true;
    },
    { message: 'Max price is required for approval', path: ['maxPrice'] }
  )
  .refine(
    (data) => {
      if (data.action === 'REJECT')
        return !!data.rejectionReason && data.rejectionReason.trim().length > 0;
      return true;
    },
    { message: 'Rejection reason is required', path: ['rejectionReason'] }
  );

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface RequestReviewFormProps {
  requestId: number;
  onSubmitSuccess: (data: any) => void;
}

export const RequestReviewForm: React.FC<RequestReviewFormProps> = ({
  requestId,
  onSubmitSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema) as any,
    defaultValues: {
      action: 'APPROVE',
      maxPrice: undefined,
      biddingRadiusKm: 25,
      biddingDurationHours: 24,
      notes: '',
      rejectionReason: '',
    },
  });

  const selectedAction = watch('action');

  const onFormSubmit = async (formData: ReviewFormValues) => {
    if (!user) {
      setError('User session not found.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      requestId: requestId,
      action: formData.action,
      maxPrice: formData.maxPrice,
      biddingRadiusKm: formData.biddingRadiusKm,
      biddingDurationHours: formData.biddingDurationHours,
      notes: formData.notes,
      rejectionReason: formData.rejectionReason,
    };

    try {
      await apiClient.post(`/requests/${requestId}/review`, payload);
      onSubmitSuccess(payload);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-destructive/15 border border-destructive/30 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      {/* Decision Tabs/Cards */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Review Decision
        </Label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setValue('action', 'APPROVE')}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-semibold transition-all ${
              selectedAction === 'APPROVE'
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-2 ring-emerald-500/30'
                : 'border-border bg-card text-muted-foreground hover:bg-muted/50'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 mb-1" />
            Approve & Open
          </button>

          <button
            type="button"
            onClick={() => setValue('action', 'REJECT')}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-semibold transition-all ${
              selectedAction === 'REJECT'
                ? 'border-destructive bg-destructive/10 text-destructive ring-2 ring-destructive/30'
                : 'border-border bg-card text-muted-foreground hover:bg-muted/50'
            }`}
          >
            <XCircle className="w-5 h-5 mb-1" />
            Reject
          </button>

          <button
            type="button"
            onClick={() => setValue('action', 'REQUEST_CHANGES')}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-semibold transition-all ${
              selectedAction === 'REQUEST_CHANGES'
                ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-2 ring-amber-500/30'
                : 'border-border bg-card text-muted-foreground hover:bg-muted/50'
            }`}
          >
            <AlertTriangle className="w-5 h-5 mb-1" />
            Request Info
          </button>
        </div>
      </div>

      {/* Approve Fields */}
      {selectedAction === 'APPROVE' && (
        <div className="space-y-4 animate-in fade-in-0 duration-200">
          <div className="space-y-1.5">
            <Label htmlFor="maxPrice">Admin Max Bidding Budget (€)</Label>
            <Controller
              name="maxPrice"
              control={control}
              render={({ field }) => (
                <Input
                  id="maxPrice"
                  type="number"
                  min={1}
                  step="any"
                  placeholder="e.g. 1500"
                  value={field.value ?? ''}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      field.onChange(undefined);
                    } else {
                      const num = Number(val);
                      if (isNaN(num)) {
                        field.onChange(undefined);
                      } else {
                        field.onChange(Math.abs(num));
                      }
                    }
                  }}
                  className={errors.maxPrice ? 'border-destructive' : ''}
                />
              )}
            />
            {errors.maxPrice && (
              <p className="text-xs text-destructive">{errors.maxPrice.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Mechanics will see this as the upper threshold ceiling during competitive bidding.
            </p>
          </div>

          {/* Shop Bidding Radius Selection */}
          <div className="space-y-2 p-3.5 rounded-xl border border-border/80 bg-muted/30">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>Shop Eligibility Radius (KM)</span>
              </Label>
              <Controller
                name="biddingRadiusKm"
                control={control}
                render={({ field }) => (
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    {field.value || 25} km
                  </span>
                )}
              />
            </div>
            
            <Controller
              name="biddingRadiusKm"
              control={control}
              render={({ field }) => (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    {[10, 25, 50, 100].map((radius) => (
                      <button
                        key={radius}
                        type="button"
                        onClick={() => field.onChange(radius)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          field.value === radius
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm font-semibold'
                            : 'bg-card hover:bg-muted text-muted-foreground border-border'
                        }`}
                      >
                        {radius} km
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Custom:</span>
                    <Input
                      type="number"
                      min={1}
                      max={500}
                      value={field.value || ''}
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') {
                          field.onChange(undefined);
                        } else {
                          const num = Number(val);
                          field.onChange(isNaN(num) ? undefined : Math.min(500, Math.max(1, Math.abs(num))));
                        }
                      }}
                      className="h-7 w-24 text-xs"
                      placeholder="e.g. 35"
                    />
                    <span>km from vehicle location</span>
                  </div>
                </div>
              )}
            />
          </div>

          {/* Bidding Rules Intelligence Box */}
          <div className="p-3 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <Clock className="h-3.5 w-3.5" />
              <span>Automated Bidding Lifecycle & Rules</span>
            </div>
            <ul className="text-[11px] text-muted-foreground space-y-1 pl-1">
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span><strong>24-Hour Bidding Window:</strong> Commences immediately upon approval.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span><strong>6-Hour Auto-Extension:</strong> Triggers automatically if 0 bids placed.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <span><strong>Minimum 3 Bids Rule:</strong> Held for Admin Review if &lt; 3 bids at close.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Reject Fields */}
      {selectedAction === 'REJECT' && (
        <div className="space-y-1.5 animate-in fade-in-0 duration-200">
          <Label htmlFor="rejectionReason">Reason for Rejection</Label>
          <Controller
            name="rejectionReason"
            control={control}
            render={({ field }) => (
              <Textarea
                id="rejectionReason"
                rows={3}
                placeholder="Explain to customer why request was rejected (e.g. unclear damage photos, vehicle not supported)..."
                {...field}
                className={errors.rejectionReason ? 'border-destructive' : ''}
              />
            )}
          />
          {errors.rejectionReason && (
            <p className="text-xs text-destructive">{errors.rejectionReason.message}</p>
          )}
        </div>
      )}

      {/* Internal Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes">Internal Operational Notes (Optional)</Label>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <Textarea
              id="notes"
              rows={2}
              placeholder="Staff notes visible only to Thriio administrators..."
              {...field}
            />
          )}
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className={`w-full font-semibold shadow-md ${
          selectedAction === 'APPROVE'
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
            : selectedAction === 'REJECT'
            ? 'bg-destructive hover:bg-destructive/90 text-white'
            : 'bg-amber-600 hover:bg-amber-700 text-white'
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Decision...
          </>
        ) : (
          `Confirm ${selectedAction.replace('_', ' ')}`
        )}
      </Button>
    </form>
  );
};