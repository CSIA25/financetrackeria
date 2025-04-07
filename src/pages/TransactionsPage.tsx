
import { useState, useEffect } from "react";
import { Transaction, Category } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getUserTransactions,
  getUserCategories,
  addCategory,
} from "@/services/api";
import TransactionList from "@/components/transactions/TransactionList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Filter } from "lucide-react";
import TransactionForm from "@/components/transactions/TransactionForm";
import CategoryForm from "@/components/categories/CategoryForm";
import { useToast } from "@/components/ui/use-toast";

const TransactionsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);
  
  // Filter states
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
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
        setFilteredTransactions(fetchedTransactions);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, toast]);
  
  useEffect(() => {
    // Apply filters
    let result = [...transactions];
    
    // Filter by type
    if (filterType !== "all") {
      result = result.filter(t => t.type === filterType);
    }
    
    // Filter by category
    if (filterCategory !== "all") {
      result = result.filter(t => t.category === filterCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.description.toLowerCase().includes(query) || 
        t.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredTransactions(result);
  }, [transactions, filterType, filterCategory, searchQuery]);
  
  const handleAddTransaction = async (transaction: Omit<Transaction, "id" | "createdAt">) => {
    if (!user) return;
    
    try {
      const { id } = await addTransaction(transaction);
      
      // Add transaction to the state with the new ID
      const newTransaction: Transaction = {
        ...transaction,
        id,
        createdAt: new Date(),
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setIsTransactionModalOpen(false);
      setSelectedTransaction(undefined);
      
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateTransaction = async (transaction: Omit<Transaction, "id" | "createdAt">) => {
    if (!user || !selectedTransaction) return;
    
    try {
      await updateTransaction(selectedTransaction.id, transaction);
      
      // Update transaction in the state
      setTransactions(prev => 
        prev.map(t => 
          t.id === selectedTransaction.id 
            ? { ...t, ...transaction }
            : t
        )
      );
      
      setIsTransactionModalOpen(false);
      setSelectedTransaction(undefined);
      
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteTransaction = async (id: string) => {
    if (!user) return;
    
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }
    
    try {
      await deleteTransaction(id);
      
      // Remove transaction from the state
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
    }
  };
  
  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  };
  
  const handleAddCategory = async (category: Omit<Category, "id" | "createdAt">) => {
    if (!user) return;
    
    try {
      const { id } = await addCategory(category);
      
      // Add category to the state with the new ID
      const newCategory: Category = {
        ...category,
        id,
        createdAt: new Date(),
      };
      
      setCategories(prev => [...prev, newCategory]);
      setIsCategoryModalOpen(false);
      
      toast({
        title: "Success",
        description: "Category added successfully",
      });
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage your income and expenses
          </p>
        </div>
        <Button 
          onClick={() => {
            setSelectedTransaction(undefined);
            setIsTransactionModalOpen(true);
          }}
          className="mt-4 sm:mt-0 bg-finance-navy hover:bg-finance-navy/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/4">
          <Label htmlFor="search" className="text-sm">Search</Label>
          <Input
            id="search"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="w-full md:w-1/4">
          <Label htmlFor="type-filter" className="text-sm">Type</Label>
          <Select
            value={filterType}
            onValueChange={(value) => setFilterType(value as "all" | "income" | "expense")}
          >
            <SelectTrigger id="type-filter">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income Only</SelectItem>
              <SelectItem value="expense">Expenses Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/4">
          <Label htmlFor="category-filter" className="text-sm">Category</Label>
          <Select
            value={filterCategory}
            onValueChange={setFilterCategory}
          >
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/4 flex items-end">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              setFilterType("all");
              setFilterCategory("all");
              setSearchQuery("");
            }}
          >
            Reset Filters
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Loading transactions...</div>
      ) : (
        <TransactionList
          transactions={filteredTransactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      )}
      
      <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedTransaction ? "Edit Transaction" : "Add Transaction"}
            </DialogTitle>
          </DialogHeader>
          <TransactionForm
            onSubmit={selectedTransaction ? handleUpdateTransaction : handleAddTransaction}
            onCancel={() => {
              setIsTransactionModalOpen(false);
              setSelectedTransaction(undefined);
            }}
            initialData={selectedTransaction}
            categories={categories}
            onAddCategory={() => {
              setIsTransactionModalOpen(false);
              setIsCategoryModalOpen(true);
            }}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>
          <CategoryForm
            onSubmit={handleAddCategory}
            onCancel={() => {
              setIsCategoryModalOpen(false);
              if (selectedTransaction) {
                setIsTransactionModalOpen(true);
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionsPage;
