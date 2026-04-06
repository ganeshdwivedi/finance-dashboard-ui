import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  description: string;
}

interface TransactionsState {
  items: Transaction[];
  filterCategory: string;
  filterType: "all" | "income" | "expense";
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
}

const generateMockData = (): Transaction[] => {
  return [];
};

const loadFromLocalStorage = (): Transaction[] => {
  const stored = localStorage.getItem("finDash_transactions");
  return stored ? JSON.parse(stored) : generateMockData();
};

const initialState: TransactionsState = {
  items: loadFromLocalStorage(),
  filterCategory: "all",
  filterType: "all",
  sortBy: "date",
  sortOrder: "desc",
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.items.push(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    setFilterCategory: (state, action: PayloadAction<string>) => {
      state.filterCategory = action.payload;
    },
    setFilterType: (
      state,
      action: PayloadAction<"all" | "income" | "expense">,
    ) => {
      state.filterType = action.payload;
    },
    setSortBy: (state, action: PayloadAction<"date" | "amount">) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortOrder = action.payload;
    },
  },
});

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setFilterCategory,
  setFilterType,
  setSortBy,
  setSortOrder,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
