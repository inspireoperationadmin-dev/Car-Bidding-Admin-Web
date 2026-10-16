import React from 'react';
import { RequestTrendsChart } from '../Dashboard/RequestTrendsChart';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Gavel, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface RequestReportProps {
  data: any;
  loading: boolean;
  error: string | null;
}

const RequestReport: React.FC<RequestReportProps> = ({ data, loading, error }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive font-semibold bg-destructive/10 rounded-xl border border-destructive/20">
        Error loading report: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Requests</p>
              <p className="text-2xl font-black text-foreground mt-1">{data?.totalRequests || 0}</p>
              <span className="text-[10px] text-emerald-600 font-semibold">+5% inflow</span>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Gavel className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active In Bidding</p>
              <p className="text-2xl font-black text-foreground mt-1">{data?.activeBids || 0}</p>
              <span className="text-[10px] text-emerald-600 font-semibold">+12% participation</span>
            </div>
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-600">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Completed</p>
              <p className="text-2xl font-black text-foreground mt-1">{data?.completedRequests || 0}</p>
              <span className="text-[10px] text-emerald-600 font-semibold">+8% repairs done</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cancelled / Rejected</p>
              <p className="text-2xl font-black text-foreground mt-1">{data?.cancelledRequests || 0}</p>
              <span className="text-[10px] text-destructive font-semibold">-2% drop</span>
            </div>
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive">
              <XCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lifecycle Trends Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Request Volume & Lifecycle Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full pt-2">
            <RequestTrendsChart data={data?.trends || []} />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Request Log Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Detailed Request Log</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Bids Count</TableHead>
                <TableHead>Budget (€)</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.requests?.length > 0 ? (
                data.requests.map((req: any) => (
                  <TableRow key={req.id} className="hover:bg-muted/30">
                    <TableCell className="text-xs text-muted-foreground">{req.date}</TableCell>
                    <TableCell className="font-semibold text-sm">{req.customer}</TableCell>
                    <TableCell className="text-xs font-bold">{req.bidsCount}</TableCell>
                    <TableCell className="font-bold text-sm">€{req.maxPrice}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          req.status === 'Completed'
                            ? 'success'
                            : req.status === 'In Bidding'
                            ? 'info'
                            : 'warning'
                        }
                      >
                        {req.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-sm">
                    No request data available for the selected period.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestReport;