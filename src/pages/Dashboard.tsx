import { useAppSelector } from "../store/hooks";
import MetricCard from "../components/MetricCard";
import BalanceChart from "../components/BalanceChart";
import ExpenseChart from "../components/ExpenseChart";
import { Wallet, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import dayjs from "dayjs";

const Dashboard = () => {
  const transactions = useAppSelector((state) => state.transactions.items);

  // Calculate top-level metrics
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  // Calculate Monthly Comparison (Last 30 days vs Previous 30 days)
  const now = dayjs();
  const thirtyDaysAgo = now.subtract(30, "day");
  const sixtyDaysAgo = now.subtract(60, "day");

  const thisMonthTransactions = transactions.filter((t) =>
    dayjs(t.date).isAfter(thirtyDaysAgo),
  );
  const prevMonthTransactions = transactions.filter(
    (t) =>
      dayjs(t.date).isAfter(sixtyDaysAgo) &&
      dayjs(t.date).isBefore(thirtyDaysAgo),
  );

  const thisMonthIncome = thisMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  const prevMonthIncome = prevMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const thisMonthExpense = thisMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
  const prevMonthExpense = prevMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const incomeGrowth = calculateGrowth(thisMonthIncome, prevMonthIncome);
  const expenseGrowth = calculateGrowth(thisMonthExpense, prevMonthExpense);

  // Prepare data for Expense Pie Chart
  const expenseByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc: Record<string, number>, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
  const expenseData = Object.keys(expenseByCategory).map((cat) => ({
    category: cat,
    amount: expenseByCategory[cat],
  }));

  const balanceData =
    transactions.length > 0
      ? [...transactions]
          .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf())
          .reduce((acc: { date: string; balance: number }[], curr) => {
            const prevBalance =
              acc.length > 0 ? acc[acc.length - 1].balance : 0;
            const newBalance =
              prevBalance +
              (curr.type === "income" ? curr.amount : -curr.amount);

            // Group by date to keep only the last balance of each day
            const currentDate = dayjs(curr.date).format("YYYY-MM-DD");
            if (
              acc.length > 0 &&
              dayjs(acc[acc.length - 1].date).format("YYYY-MM-DD") ===
                currentDate
            ) {
              acc[acc.length - 1].balance = newBalance;
            } else {
              acc.push({ date: curr.date, balance: newBalance });
            }
            return acc;
          }, [])
      : [{ date: dayjs().toISOString(), balance: 0 }];

  // Highest spending category
  const highestCategory =
    expenseData.length > 0
      ? expenseData.reduce(
          (max, item) => (item.amount > max.amount ? item : max),
          { category: "None", amount: 0 },
        )
      : { category: "None", amount: 0 };

  console.log(totalBalance, "totalBalance", incomeGrowth - expenseGrowth);

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Here is a summary of your financial activity.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total Balance"
          value={`$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<Wallet className="h-7 w-7" />}
          trend={{
            value: Number(Math.abs(incomeGrowth - expenseGrowth).toFixed(2)),
            isUp: incomeGrowth - expenseGrowth >= 0,
          }}
        />
        <MetricCard
          title="Total Income"
          value={`$${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<TrendingUp className="h-7 w-7" />}
          trend={{
            value: Number(Math.abs(incomeGrowth).toFixed(2)),
            isUp: incomeGrowth >= 0,
          }}
        />
        <MetricCard
          title="Total Expenses"
          value={`$${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={
            totalExpense > 0 ? (
              <TrendingDown className="h-7 w-7" />
            ) : (
              <TrendingUp className="h-7 w-7" />
            )
          }
          trend={{
            value: Number(Math.abs(expenseGrowth).toFixed(2)),
            isUp: expenseGrowth < 0,
          }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BalanceChart data={balanceData} />
        </div>
        <div>
          <ExpenseChart data={expenseData} />
        </div>
      </div>

      {/* Insights Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Quick Insights
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 p-5 rounded-2xl flex gap-4 items-start">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">
                Highest Spending
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                You've spent the most on{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {highestCategory.category}
                </span>{" "}
                (${highestCategory.amount.toLocaleString()}) recently.
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-5 rounded-2xl flex gap-4 items-start">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">
                Income Trend
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                Your monthly income is{" "}
                <span
                  className={`font-semibold ${incomeGrowth >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                >
                  {incomeGrowth >= 0 ? "up" : "down"}{" "}
                  {Math.abs(incomeGrowth).toFixed(1)}%
                </span>{" "}
                compared to last month.
              </p>
            </div>
          </div>

          <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 p-5 rounded-2xl flex gap-4 items-start">
            <div className="p-2 bg-rose-100 dark:bg-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white">
                Expense Trend
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                Your monthly expenses are{" "}
                <span
                  className={`font-semibold ${expenseGrowth <= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                >
                  {expenseGrowth <= 0 ? "down" : "up"}{" "}
                  {Math.abs(expenseGrowth).toFixed(1)}%
                </span>{" "}
                compared to last month.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
