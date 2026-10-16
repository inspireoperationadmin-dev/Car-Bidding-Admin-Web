import React from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, Legend
} from 'recharts';

interface ChartProps {
  data: any[];
}

const RevenueChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = data && data.length > 0 ? data : [
    { name: 'Recent', revenue: 0 }
  ];

  return (
    <div className="h-full w-full min-h-[280px]">
      <ResponsiveContainer width="100%" height={280} minWidth={0} minHeight={250}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6495ED" stopOpacity={0.3}/>
            <stop offset="50%" stopColor="#6495ED" stopOpacity={0.08}/>
            <stop offset="95%" stopColor="#6495ED" stopOpacity={0}/>
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="rgba(255, 255, 255, 0.04)"
        />

        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
          dy={10}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
          tickFormatter={(value) => `€${value}`}
        />

        <Tooltip
          contentStyle={{
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            color: '#E2E8F0',
            fontWeight: 600,
          }}
          formatter={(value: any) => [`€${value}`, 'Revenue']}
          labelStyle={{ color: '#64748B', fontWeight: 600, marginBottom: 4 }}
          itemStyle={{ color: '#6495ED' }}
        />

        <Legend
          verticalAlign="top"
          align="right"
          height={36}
          iconType="circle"
          wrapperStyle={{ color: '#94A3B8', fontWeight: 600, fontSize: '12px' }}
        />

        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke="#6495ED"
          strokeWidth={2.5}
          fillOpacity={1}
          fill="url(#revenueGradient)"
          activeDot={{
            r: 6,
            strokeWidth: 2,
            stroke: '#6495ED',
            fill: '#0F172A',
            style: { filter: 'drop-shadow(0 0 6px rgba(100, 149, 237, 0.5))' }
          }}
          dot={false}
        />
      </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
