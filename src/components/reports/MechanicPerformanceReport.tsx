import React from 'react';
import { MechanicPerformanceChart } from '../Dashboard/MechanicChart';
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
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import { Wrench, Star, CheckCircle2, ShieldCheck } from 'lucide-react';

interface MechanicPerformanceReportProps {
  data: any;
  loading: boolean;
  error: string | null;
}

const MechanicPerformanceReport: React.FC<MechanicPerformanceReportProps> = ({
  data,
  loading,
  error,
}) => {
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
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Registered Mechanics
              </p>
              <p className="text-2xl font-black text-foreground mt-1">{data?.totalMechanics || 0}</p>
              <span className="text-[10px] text-emerald-600 font-semibold">+2 new onboarding</span>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Wrench className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Avg Platform Rating
              </p>
              <p className="text-2xl font-black text-foreground mt-1">
                {data?.avgRating || '4.8'} / 5.0
              </p>
              <span className="text-[10px] text-amber-500 font-semibold">High quality index</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600">
              <Star className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Completion Rate
              </p>
              <p className="text-2xl font-black text-foreground mt-1">
                {data?.completionRate || 94}%
              </p>
              <span className="text-[10px] text-emerald-600 font-semibold">+3% turnaround</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performers Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">
            Top Mechanics by Revenue & Verified Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full pt-2">
            <MechanicPerformanceChart data={data?.topMechanics || []} />
          </div>
        </CardContent>
      </Card>

      {/* Mechanic Roster Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold">Mechanic Performance Audit</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Mechanic</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Jobs Completed</TableHead>
                <TableHead>Average Ticket</TableHead>
                <TableHead className="text-right">Workshop Region</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.mechanicStats?.length > 0 ? (
                data.mechanicStats.map((mech: any) => (
                  <TableRow key={mech.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="w-8 h-8 bg-primary/10 text-primary font-bold text-xs">
                          <AvatarFallback>{mech.name ? mech.name[0] : 'M'}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-sm">{mech.name}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {mech.isVerified ? (
                        <Badge variant="success" className="gap-1 text-[10px]">
                          <ShieldCheck className="w-3 h-3" />
                          Verified Pro
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="text-[10px]">Pending</Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span>{mech.rating || 5.0}</span>
                      </div>
                    </TableCell>

                    <TableCell className="font-bold text-sm">{mech.completedJobs || 0}</TableCell>
                    <TableCell className="font-bold text-sm">€{mech.avgPrice || 0}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {mech.location || 'Dublin / Remote'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-sm">
                    No mechanic performance data found for this period.
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

export default MechanicPerformanceReport;