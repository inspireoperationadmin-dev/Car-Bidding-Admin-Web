import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download, Calendar, BarChart3 } from 'lucide-react';
import type { AppDispatch, RootState } from '@/store';
import {
  fetchRevenueReport,
  fetchRequestReport,
  fetchMechanicReport,
} from '@/store/slices/reportsSlice';
import { exportToCsv } from '@/utils/exportCsv';
import RevenueReport from '@/components/reports/RevenueReport';
import RequestReport from '@/components/reports/RequestReport';
import MechanicPerformanceReport from '@/components/reports/MechanicPerformanceReport';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';

export default function Reports() {
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState('revenue');
  const [dateRange, setDateRange] = useState('7d');

  const { revenueData, requestData, mechanicData, loading, error } = useSelector(
    (state: RootState) => state.reports
  );

  useEffect(() => {
    const filters = { range: dateRange };
    if (activeTab === 'revenue') dispatch(fetchRevenueReport(filters));
    if (activeTab === 'requests') dispatch(fetchRequestReport(filters));
    if (activeTab === 'mechanics') dispatch(fetchMechanicReport(filters));
  }, [dispatch, activeTab, dateRange]);

  const handleExport = () => {
    if (activeTab === 'revenue' && revenueData) {
      const data = (revenueData as any)?.payments || [];
      exportToCsv(
        data,
        { date: 'Date', method: 'Method', amount: 'Amount', status: 'Status' },
        'Revenue_Report'
      );
    } else if (activeTab === 'requests' && requestData) {
      const data = (requestData as any)?.requests || [];
      exportToCsv(
        data,
        { id: 'ID', date: 'Date', customer: 'Customer', status: 'Status' },
        'Requests_Report'
      );
    } else if (activeTab === 'mechanics' && mechanicData) {
      const data = (mechanicData as any)?.mechanicStats || [];
      exportToCsv(
        data,
        {
          name: 'Name',
          rating: 'Rating',
          completedJobs: 'Jobs',
          location: 'Location',
        },
        'Mechanic_Performance'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">
            Analytics & Reports Command
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comprehensive platform intelligence across revenue, repair orders, and mechanic rosters.
          </p>
        </div>

        <Button
          onClick={handleExport}
          disabled={loading}
          className="gap-2 font-semibold shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Date Range Selector Toolbar */}
      <Card>
        <CardContent className="p-3 flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            Reporting Window:
          </div>
          <div className="w-48">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last Quarter (90 Days)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full sm:w-[400px] grid-cols-3">
          <TabsTrigger value="revenue" className="font-semibold text-xs">Revenue</TabsTrigger>
          <TabsTrigger value="requests" className="font-semibold text-xs">Requests</TabsTrigger>
          <TabsTrigger value="mechanics" className="font-semibold text-xs">Mechanics</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <RevenueReport data={revenueData} loading={loading} error={error} />
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <RequestReport data={requestData} loading={loading} error={error} />
        </TabsContent>

        <TabsContent value="mechanics" className="space-y-4">
          <MechanicPerformanceReport data={mechanicData} loading={loading} error={error} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
