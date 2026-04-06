import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';

interface BalanceChartProps {
  data: { date: string; balance: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-lg">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{dayjs(label).format('MMM D, YYYY')}</p>
        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const BalanceChart = ({ data }: BalanceChartProps) => {
  // Sort data by date just in case
  const sortedData = [...data].sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-[400px]">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Balance Trend</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" className="dark:stroke-slate-700" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(val) => dayjs(val).format('MMM D')}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorBalance)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceChart;
