
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  trend?: number;
  className?: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) => {
  return (
    <Card className={cn("shadow-sm animate-enter", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend !== undefined && (
          <div
            className={cn(
              "mt-1 text-xs flex items-center",
              trend > 0
                ? "text-finance-emerald"
                : trend < 0
                ? "text-destructive"
                : "text-muted-foreground"
            )}
          >
            {trend > 0 ? "↑" : trend < 0 ? "↓" : "→"} {Math.abs(trend)}%{" "}
            {trend > 0 ? "increase" : trend < 0 ? "decrease" : "no change"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
