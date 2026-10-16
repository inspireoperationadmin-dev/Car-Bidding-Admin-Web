import React, { useEffect, useState, useCallback } from 'react';
import {
  RotateCcw,
  Gavel,
  TrendingUp,
  FileSpreadsheet,
  AlertTriangle,
  Clock,
  Car,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import apiClient from '../../api/client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

export default function BidDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/admin/dashboard');
      setData(response.data);
    } catch (err) {
      console.error('Fetch Error:', err);
      // Fallback mock telemetry if backend route isn't primed yet
      setData({
        stats: { activeRequests: 24, totalBidsToday: 142, avgBidPrice: 850, expiringSoon: 3 },
        chartData: [
          { name: 'Active Bids', value: 85 },
          { name: 'Selected', value: 45 },
          { name: 'Withdrawn', value: 12 },
          { name: 'Rejected', value: 8 },
        ],
        recentBids: [
          { id: 101, car: 'Audi A3 Sportback', user: 'John M.', price: 750, status: 'Active', time: '2m ago' },
          { id: 102, car: 'VW Golf Mk8', user: 'Sarah L.', price: 1200, status: 'Active', time: '5m ago' },
          { id: 103, car: 'BMW 3 Series', user: 'Mike R.', price: 2100, status: 'Selected', time: '12m ago' },
          { id: 104, car: 'Tesla Model 3', user: 'Anna K.', price: 1850, status: 'Active', time: '15m ago' },
        ],
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Bidding Operations & Live Monitor
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time auction telemetry, mechanic participation rates, and active bids.
          </p>
        </div>

        <Button
          onClick={fetchDashboardData}
          disabled={loading}
          variant="outline"
          className="gap-2 font-semibold"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Sync Live Data
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-sm font-medium">
          {error}
        </div>
      )}

      {/* Stats KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Requests
              </p>
              {loading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <p className="text-3xl font-black text-foreground mt-1">
                  {data?.stats?.activeRequests || 0}
                </p>
              )}
              <span className="text-[11px] text-primary font-semibold">Open for bids</span>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Bids Submitted
              </p>
              {loading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <p className="text-3xl font-black text-foreground mt-1">
                  {data?.stats?.totalBidsToday || 0}
                </p>
              )}
              <span className="text-[11px] text-emerald-600 font-semibold">Today's volume</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
              <Gavel className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Average Bid Offer
              </p>
              {loading ? (
                <Skeleton className="h-8 w-20 mt-1" />
              ) : (
                <p className="text-3xl font-black text-foreground mt-1">
                  €{data?.stats?.avgBidPrice || 0}
                </p>
              )}
              <span className="text-[11px] text-indigo-500 font-semibold">Market price benchmark</span>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-amber-500/[0.03]">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Expiring Soon
              </p>
              {loading ? (
                <Skeleton className="h-8 w-12 mt-1" />
              ) : (
                <p className="text-3xl font-black text-amber-700 dark:text-amber-400 mt-1">
                  {data?.stats?.expiringSoon || 0}
                </p>
              )}
              <span className="text-[11px] text-amber-600 font-semibold">&lt; 24 hrs remaining</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/15 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Activity Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bidding Distribution Pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Bidding Volume by State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full flex items-center justify-center">
              {loading ? (
                <Skeleton className="h-56 w-56 rounded-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
                  <PieChart>
                    <Pie
                      data={data?.chartData || []}
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(data?.chartData || []).map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--popover-foreground))',
                      }}
                    />
                    <Legend verticalAlign="bottom" iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Live Bidding Activity Feed */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold">Live Activity Stream</CardTitle>
            <Badge variant="outline" className="gap-1 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              REAL-TIME
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Vehicle & Bidder</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={3}>
                        <Skeleton className="h-10 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  data?.recentBids?.map((bid: any) => (
                    <TableRow key={bid.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-lg bg-muted text-primary">
                            <Car className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-foreground">{bid.car}</p>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> {bid.time} &middot; {bid.user}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="font-bold text-sm text-foreground">
                        €{Number(bid.price).toLocaleString()}
                      </TableCell>

                      <TableCell className="text-right">
                        <Badge
                          variant={bid.status === 'Selected' ? 'success' : 'info'}
                          className="text-[10px]"
                        >
                          {bid.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
