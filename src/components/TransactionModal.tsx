import { useState, useEffect } from "react";
import { useFinanceData } from "../hooks/useFinanceData";
import type { Transaction } from "../store/slices/transactionsSlice";
import dayjs from "dayjs";
import { X } from "lucide-react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction | null;
}

const TransactionModal = ({
  isOpen,
  onClose,
  transactionToEdit,
}: TransactionModalProps) => {
  const { add, update } = useFinanceData();

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    type: "expense" as "income" | "expense",
    date: dayjs().format("YYYY-MM-DD"),
  });

  useEffect(() => {
    if (transactionToEdit) {
      setFormData({
        description: transactionToEdit?.description,
        amount: transactionToEdit?.amount.toString(),
        category: transactionToEdit?.category,
        type: transactionToEdit?.type,
        date: dayjs(transactionToEdit?.date).format("YYYY-MM-DD"),
      });
    } else {
      setFormData({
        description: "",
        amount: "",
        category: "",
        type: "expense",
        date: dayjs().format("YYYY-MM-DD"),
      });
    }
  }, [transactionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.category) return;

    const payload: Transaction = {
      id: transactionToEdit
        ? transactionToEdit.id
        : Math.random().toString(36).substring(7),
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      date: dayjs(formData.date).toISOString(),
    };

    if (transactionToEdit) {
      update(payload);
    } else {
      add(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {transactionToEdit ? "Edit Transaction" : "New Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white outline-none transition-all"
              placeholder="e.g. Groceries"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white outline-none transition-all"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white outline-none transition-all"
                placeholder="e.g. Food"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as "income" | "expense",
                  })
                }
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white outline-none transition-all"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 rounded-xl transition-all shadow-sm"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
