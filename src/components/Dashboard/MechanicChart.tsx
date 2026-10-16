import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  PieChart,
  Pie,
} from 'recharts';
import { Star } from 'lucide-react';
import { Badge } from '../ui/badge';

// ==================== PIE CHART (Mechanic Status Distribution) ====================

interface PieChartProps {
  data: any[];
}

const DONUT_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export const MechanicChart: React.FC<PieChartProps> = ({ data }) => {
  const pieData = data && data.length > 0 ? data : [
    { name: 'Active Partners', value: 1 },
    { name: 'Pending Review', value: 0 }
  ];

  return (
    <div className="h-full w-full min-h-[280px]">
      <ResponsiveContainer width="100%" height={280} minWidth={0} minHeight={250}>
        <PieChart>
          <Pie
            data={pieData}
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={4}
            dataKey="value"
            nameKey="name"
            stroke="none"
          >
            {pieData.map((_entry: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={DONUT_COLORS[index % DONUT_COLORS.length]}
              />
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
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MechanicChart;

// ==================== BAR CHART (Mechanic Performance) ====================

interface MechanicData {
  name: string;
  rating: number;
  jobsCompleted: number;
  successRate: number;
}

interface PerformanceChartProps {
  data: MechanicData[];
}

const BAR_COLORS = ['#2563eb', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

export const MechanicPerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const chartData = data && data.length > 0 ? data : [
    { name: 'Top Workshops', rating: 5, jobsCompleted: 0, successRate: 100 }
  ];

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs text-muted-foreground font-medium">
          Ranked by workshop rating and volume
        </span>
        <Badge variant="warning" className="gap-1 font-bold text-xs">
          <Star className="w-3 h-3 fill-amber-500" />
          Top Rated
        </Badge>
      </div>

      <div className="h-[280px] w-full min-h-[260px]">
        <ResponsiveContainer width="100%" height={260} minWidth={0} minHeight={240}>
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 600 }}
              width={90}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--popover-foreground))',
              }}
              formatter={(value: any, name: any) => [value, name === 'rating' ? 'Rating' : 'Jobs Done']}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
            />

            <Bar
              dataKey="rating"
              name="Avg Rating"
              radius={[0, 6, 6, 0]}
              barSize={14}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </Bar>

            <Bar
              dataKey="jobsCompleted"
              name="Jobs Done"
              fill="hsl(var(--muted-foreground) / 0.3)"
              radius={[0, 6, 6, 0]}
              barSize={10}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
