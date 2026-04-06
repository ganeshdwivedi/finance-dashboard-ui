import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface ExpenseChartProps {
  data: { category: string; amount: number }[];
}

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f43f5e",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {payload[0]?.name}
        </p>
        <p
          className="text-lg font-bold"
          style={{ color: payload[0]?.payload.fill }}
        >
          ${payload[0]?.value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const ExpenseChart = ({ data }: ExpenseChartProps) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-[400px]">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
        Spending Breakdown
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={5}
              dataKey="amount"
              nameKey="category"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "14px", paddingTop: "20px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;
