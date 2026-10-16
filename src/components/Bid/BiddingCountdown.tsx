import React, { useState, useEffect, useCallback } from 'react';
import { Clock, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';

interface BiddingCountdownProps {
  deadline: string | Date;
  onExpired?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

export const BiddingCountdown: React.FC<BiddingCountdownProps> = ({ deadline, onExpired }) => {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const targetDate = new Date(deadline).getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      total: difference,
    };
  }, [deadline]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);

      if (remaining.total <= 0) {
        clearInterval(timer);
        onExpired?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, onExpired]);

  const { total, days, hours, minutes, seconds } = timeLeft;

  // Expired state
  if (total <= 0) {
    return (
      <Badge variant="outline" className="gap-1 font-semibold text-xs text-muted-foreground">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Bidding Closed
      </Badge>
    );
  }

  // Critical (< 1 hour)
  if (total < 3600000) {
    return (
      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="inline-block"
      >
        <Badge variant="destructive" className="gap-1 font-bold text-xs shadow-sm">
          <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
          {minutes}m {seconds}s remaining
        </Badge>
      </motion.div>
    );
  }

  // Warning (< 24 hours)
  if (total < 86400000) {
    return (
      <Badge variant="warning" className="gap-1 font-semibold text-xs">
        <AlertTriangle className="w-3.5 h-3.5" />
        {hours}h {minutes}m left
      </Badge>
    );
  }

  // Normal healthy (> 24 hours)
  return (
    <Badge variant="info" className="gap-1 font-semibold text-xs">
      <Clock className="w-3.5 h-3.5" />
      {days}d {hours}h left
    </Badge>
  );
};