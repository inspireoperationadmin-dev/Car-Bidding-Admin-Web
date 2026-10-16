import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle, Euro, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const priceSchema = z.object({
  adminMaxPrice: z.preprocess(
    (val) => (val === '' || val === undefined ? undefined : Number(val)),
    z
      .number()
      .min(1, 'Price must be at least 1')
      .refine((val) => val !== undefined, 'Price is required')
  ),
});

type PriceFormValues = z.infer<typeof priceSchema>;

interface PriceSettingFormProps {
  requestId: number;
  onSuccess: () => void;
}

export const PriceSettingForm: React.FC<PriceSettingFormProps> = ({
  requestId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PriceFormValues>({
    resolver: zodResolver(priceSchema) as any,
    defaultValues: {
      adminMaxPrice: undefined,
    },
  });

  const onSubmit = async (data: PriceFormValues) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Setting Max Price for Request #${requestId}:`, data.adminMaxPrice);
      await new Promise((resolve) => setTimeout(resolve, 800));
      onSuccess();
    } catch (err) {
      setError('Failed to update price. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm space-y-4"
    >
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Set Maximum Bidding Price
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          Define the budget limit for competitive bidding on this vehicle repair.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/15 text-destructive text-xs font-medium">
          {error}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="adminMaxPrice">Max Price (€)</Label>
        <div className="relative">
          <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Controller
            name="adminMaxPrice"
            control={control}
            render={({ field }) => (
              <Input
                id="adminMaxPrice"
                type="number"
                min={1}
                step="any"
                placeholder="e.g. 2500"
                className={`pl-9 ${errors.adminMaxPrice ? 'border-destructive' : ''}`}
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
              />
            )}
          />
        </div>
        {errors.adminMaxPrice && (
          <p className="text-xs text-destructive">{errors.adminMaxPrice.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving Price...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            Approve & Set Price
          </>
        )}
      </Button>
    </form>
  );
};