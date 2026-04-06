import { useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { useFinanceData } from '../hooks/useFinanceData';
import { setSortBy, setSortOrder } from '../store/slices/transactionsSlice';
import type { Transaction } from '../store/slices/transactionsSlice';
import dayjs from 'dayjs';
import { ArrowUpDown, Trash2, Edit2 } from 'lucide-react';

interface TransactionTableProps {
  onEdit: (transaction: Transaction) => void;
  searchTerm: string;
}

const TransactionTable = ({ onEdit, searchTerm }: TransactionTableProps) => {
  const dispatch = useAppDispatch();
  const { remove } = useFinanceData();
  const { items, filterCategory, filterType, sortBy, sortOrder } = useAppSelector((state) => state.transactions);
  const role = useAppSelector((state) => state.app.role);

  const filteredAndSortedItems = useMemo(() => {
    let result = [...items];

    // Filter by Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(lowerSearch) ||
          t.category.toLowerCase().includes(lowerSearch)
      );
    }

    // Filter by Category
    if (filterCategory !== 'all') {
      result = result.filter((t) => t.category === filterCategory);
    }

    // Filter by Type
    if (filterType !== 'all') {
      result = result.filter((t) => t.type === filterType);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = dayjs(a.date).valueOf() - dayjs(b.date).valueOf();
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [items, filterCategory, filterType, sortBy, sortOrder, searchTerm]);

  const handleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      dispatch(setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      dispatch(setSortBy(field));
      dispatch(setSortOrder('desc'));
    }
  };

  const SortIcon = ({ field }: { field: 'date' | 'amount' }) => (
    <ArrowUpDown
      className={`h-4 w-4 inline-block ml-1 cursor-pointer hover:text-indigo-600 transition-colors ${
        sortBy === field ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
      }`}
      onClick={() => handleSort(field)}
    />
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th className="px-6 py-4">
              Date <SortIcon field="date" />
            </th>
            <th className="px-6 py-4 truncate">Description</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">
              Amount <SortIcon field="amount" />
            </th>
            <th className="px-6 py-4 text-center">Type</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {filteredAndSortedItems.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                No transactions found.
              </td>
            </tr>
          ) : (
            filteredAndSortedItems.map((tx) => (
              <tr
                key={tx.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {dayjs(tx.date).format('MMM D, YYYY')}
                </td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {tx.description}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md text-xs font-medium">
                    {tx.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold whitespace-nowrap">
                  ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      tx.type === 'income'
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                        : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {tx.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(tx)}
                      disabled={role !== 'Admin'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        role === 'Admin'
                          ? 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10'
                          : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                      }`}
                      title={role !== 'Admin' ? 'Admin only' : 'Edit'}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => role === 'Admin' && remove(tx.id)}
                      disabled={role !== 'Admin'}
                      className={`p-1.5 rounded-lg transition-colors ${
                        role === 'Admin'
                          ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                          : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                      }`}
                      title={role !== 'Admin' ? 'Admin only' : 'Delete'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
