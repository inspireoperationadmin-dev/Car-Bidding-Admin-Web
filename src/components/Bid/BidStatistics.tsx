import React, { useMemo } from 'react';
import { Download, PieChart as PieIcon, LineChart as LineIcon, BarChart3, Gavel, DollarSign } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import * as Papa from 'papaparse';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

export interface BidDto {
  id: number;
  price: number;
  status: string;
  createdAt: string | Date;
  mechanicName: string;
}

interface BidStatisticsProps {
  bids: BidDto[];
  dateRange?: { from: Date; to: Date };
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

export const BidStatistics: React.FC<BidStatisticsProps> = ({ bids, dateRange }) => {
  const stats = useMemo(() => {
    const filtered = dateRange
      ? bids.filter((b) => {
          const date = new Date(b.createdAt);
          return date >= dateRange.from && date <= dateRange.to;
        })
      : bids;

    if (filtered.length === 0) return null;

    const total = filtered.length;
    const avgPrice = filtered.reduce((sum, b) => sum + b.price, 0) / total;

    // Status distribution
    const statusMap = filtered.reduce((acc: any, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {});
    const byStatus = Object.keys(statusMap).map((name) => ({
      name,
      value: statusMap[name],
    }));

    // Bids Over Time
    const timeMap = filtered.reduce((acc: any, b) => {
      const date = new Date(b.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      });
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    const overTime = Object.keys(timeMap).map((date) => ({
      date,
      count: timeMap[date],
    }));

    // Price distribution
    const priceRanges = [
      { range: '< €500', count: filtered.filter((b) => b.price < 500).length },
      { range: '€500-1k', count: filtered.filter((b) => b.price >= 500 && b.price < 1000).length },
      { range: '€1k-2k', count: filtered.filter((b) => b.price >= 1000 && b.price < 2000).length },
      { range: '> €2k', count: filtered.filter((b) => b.price >= 2000).length },
    ];

    return { total, avgPrice, byStatus, overTime, priceRanges, filtered };
  }, [bids, dateRange]);

  const handleExport = () => {
    if (!stats) return;
    const csv = Papa.unparse(stats.filtered);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `thriio_bid_stats_${Date.now()}.csv`);
    link.click();
  };

  if (!stats) {
    return (
      <div className="p-8 rounded-xl border border-dashed text-center bg-card">
        <p className="text-sm text-muted-foreground">
          No bidding data found for the selected period.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Auction Market Analytics</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Macro bidding indicators, distribution curves, and volume trends.
          </p>
        </div>
        <Button onClick={handleExport} variant="outline" className="gap-2 font-semibold text-xs">
          <Download className="w-4 h-4" />
          Export Dataset
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Bids Submitted
              </p>
              <p className="text-3xl font-black text-foreground mt-1">{stats.total}</p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Gavel className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Average Bid Value
              </p>
              <p className="text-3xl font-black text-foreground mt-1">
                €{stats.avgPrice.toFixed(0)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-primary" />
              Bid Outcome Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full min-h-[240px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
                <PieChart>
                  <Pie
                    data={stats.byStatus}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {stats.byStatus.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Activity Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <LineIcon className="w-4 h-4 text-primary" />
              Bidding Velocity Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full pt-2 min-h-[240px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
                <LineChart data={stats.overTime}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#2563eb' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Range Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Bid Price Bracket Distribution (€)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full pt-2 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
              <BarChart data={stats.priceRanges}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};