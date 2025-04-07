
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date | string;
  type: 'income' | 'expense';
  userId: string;
  createdAt: Date | string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  userId: string;
  createdAt: Date | string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | string;
  userId: string;
  createdAt: Date | string;
}

export type PeriodType = 'week' | 'month' | 'year';

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsProgress: {
    current: number;
    target: number;
    percentage: number;
  };
  categoryBreakdown: {
    [category: string]: number;
  };
}
