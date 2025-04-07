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
import { Category } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface CategoryFormProps {
  onSubmit: (category: Omit<Category, "id" | "createdAt">) => Promise<void>;
  onCancel: () => void;
  initialData?: Category;
}

const CategoryForm = ({
  onSubmit,
  onCancel,
  initialData,
}: CategoryFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  
  // Set initial form data if provided
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setType(initialData.type);
    }
  }, [initialData]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a category",
        variant: "destructive",
      });
      return;
    }
    
    if (!name) {
      toast({
        title: "Error",
        description: "Please enter a category name",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await onSubmit({
        name,
        type,
        userId: user.uid,
      });
      
      toast({
        title: initialData ? "Category updated" : "Category created",
        description: initialData 
          ? "Your category has been updated successfully" 
          : "Your category has been created successfully",
      });
      
      // Reset form
      if (!initialData) {
        setName("");
        // Keep the same type for convenience
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save the category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          placeholder="e.g., Groceries, Salary"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Category Type</Label>
        <Select
          value={type}
          onValueChange={(value) => setType(value as "income" | "expense")}
          disabled={isLoading || !!initialData} // Disable if editing
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        {initialData && (
          <p className="text-sm text-muted-foreground mt-1">
            Note: Category type cannot be changed after creation.
          </p>
        )}
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
            ? "Update Category"
            : "Create Category"}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
