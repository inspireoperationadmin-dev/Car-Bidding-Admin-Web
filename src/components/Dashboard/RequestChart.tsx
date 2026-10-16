// // src/components/dashboard/RequestChart.tsx
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const data = [
//   { month: "Jan", requests: 120 },
//   { month: "Feb", requests: 180 },
//   { month: "Mar", requests: 150 },
//   { month: "Apr", requests: 210 },
//   { month: "May", requests: 260 },
// ];

// export default function RequestChart() {
//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <LineChart data={data}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="month" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Line
//           type="monotone"
//           dataKey="requests"
//           stroke="#6495ED"
//           strokeWidth={3}
//         />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// }




//  import React from "react";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// // 1. Intha Interface romba mukkiyam! 
// // Ithu illaiyendraal thaan "IntrinsicAttributes" error varum.
// interface RequestChartProps {
//   data?: any[];
// }

// export default function RequestChart({ data }: RequestChartProps) {
//   // Data varavillai endral empty array fallback
//   const chartData = data && data.length > 0 ? data : [];

//   return (
//     <ResponsiveContainer width="100%" height={350}>
//       <AreaChart
//         data={chartData}
//         margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
//       >
//         <defs>
//           <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
//             <stop offset="5%" stopColor="#6495ED" stopOpacity={0.8} />
//             <stop offset="95%" stopColor="#6495ED" stopOpacity={0} />
//           </linearGradient>
//         </defs>
//         <XAxis 
//           dataKey="month" // Backend data-il "month" field irukkanum
//           hide 
//         />
//         <YAxis hide />
//         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
//         <Tooltip 
//           contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
//         />
//         <Area
//           type="monotone"
//           dataKey="requests" // Backend data-il "requests" count irukkanum
//           stroke="#6495ED"
//           fillOpacity={1}
//           fill="url(#colorRequests)"
//           strokeWidth={3}
//         />
//       </AreaChart>
//     </ResponsiveContainer>
//   );
// }



import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

interface ChartProps {
  data: any[];
}

const RequestChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300} minWidth={0} minHeight={250}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#64748B', fontSize: 12 }} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#64748B', fontSize: 12 }} 
        />
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
        />
        <Legend iconType="circle" />
        <Line 
          type="monotone" 
          dataKey="requests" 
          stroke="#6495ED" 
          strokeWidth={3} 
          dot={{ r: 6, fill: '#6495ED' }} 
          activeDot={{ r: 8 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RequestChart;