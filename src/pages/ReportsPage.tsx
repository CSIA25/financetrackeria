
import { useState, useEffect } from "react";
import { Transaction, Category } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getUserTransactions, getUserCategories } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import ReportGenerator from "@/components/reports/ReportGenerator";

const ReportsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const [fetchedTransactions, fetchedCategories] = await Promise.all([
          getUserTransactions(user.uid),
          getUserCategories(user.uid),
        ]);
        
        setTransactions(fetchedTransactions);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching data for reports:", error);
        toast({
          title: "Error",
          description: "Failed to load data for reports",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, toast]);
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Analyze your financial performance
        </p>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Loading data...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-white shadow-sm">
          <h3 className="text-xl font-medium mb-2">No transaction data available</h3>
          <p className="text-muted-foreground">
            Add some transactions to generate financial reports
          </p>
        </div>
      ) : (
        <ReportGenerator transactions={transactions} />
      )}
    </div>
  );
};

export default ReportsPage;
