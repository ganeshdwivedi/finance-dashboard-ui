import type { Transaction } from '../store/slices/transactionsSlice';

/**
 * Converts an array of transactions to a CSV string.
 */
export const transactionsToCSV = (transactions: Transaction[]): string => {
  const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
  const rows = transactions.map((t) => [
    t.date,
    `"${t.description.replace(/"/g, '""')}"`,
    t.category,
    t.amount,
    t.type,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};

/**
 * Triggers a browser download for a given string content.
 */
export const downloadFile = (content: string, fileName: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exports transactions to CSV.
 */
export const exportToCSV = (transactions: Transaction[]) => {
  const csv = transactionsToCSV(transactions);
  downloadFile(csv, `transactions_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv;charset=utf-8;');
};

/**
 * Exports transactions to JSON.
 */
export const exportToJSON = (transactions: Transaction[]) => {
  const json = JSON.stringify(transactions, null, 2);
  downloadFile(json, `transactions_${new Date().toISOString().split('T')[0]}.json`, 'application/json;charset=utf-8;');
};
