
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SavingsGoal } from "@/types";
import { calculatePercentage, formatCurrency, formatDate } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onEdit: (goal: SavingsGoal) => void;
  onDelete: (id: string) => void;
}

const SavingsGoalCard = ({ goal, onEdit, onDelete }: SavingsGoalCardProps) => {
  const progressPercentage = calculatePercentage(
    goal.currentAmount,
    goal.targetAmount
  );

  // Format the date
  const deadlineDate = typeof goal.deadline === 'string' 
    ? new Date(goal.deadline) 
    : goal.deadline;

  const isDeadlinePassed = deadlineDate < new Date();

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow animate-enter">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{goal.name}</span>
          <span
            className={
              progressPercentage >= 100
                ? "text-finance-emerald"
                : isDeadlinePassed && progressPercentage < 100
                ? "text-destructive"
                : "text-finance-amber"
            }
          >
            {progressPercentage}%
          </span>
        </CardTitle>
        <CardDescription>
          Target: {formatCurrency(goal.targetAmount)} | Deadline:{" "}
          {formatDate(goal.deadline)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Current: {formatCurrency(goal.currentAmount)}</span>
            <span>
              Remaining:{" "}
              {formatCurrency(Math.max(goal.targetAmount - goal.currentAmount, 0))}
            </span>
          </div>
          <Progress value={progressPercentage} max={100} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="text-muted-foreground"
          onClick={() => onDelete(goal.id)}
        >
          <Trash className="h-4 w-4 mr-1" />
          Delete
        </Button>
        <Button
          variant="default"
          size="sm"
          className="bg-finance-navy hover:bg-finance-navy/90"
          onClick={() => onEdit(goal)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SavingsGoalCard;
