import { useState, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setFilterCategory, setFilterType, type Transaction } from '../store/slices/transactionsSlice';
import TransactionTable from '../components/TransactionTable';
import TransactionModal from '../components/TransactionModal';
import { exportToCSV, exportToJSON } from '../utils/exportUtils';
import { Search, Filter, Download, Plus } from 'lucide-react';

const Transactions = () => {
  const role = useAppSelector((state) => state.app.role);
  const { items, filterCategory, filterType } = useAppSelector((state) => state.transactions);
  const dispatch = useAppDispatch();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique categories for filter
  const categories = useMemo(() => {
    const cats = new Set(items.map((t) => t.category));
    return Array.from(cats).sort();
  }, [items]);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and view your transaction history.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Export Buttons */}
          <div className="flex bg-white dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
            <button
              onClick={() => exportToCSV(items)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Export CSV"
            >
              <Download className="h-3.5 w-3.5" />
              CSV
            </button>
            <div className="w-px bg-slate-200 dark:bg-slate-700 mx-0.5 my-1" />
            <button
              onClick={() => exportToJSON(items)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Export JSON"
            >
              <Download className="h-3.5 w-3.5" />
              JSON
            </button>
          </div>

          {role === 'Admin' && (
            <button
              onClick={handleAddNew}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white outline-none transition-all"
          />
        </div>

        <div className="flex gap-4 w-full sm:w-auto">
          {/* Category Filter */}
          <div className="relative flex-1 sm:w-48">
            <select
              value={filterCategory}
              onChange={(e) => dispatch(setFilterCategory(e.target.value))}
              className="w-full pl-4 pr-10 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Type Filter */}
          <div className="relative flex-1 sm:w-40">
             <select
              value={filterType}
              onChange={(e) => dispatch(setFilterType(e.target.value as any))}
              className="w-full pl-4 pr-10 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <TransactionTable onEdit={handleEdit} searchTerm={searchTerm} />
      </div>

      {/* Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionToEdit={editingTransaction}
      />
    </div>
  );
};

export default Transactions;
