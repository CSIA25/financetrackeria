
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Category, SavingsGoal, Transaction } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getUserTransactions, getUserCategories, getUserSavingsGoals } from "@/services/api";
import { formatCurrency } from "@/lib/utils";
import StatCard from "@/components/dashboard/StatCard";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import SpendingChart from "@/components/dashboard/SpendingChart";
import { ArrowUpCircle, ArrowDownCircle, Wallet, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        const [fetchedTransactions, fetchedCategories, fetchedSavingsGoals] = await Promise.all([
          getUserTransactions(user.uid),
          getUserCategories(user.uid),
          getUserSavingsGoals(user.uid),
        ]);

        setTransactions(fetchedTransactions);
        setCategories(fetchedCategories);
        setSavingsGoals(fetchedSavingsGoals);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Calculate total income, expenses, and savings
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const netIncome = totalIncome - totalExpenses;

  const totalSavingsTarget = savingsGoals.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0
  );

  const totalCurrentSavings = savingsGoals.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0
  );

  const savingsProgress = totalSavingsTarget > 0
    ? Math.round((totalCurrentSavings / totalSavingsTarget) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'User'}
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button onClick={() => navigate('/transactions')} className="bg-finance-navy hover:bg-finance-navy/90">
            Add Transaction
          </Button>
          <Button variant="outline" onClick={() => navigate('/reports')}>
            View Reports
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={ArrowUpCircle}
          className="border-l-4 border-finance-emerald"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon={ArrowDownCircle}
          className="border-l-4 border-destructive"
        />
        <StatCard
          title="Net Income"
          value={formatCurrency(netIncome)}
          icon={Wallet}
          className={`border-l-4 ${
            netIncome >= 0 ? "border-finance-emerald" : "border-destructive"
          }`}
        />
        <StatCard
          title="Savings Progress"
          value={`${savingsProgress}%`}
          description={`${formatCurrency(totalCurrentSavings)} of ${formatCurrency(totalSavingsTarget)}`}
          icon={PiggyBank}
          className="border-l-4 border-finance-amber"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <RecentTransactions transactions={transactions} />
        <SpendingChart transactions={transactions} categories={categories} />
      </div>

      {(transactions.length === 0 || categories.length === 0 || savingsGoals.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Complete these steps to set up your financial dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.length === 0 && (
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Create Categories</h3>
                  <p className="text-sm text-muted-foreground">
                    Set up expense and income categories
                  </p>
                </div>
                <Button onClick={() => navigate('/categories')} variant="outline">
                  Add Categories
                </Button>
              </div>
            )}

            {transactions.length === 0 && (
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Record Transactions</h3>
                  <p className="text-sm text-muted-foreground">
                    Start tracking your income and expenses
                  </p>
                </div>
                <Button onClick={() => navigate('/transactions')} variant="outline">
                  Add Transactions
                </Button>
              </div>
            )}

            {savingsGoals.length === 0 && (
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Set Savings Goals</h3>
                  <p className="text-sm text-muted-foreground">
                    Define and track your financial goals
                  </p>
                </div>
                <Button onClick={() => navigate('/savings')} variant="outline">
                  Add Goals
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;
