
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SavingsGoal } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SavingsGoalFormProps {
  onSubmit: (goal: Omit<SavingsGoal, "id" | "createdAt">) => Promise<void>;
  onCancel: () => void;
  initialData?: SavingsGoal;
}

const SavingsGoalForm = ({
  onSubmit,
  onCancel,
  initialData,
}: SavingsGoalFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  
  // Set initial form data if provided
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setTargetAmount(initialData.targetAmount.toString());
      setCurrentAmount(initialData.currentAmount.toString());
      setDeadline(
        typeof initialData.deadline === "string"
          ? new Date(initialData.deadline)
          : initialData.deadline
      );
    }
  }, [initialData]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a savings goal",
        variant: "destructive",
      });
      return;
    }
    
    if (!name || !targetAmount || !currentAmount || !deadline) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    const parsedTargetAmount = parseFloat(targetAmount);
    const parsedCurrentAmount = parseFloat(currentAmount);
    
    if (isNaN(parsedTargetAmount) || parsedTargetAmount <= 0) {
      toast({
        title: "Error",
        description: "Target amount must be a positive number",
        variant: "destructive",
      });
      return;
    }
    
    if (isNaN(parsedCurrentAmount) || parsedCurrentAmount < 0) {
      toast({
        title: "Error",
        description: "Current amount must be a non-negative number",
        variant: "destructive",
      });
      return;
    }
    
    if (parsedCurrentAmount > parsedTargetAmount) {
      toast({
        title: "Error",
        description: "Current amount cannot exceed target amount",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await onSubmit({
        name,
        targetAmount: parsedTargetAmount,
        currentAmount: parsedCurrentAmount,
        deadline,
        userId: user.uid,
      });
      
      toast({
        title: initialData ? "Goal updated" : "Goal created",
        description: initialData 
          ? "Your savings goal has been updated successfully" 
          : "Your savings goal has been created successfully",
      });
      
      // Reset form
      if (!initialData) {
        setName("");
        setTargetAmount("");
        setCurrentAmount("");
        setDeadline(undefined);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save the goal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Goal Name</Label>
        <Input
          id="name"
          placeholder="e.g., New Car, Emergency Fund"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="targetAmount">Target Amount (₹)</Label>
        <Input
          id="targetAmount"
          type="number"
          min="1"
          step="any"
          placeholder="e.g., 50000"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="currentAmount">Current Amount (₹)</Label>
        <Input
          id="currentAmount"
          type="number"
          min="0"
          step="any"
          placeholder="e.g., 10000"
          value={currentAmount}
          onChange={(e) => setCurrentAmount(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="deadline">Target Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
              disabled={isLoading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {deadline ? format(deadline, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={deadline}
              onSelect={setDeadline as (date: Date | undefined) => void}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {targetAmount && currentAmount && (
        <div className="text-sm text-muted-foreground">
          {parseFloat(currentAmount) > 0 && parseFloat(targetAmount) > 0 && (
            <p>
              Progress:{" "}
              {Math.round((parseFloat(currentAmount) / parseFloat(targetAmount)) * 100)}%
            </p>
          )}
          {parseFloat(targetAmount) > parseFloat(currentAmount) && (
            <p>
              Remaining:{" "}
              {formatCurrency(parseFloat(targetAmount) - parseFloat(currentAmount))}
            </p>
          )}
        </div>
      )}
      
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
            ? "Update Goal"
            : "Create Goal"}
        </Button>
      </div>
    </form>
  );
};

export default SavingsGoalForm;
