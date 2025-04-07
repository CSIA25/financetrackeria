import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Transaction, Category } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, "id" | "createdAt">) => Promise<void>;
  onCancel: () => void;
  initialData?: Transaction;
  categories: Category[];
  onAddCategory: () => void;
}

const TransactionForm = ({
  onSubmit,
  onCancel,
  initialData,
  categories,
  onAddCategory,
}: TransactionFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Set initial form data if provided
  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount.toString());
      setDescription(initialData.description);
      setCategory(initialData.category);
      setType(initialData.type);
      setDate(
        typeof initialData.date === "string"
          ? new Date(initialData.date)
          : initialData.date
      );
    }
  }, [initialData]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a transaction",
        variant: "destructive",
      });
      return;
    }
    
    if (!amount || !description || !category || !date) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    const parsedAmount = parseFloat(amount);
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Error",
        description: "Amount must be a positive number",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await onSubmit({
        amount: parsedAmount,
        description,
        category,
        type,
        date,
        userId: user.uid,
      });
      
      toast({
        title: initialData ? "Transaction updated" : "Transaction added",
        description: initialData 
          ? "Your transaction has been updated successfully" 
          : "Your transaction has been added successfully",
      });
      
      // Reset form if not editing
      if (!initialData) {
        setAmount("");
        setDescription("");
        // Keep the same category and type for convenience
        setDate(new Date());
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save the transaction",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter categories based on selected transaction type
  const filteredCategories = categories.filter(
    (cat) => cat.type === type
  );
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Transaction Type</Label>
        <Select
          value={type}
          onValueChange={(value) => {
            setType(value as "income" | "expense");
            setCategory(""); // Reset category when type changes
          }}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (₹)</Label>
        <Input
          id="amount"
          type="number"
          min="0.01"
          step="any"
          placeholder="e.g., 1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="category">Category</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground"
            onClick={onAddCategory}
          >
            <Plus className="h-4 w-4 mr-1" /> Add New
          </Button>
        </div>
        <Select
          value={category}
          onValueChange={setCategory}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="" disabled>
                No categories available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="What was this transaction for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
              disabled={isLoading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate as (date: Date | undefined) => void}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-finance-navy hover:bg-finance-navy/90"
        >
          {isLoading
            ? initialData
              ? "Updating..."
              : "Creating..."
            : initialData
            ? "Update Transaction"
            : "Add Transaction"}
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm;
