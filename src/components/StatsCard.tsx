import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "primary" | "accent" | "destructive";
}

const StatsCard = ({ title, value, subtitle, icon: Icon, variant = "default" }: StatsCardProps) => {
  const variantStyles = {
    default: "bg-card",
    primary: "bg-primary/10 border-primary/20",
    accent: "bg-accent/10 border-accent/20",
    destructive: "bg-destructive/10 border-destructive/20",
  };

  const iconStyles = {
    default: "text-muted-foreground",
    primary: "text-primary",
    accent: "text-accent",
    destructive: "text-destructive",
  };

  return (
    <Card className={`${variantStyles[variant]} transition-all hover:scale-[1.02] active:scale-[0.98]`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 md:px-6 pt-3 md:pt-6">
        <CardTitle className="text-xs md:text-sm font-medium text-card-foreground line-clamp-2">{title}</CardTitle>
        <Icon className={`h-4 w-4 flex-shrink-0 ${iconStyles[variant]}`} />
      </CardHeader>
      <CardContent className="px-3 md:px-6 pb-3 md:pb-6">
        <div className="text-xl md:text-2xl font-bold text-card-foreground truncate">{value}</div>
        {subtitle && (
          <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-1 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
