import React from 'react';
import { ArrowLeftRight, CheckCircle2, Clock, Euro } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export interface Bid {
  id: string | number;
  mechanicName: string;
  price: number;
  duration: string | number;
  description: string;
}

interface BidComparisonViewProps {
  bids: Bid[];
  onSelect: (bid: Bid) => void;
  loading?: boolean;
}

export const BidComparisonView: React.FC<BidComparisonViewProps> = ({
  bids,
  onSelect,
  loading,
}) => {
  const bestValueBid = React.useMemo(() => {
    if (!bids || bids.length === 0) return null;
    return [...bids].sort((a, b) => a.price - b.price)[0];
  }, [bids]);

  if (loading) {
    return (
      <div className="py-12 text-center text-sm text-muted-foreground">
        Loading bid comparisons...
      </div>
    );
  }

  if (!bids || bids.length === 0) {
    return (
      <div className="p-8 rounded-xl border border-dashed text-center bg-muted/20">
        <p className="text-sm text-muted-foreground font-medium">
          No bids available yet to compare for this request.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <ArrowLeftRight className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-base text-foreground">Mechanic Bid Comparison</h3>
          <p className="text-xs text-muted-foreground">
            Evaluating {bids.length} competing workshop proposals
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bids.map((bid, index) => {
          const isBest = bid.id === bestValueBid?.id;

          return (
            <motion.div
              key={bid.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="h-full"
            >
              <Card
                className={`relative flex flex-col justify-between h-full transition-all duration-200 ${
                  isBest
                    ? 'border-emerald-500 bg-emerald-500/[0.03] ring-1 ring-emerald-500/20 shadow-md'
                    : 'hover:border-border/80'
                }`}
              >
                {isBest && (
                  <div className="absolute -top-2.5 right-4 z-10">
                    <Badge variant="success" className="gap-1 shadow-sm font-black text-[10px]">
                      <CheckCircle2 className="w-3 h-3" />
                      BEST VALUE OFFER
                    </Badge>
                  </div>
                )}

                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground block">
                      Mechanic Workshop
                    </span>
                    <h4 className="font-bold text-base text-foreground mt-0.5">
                      {bid.mechanicName}
                    </h4>

                    <div className="border-t my-3" />

                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground flex items-center gap-1">
                          <Euro className="w-3 h-3" /> Total Quote
                        </span>
                        <p
                          className={`text-2xl font-black mt-0.5 ${
                            isBest ? 'text-emerald-600 dark:text-emerald-400' : 'text-primary'
                          }`}
                        >
                          €{Number(bid.price).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          20% deposit: €{(Number(bid.price) * 0.2).toFixed(2)}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Turnaround Estimate
                        </span>
                        <p className="text-sm font-bold text-foreground mt-0.5">
                          {bid.duration} Days
                        </p>
                      </div>

                      {bid.description && (
                        <div>
                          <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground block">
                            Proposal Note
                          </span>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                            {bid.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => onSelect(bid)}
                    className={`w-full font-bold text-xs ${
                      isBest
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'variant-outline'
                    }`}
                    variant={isBest ? 'default' : 'outline'}
                  >
                    {isBest ? 'Select Best Offer' : 'Select This Bid'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};