
import { useState, useEffect } from "react";
import { SavingsGoal } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  addSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  getUserSavingsGoals,
} from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SavingsGoalForm from "@/components/savings/SavingsGoalForm";
import SavingsGoalCard from "@/components/savings/SavingsGoalCard";
import { useToast } from "@/components/ui/use-toast";

const SavingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | undefined>(undefined);
  
  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const fetchedGoals = await getUserSavingsGoals(user.uid);
        setGoals(fetchedGoals);
      } catch (error) {
        console.error("Error fetching savings goals:", error);
        toast({
          title: "Error",
          description: "Failed to load savings goals",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGoals();
  }, [user, toast]);
  
  const handleAddGoal = async (goal: Omit<SavingsGoal, "id" | "createdAt">) => {
    if (!user) return;
    
    try {
      const { id } = await addSavingsGoal(goal);
      
      // Add goal to the state with the new ID
      const newGoal: SavingsGoal = {
        ...goal,
        id,
        createdAt: new Date(),
      };
      
      setGoals(prev => [newGoal, ...prev]);
      setIsModalOpen(false);
      
      toast({
        title: "Success",
        description: "Savings goal added successfully",
      });
    } catch (error) {
      console.error("Error adding savings goal:", error);
      toast({
        title: "Error",
        description: "Failed to add savings goal",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdateGoal = async (goal: Omit<SavingsGoal, "id" | "createdAt">) => {
    if (!user || !selectedGoal) return;
    
    try {
      await updateSavingsGoal(selectedGoal.id, goal);
      
      // Update goal in the state
      setGoals(prev => 
        prev.map(g => 
          g.id === selectedGoal.id 
            ? { ...g, ...goal }
            : g
        )
      );
      
      setIsModalOpen(false);
      setSelectedGoal(undefined);
      
      toast({
        title: "Success",
        description: "Savings goal updated successfully",
      });
    } catch (error) {
      console.error("Error updating savings goal:", error);
      toast({
        title: "Error",
        description: "Failed to update savings goal",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteGoal = async (id: string) => {
    if (!user) return;
    
    if (!window.confirm("Are you sure you want to delete this savings goal?")) {
      return;
    }
    
    try {
      await deleteSavingsGoal(id);
      
      // Remove goal from the state
      setGoals(prev => prev.filter(g => g.id !== id));
      
      toast({
        title: "Success",
        description: "Savings goal deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting savings goal:", error);
      toast({
        title: "Error",
        description: "Failed to delete savings goal",
        variant: "destructive",
      });
    }
  };
  
  const handleEditGoal = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setIsModalOpen(true);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Savings Goals</h1>
          <p className="text-muted-foreground">
            Set and track your financial targets
          </p>
        </div>
        <Button 
          onClick={() => {
            setSelectedGoal(undefined);
            setIsModalOpen(true);
          }}
          className="mt-4 sm:mt-0 bg-finance-navy hover:bg-finance-navy/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Goal
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Loading savings goals...</div>
      ) : goals.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-white shadow-sm">
          <h3 className="text-xl font-medium mb-2">No savings goals yet</h3>
          <p className="text-muted-foreground mb-6">
            Start planning your financial future by adding your first goal
          </p>
          <Button 
            onClick={() => {
              setSelectedGoal(undefined);
              setIsModalOpen(true);
            }}
            className="bg-finance-navy hover:bg-finance-navy/90"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Your First Goal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <SavingsGoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
            />
          ))}
        </div>
      )}
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedGoal ? "Edit Savings Goal" : "Add Savings Goal"}
            </DialogTitle>
          </DialogHeader>
          <SavingsGoalForm
            onSubmit={selectedGoal ? handleUpdateGoal : handleAddGoal}
            onCancel={() => {
              setIsModalOpen(false);
              setSelectedGoal(undefined);
            }}
            initialData={selectedGoal}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavingsPage;
