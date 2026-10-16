import React, { useState } from 'react';
import {
  TrendingUp,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  BarChart3,
} from 'lucide-react';
import {
  AreaChart,
  Area,
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
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface PaymentAnalyticsProps {
  dateRange?: { from: Date; to: Date };
}

type PeriodType = 'today' | 'week' | 'month' | 'year';

const MOCK_REVENUE_TREND = [
  { name: 'Mon', amount: 2400 },
  { name: 'Tue', amount: 1398 },
  { name: 'Wed', amount: 9800 },
  { name: 'Thu', amount: 3908 },
  { name: 'Fri', amount: 4800 },
  { name: 'Sat', amount: 3800 },
  { name: 'Sun', amount: 4300 },
];

const MOCK_METHODS = [
  { name: 'Stripe Card', value: 55 },
  { name: 'Apple Pay', value: 25 },
  { name: 'SEPA Direct', value: 15 },
  { name: 'PayPal', value: 5 },
];

const COLORS = ['#2563eb', '#38bdf8', '#10b981', '#f59e0b'];

export const PaymentAnalytics: React.FC<PaymentAnalyticsProps> = () => {
  const [period, setPeriod] = useState<PeriodType>('month');

  return (
    <div className="space-y-6">
      {/* Header with period toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold">Financial Telemetry & Revenue Split</h2>
        </div>

        <div className="flex items-center bg-muted p-1 rounded-lg border text-xs">
          {(['today', 'week', 'month', 'year'] as PeriodType[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-md font-semibold capitalize transition-colors ${
                period === p
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Total Processed</p>
              <p className="text-2xl font-black text-foreground mt-1">€24,500.00</p>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                +12.4% vs last period
              </span>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Total Transactions</p>
              <p className="text-2xl font-black text-foreground mt-1">1,420</p>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                +5.2% volume
              </span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Success Rate</p>
              <p className="text-2xl font-black text-foreground mt-1">98.5%</p>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                +0.3% reliability
              </span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Disputed / Failed</p>
              <p className="text-2xl font-black text-foreground mt-1">€120.00</p>
              <span className="text-[11px] font-semibold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">
                1.5% rate
              </span>
            </div>
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive">
              <AlertCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Revenue Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full pt-4 min-h-[260px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
                <AreaChart data={MOCK_REVENUE_TREND}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} tickFormatter={(v) => `€${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--popover-foreground))',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Payment Methods Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full flex items-center justify-center min-h-[260px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={240}>
                <PieChart>
                  <Pie
                    data={MOCK_METHODS}
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {MOCK_METHODS.map((_, index) => (
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
    </div>
  );
};

export default PaymentAnalytics;