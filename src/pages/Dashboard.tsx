import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Gavel,
  Car,
  Users as UsersIcon,
  DollarSign,
  Download,
  RefreshCw,
  TrendingUp,
  Activity,
  Sparkles,
  AlertCircle,
  Clock,
  ChevronDown,
  BarChart3,
  Printer,
  FileSpreadsheet,
} from "lucide-react";

// Redux & Actions
import type { AppDispatch, RootState } from "../store";
import { fetchDashboardData } from "../store/slices/dashboardSlice";
import { exportToCsv } from "../utils/exportCsv";

// Components
import MetricCard from "../components/Dashboard/MetricCard";
import RevenueChart from "../components/Dashboard/RevenueChart";
import MechanicChart from "../components/Dashboard/MechanicChart";
import { RequestTrendsChart } from "../components/Dashboard/RequestTrendsChart";
import { MechanicPerformanceChart } from "../components/Dashboard/MechanicChart";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { metrics, analytics, loading, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchDashboardData());
  };

  const handleExportAnalytics = () => {
    if (!analytics || analytics.length === 0) {
      alert("No market telemetry data available to export.");
      return;
    }
    const headers = {
      date: "Date",
      name: "Period",
      pending: "Pending Requests",
      approved: "Approved Bids",
      completed: "Completed Jobs",
      revenue: "Gross Revenue (€)",
    };
    exportToCsv(analytics, headers, "Thriio_Market_Analytics");
  };

  const handleExportMetrics = () => {
    const summaryData = [
      { metric: "Total Requests Logged", value: metrics?.totalRequests ?? 0 },
      { metric: "Active Platform Users", value: metrics?.activeUsers ?? 0 },
      { metric: "Total Gross Revenue (€)", value: metrics?.totalRevenue ?? 0 },
      { metric: "Top Performing Mechanics Count", value: metrics?.topMechanics?.length ?? 0 },
      { metric: "Recent Stream Activities Logged", value: metrics?.recentActivities?.length ?? 0 },
      { metric: "Report Generated At", value: new Date().toLocaleString() },
    ];
    exportToCsv(
      summaryData,
      { metric: "KPI / Metric", value: "Value" },
      "Thriio_Platform_Summary"
    );
  };

  const handleExportMechanics = () => {
    const topMechanics = metrics?.topMechanics || [];
    if (topMechanics.length === 0) {
      alert("No mechanic performance data available to export.");
      return;
    }
    const formatted = topMechanics.map((m: any) => ({
      name: m.name || "Unknown Mechanic",
      rating: m.rating ?? 0,
      jobsCompleted: m.jobsCompleted ?? 0,
      successRate: `${m.successRate ?? 0}%`,
    }));
    exportToCsv(
      formatted,
      {
        name: "Mechanic Name",
        rating: "Rating (out of 5)",
        jobsCompleted: "Jobs Completed",
        successRate: "Success Rate",
      },
      "Thriio_Top_Mechanics"
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ================= TOP HERO & CONTROLS ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="success" className="gap-1.5 px-2.5 py-0.5 font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry
            </Badge>
            <span className="text-xs font-semibold text-muted-foreground">
              Thriio Core Engine
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Market Intelligence
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time repair bidding ecosystem, 20/80 milestone disbursement & mechanic network status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 font-semibold shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span>Export Report</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Export Data (CSV)</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={handleExportAnalytics}
                className="gap-2.5 cursor-pointer py-2"
              >
                <BarChart3 className="h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Market Trends</span>
                  <span className="text-[11px] text-muted-foreground">Requests, bids & revenue timeline</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportMetrics}
                className="gap-2.5 cursor-pointer py-2"
              >
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Platform Overview</span>
                  <span className="text-[11px] text-muted-foreground">Key KPIs & summary metrics</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportMechanics}
                className="gap-2.5 cursor-pointer py-2"
              >
                <UsersIcon className="h-4 w-4 text-blue-500" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Top Mechanics</span>
                  <span className="text-[11px] text-muted-foreground">Ratings & completion metrics</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => window.print()}
                className="gap-2.5 cursor-pointer py-2 text-muted-foreground hover:text-foreground"
              >
                <Printer className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Print / PDF Document</span>
                  <span className="text-[11px] text-muted-foreground">Generate printable page view</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="gradient"
            onClick={handleRefresh}
            disabled={loading}
            className="gap-2 font-semibold shadow-md"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Stream</span>
          </Button>
        </div>
      </div>

      {/* ================= ERROR BANNER ================= */}
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="font-medium">Dashboard Error: {error}</p>
        </div>
      )}

      {/* ================= KEY METRICS ROW ================= */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </>
        ) : (
          <>
            <MetricCard
              title="Live Auctions"
              value={metrics?.totalRequests || 0}
              icon={<Gavel className="h-6 w-6" />}
              change={12.5}
            />
            <MetricCard
              title="Vehicles In Fleet"
              value={metrics?.activeUsers || 0}
              icon={<Car className="h-6 w-6 text-indigo-500" />}
              change={4.2}
            />
            <MetricCard
              title="Registered Members"
              value={metrics?.activeUsers || 0}
              icon={<UsersIcon className="h-6 w-6 text-emerald-500" />}
              change={18.3}
            />
            <MetricCard
              title="Gross Bidding Volume"
              value={`€${(metrics?.totalRevenue || 0).toLocaleString()}`}
              icon={<DollarSign className="h-6 w-6 text-amber-500" />}
              change={24.1}
            />
          </>
        )}
      </div>

      {/* ================= CHARTS SECTION ================= */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Bidding Lifecycle Trends */}
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur-md shadow-sm lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">
                  Bidding Lifecycle Trends
                </h3>
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">
                Distribution of open, bid accepted, and completed repairs
              </p>
            </div>
            <Badge variant="outline" className="gap-1 text-xs">
              <Clock className="h-3 w-3" />
              30-Day Aggregation
            </Badge>
          </div>
          <div className="h-80 w-full min-h-[280px]">
            {loading ? (
              <Skeleton className="h-full w-full rounded-xl" />
            ) : (
              <RequestTrendsChart data={analytics} />
            )}
          </div>
        </div>

        {/* Top Mechanics Leaderboard */}
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur-md shadow-sm lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Top Rated Mechanics
                </h3>
                <p className="text-xs text-muted-foreground">
                  By customer rating and completed repairs
                </p>
              </div>
              <Badge variant="default" className="text-xs">
                Verified
              </Badge>
            </div>
            <div className="h-80 w-full min-h-[280px]">
              {loading ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : (
                <MechanicPerformanceChart data={metrics?.topMechanics || []} />
              )}
            </div>
          </div>
        </div>

        {/* Revenue Velocity & 20/80 Breakdown */}
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur-md shadow-sm lg:col-span-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Revenue & Payment Flow
              </h3>
              <p className="text-xs text-muted-foreground">
                Tracking 20% selection deposits and 80% final milestone releases
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Gross Inflow
              </span>
            </div>
          </div>
          <div className="h-80 w-full min-h-[280px]">
            {loading ? (
              <Skeleton className="h-full w-full rounded-xl" />
            ) : (
              <RevenueChart data={analytics} />
            )}
          </div>
        </div>

        {/* Network Status & Mechanics Distribution */}
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur-md shadow-sm lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Mechanic Network
                </h3>
                <p className="text-xs text-muted-foreground">
                  Active vs verified repair partners
                </p>
              </div>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="h-80 w-full min-h-[280px]">
              {loading ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : (
                <MechanicChart
                  data={[
                    { name: "Verified Partners", value: metrics?.topMechanics?.length || 1 },
                    { name: "Active In Fleet", value: metrics?.activeUsers || 1 },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
