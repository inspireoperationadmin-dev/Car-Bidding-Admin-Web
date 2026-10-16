import React from 'react';
import RevenueChart from '../Dashboard/RevenueChart';
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
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react';

interface RevenueReportProps {
  data: any;
  loading: boolean;
  error: string | null;
}

const RevenueReport: React.FC<RevenueReportProps> = ({ data, loading, error }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Total Revenue</p>
              <p className="text-2xl font-black text-foreground mt-1">€{data?.totalRevenue || 0}</p>
              <span className="text-[10px] text-emerald-600 font-semibold">+10% vs last period</span>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <DollarSign className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Avg Transaction</p>
              <p className="text-2xl font-black text-foreground mt-1">€{data?.avgTransaction || 0}</p>
              <span className="text-[10px] text-emerald-600 font-semibold">+5% growth</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase">Total Invoices</p>
              <p className="text-2xl font-black text-foreground mt-1">{data?.payments?.length || 0}</p>
              <span className="text-[10px] text-indigo-500 font-semibold">+15% transactions</span>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Revenue Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full pt-2">
            <RevenueChart data={data?.chartData || []} />
          </div>
        </CardContent>
      </Card>

      {/* Detailed Payments Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Detailed Transaction Log</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Date</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.payments?.length > 0 ? (
                data.payments.map((payment: any, index: number) => (
                  <TableRow key={index} className="hover:bg-muted/30">
                    <TableCell className="text-xs text-muted-foreground">{payment.date}</TableCell>
                    <TableCell className="text-xs uppercase font-mono font-medium">{payment.method}</TableCell>
                    <TableCell className="font-bold text-sm">€{payment.amount}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={payment.status === 'Completed' ? 'success' : 'warning'}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground text-sm">
                    No payment records found for this period.
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

export default RevenueReport;