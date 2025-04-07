
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Transaction, PeriodType } from "@/types";
import { filterTransactionsByPeriod, formatCurrency, getPeriodLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Download, FileText } from "lucide-react";
import { getRandomColor } from "@/lib/utils";

interface ReportGeneratorProps {
  transactions: Transaction[];
}

const ReportGenerator = ({ transactions }: ReportGeneratorProps) => {
  const [period, setPeriod] = useState<PeriodType>("month");
  
  const filteredTransactions = filterTransactionsByPeriod(transactions, period);
  
  // Calculate summary
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const netIncome = totalIncome - totalExpenses;
  
  // Prepare data for income/expense chart
  const summaryChartData = [
    { name: "Income", amount: totalIncome },
    { name: "Expenses", amount: totalExpenses },
    { name: "Net", amount: netIncome },
  ];
  
  // Prepare data for category breakdown chart
  const categoryBreakdown: Record<string, number> = {};
  
  filteredTransactions
    .filter((t) => t.type === "expense")
    .forEach((transaction) => {
      if (categoryBreakdown[transaction.category]) {
        categoryBreakdown[transaction.category] += transaction.amount;
      } else {
        categoryBreakdown[transaction.category] = transaction.amount;
      }
    });
  
  const categoryChartData = Object.entries(categoryBreakdown).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
      color: getRandomColor(),
    })
  );
  
  // Function to generate and download PDF report
  const downloadReport = () => {
    // This would normally connect to a PDF generation library
    // For now, we'll just show a toast message
    alert("This would download a PDF report in a real application.");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Financial Report</h2>
          <p className="text-muted-foreground">
            {getPeriodLabel(period)} Summary
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={period} onValueChange={(value) => setPeriod(value as PeriodType)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={downloadReport}
            className="bg-finance-navy hover:bg-finance-navy/90"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>
      
      {filteredTransactions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Data Available</CardTitle>
            <CardDescription>
              There are no transactions for the selected period.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center space-y-3">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto" />
              <p>Add some transactions to generate a report</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Income</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-finance-emerald">
                  {formatCurrency(totalIncome)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-destructive">
                  {formatCurrency(totalExpenses)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Net Income</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${
                  netIncome >= 0 ? "text-finance-emerald" : "text-destructive"
                }`}>
                  {formatCurrency(netIncome)}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>
                  Comparison of your income and expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={summaryChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [
                          `₹${value.toLocaleString()}`,
                          "Amount",
                        ]}
                      />
                      <Legend />
                      <Bar
                        dataKey="amount"
                        fill="#1E3A8A"
                        name="Amount"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {categoryChartData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Expenses by Category</CardTitle>
                  <CardDescription>
                    Breakdown of your expenses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryChartData}
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
                          {categoryChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [
                            `₹${value.toLocaleString()}`,
                            "Amount",
                          ]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportGenerator;
