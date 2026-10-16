import React, { useEffect, useState } from 'react';
import {
  Download,
  TrendingUp,
  CreditCard,
  Percent,
  Clock,
  Filter,
  Loader2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { exportToCsv } from '@/utils/exportCsv';
import apiClient from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';

const COLORS = ['#2563eb', '#38bdf8', '#10b981', '#f59e0b'];

export const PaymentReports: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('REVENUE');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('ALL');
  const [reportData, setReportData] = useState<any>(null);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/payments/reports', {
        params: { reportType, startDate, endDate, status },
      });
      setReportData(response.data.data);
    } catch (error) {
      console.error('Report Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const summary = reportData?.summary;
  const chartData = reportData?.chartData || [
    { date: '2025-01', revenue: 12000 },
    { date: '2025-02', revenue: 19000 },
    { date: '2025-03', revenue: 24500 },
  ];
  const methodDistribution = reportData?.methodDistribution || [
    { name: 'Stripe Card', value: 65 },
    { name: 'Apple Pay', value: 25 },
    { name: 'SEPA Direct', value: 10 },
  ];
  const transactions = reportData?.transactions || [];

  const summaryCards = [
    {
      label: 'Gross Volume',
      value: summary ? `€${summary.totalRevenue.toLocaleString()}` : '€24,500.00',
      icon: <TrendingUp className="w-5 h-5 text-primary" />,
      sub: 'Platform settlement total',
    },
    {
      label: 'Total Invoices',
      value: summary ? summary.totalPayments.toLocaleString() : '1,420',
      icon: <CreditCard className="w-5 h-5 text-emerald-500" />,
      sub: 'Transactions processed',
    },
    {
      label: 'Settlement Success',
      value: summary ? `${summary.successRate}%` : '98.5%',
      icon: <Percent className="w-5 h-5 text-amber-500" />,
      sub: 'Low chargeback rate',
    },
    {
      label: 'Average Ticket',
      value: summary ? `€${summary.avgTransaction.toLocaleString()}` : '€172.50',
      icon: <Clock className="w-5 h-5 text-sky-500" />,
      sub: 'Per repair milestone',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Financial & Settlement Reports
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Export audit trails, view 20/80 milestone releases, and analyze revenue trends.
          </p>
        </div>

        <Button
          variant="default"
          className="gap-2 shadow-sm font-semibold"
          onClick={() =>
            exportToCsv(
              transactions.length > 0 ? transactions : [{ status: 'No data' }],
              {
                date: 'Date',
                transactionId: 'Transaction ID',
                method: 'Payment Method',
                status: 'Status',
                amount: 'Amount (€)',
              },
              'thriio-payment-report'
            )
          }
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Filter Toolbar */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
            <div>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Report Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REVENUE">Revenue Report</SelectItem>
                  <SelectItem value="TRANSACTION">Transactions</SelectItem>
                  <SelectItem value="FAILED">Failed Payments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-10 text-xs"
                placeholder="From Date"
              />
            </div>

            <div>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-10 text-xs"
                placeholder="To Date"
              />
            </div>

            <div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={fetchReport}
              disabled={loading}
              className="h-10 font-semibold gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Filter className="w-4 h-4" />
                  Run Filter
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <Card key={i}>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-black text-foreground mt-1">{card.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{card.sub}</p>
              </div>
              <div className="p-3 rounded-xl bg-muted/60">{card.icon}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Revenue Trajectory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full pt-2 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} tickFormatter={(v) => `€${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--popover-foreground))',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#2563eb' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Gateway Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full flex items-center justify-center min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
                <PieChart>
                  <Pie
                    data={methodDistribution}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {methodDistribution.map((_: any, index: number) => (
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
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Log Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Audit Transaction Log</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Date</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Payment Gateway</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                  </TableCell>
                </TableRow>
              ) : transactions.length > 0 ? (
                transactions.map((row: any, i: number) => (
                  <TableRow key={i} className="hover:bg-muted/30">
                    <TableCell className="text-xs text-muted-foreground">{row.date}</TableCell>
                    <TableCell className="font-mono text-xs font-bold text-primary">
                      #{row.transactionId}
                    </TableCell>
                    <TableCell className="text-xs font-medium uppercase">{row.method}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          row.status === 'Completed'
                            ? 'success'
                            : row.status === 'Failed'
                            ? 'destructive'
                            : 'warning'
                        }
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-sm">
                      €{row.amount?.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-sm">
                    No transactions found for the selected query. Click "Run Filter" to load live data.
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

export default PaymentReports;
