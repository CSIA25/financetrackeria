
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Category, Transaction } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { getRandomColor } from "@/lib/utils";
import { useEffect, useState } from "react";

interface SpendingChartProps {
  transactions: Transaction[];
  categories: Category[];
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const SpendingChart = ({ transactions, categories }: SpendingChartProps) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const expenseTransactions = transactions.filter(
      (transaction) => transaction.type === "expense"
    );

    const categoryTotals: Record<string, number> = {};

    // Calculate totals for each category
    expenseTransactions.forEach((transaction) => {
      if (categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] += transaction.amount;
      } else {
        categoryTotals[transaction.category] = transaction.amount;
      }
    });

    // Convert to array format required by chart
    const data = Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount,
      color: getRandomColor(),
    }));

    setChartData(data);
  }, [transactions, categories]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>
            How your expenses are distributed
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">
            No expense data available yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>
          How your expenses are distributed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingChart;
