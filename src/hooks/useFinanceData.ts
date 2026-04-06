import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addTransaction,
  updateTransaction,
  deleteTransaction as deleteTransactionAction,
  type Transaction,
} from "../store/slices/transactionsSlice";

export const useFinanceData = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.transactions.items);

  const syncToLocalStorage = useCallback((updatedItems: Transaction[]) => {
    localStorage.setItem("finDash_transactions", JSON.stringify(updatedItems));
  }, []);

  const add = (transaction: Transaction) => {
    dispatch(addTransaction(transaction));
    syncToLocalStorage([...transactions, transaction]);
  };

  const update = (transaction: Transaction) => {
    dispatch(updateTransaction(transaction));
    const updated = transactions.map((t) =>
      t.id === transaction.id ? transaction : t,
    );
    syncToLocalStorage(updated);
  };

  const remove = (id: string) => {
    dispatch(deleteTransactionAction(id));
    const updated = transactions.filter((t) => t.id !== id);
    syncToLocalStorage(updated);
  };

  return {
    transactions,
    add,
    update,
    remove,
  };
};
