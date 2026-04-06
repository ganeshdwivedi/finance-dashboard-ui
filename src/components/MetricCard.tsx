import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

const MetricCard = ({ title, value, icon, trend }: MetricCardProps) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
        </div>
        <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className={`text-sm font-medium ${
              trend.isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend.isUp ? '+' : '-'}{trend.value}%
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400">from last month</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
