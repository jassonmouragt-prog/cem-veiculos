import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/db/store";

interface FinancialMetricCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  badgeColor?: "blue" | "green" | "amber" | "red" | "purple" | "emerald";
  trend?: { value: number; positive: boolean };
}

export function FinancialMetricCard({
  title,
  value,
  description,
  icon: Icon,
  badgeColor = "blue",
  trend,
}: FinancialMetricCardProps) {
  const displayValue = typeof value === "number" ? formatCurrency(value) : value;

  const badgeColors = {
    blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    red: "bg-red-500/15 text-red-400 border-red-500/30",
    purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  };

  return (
    <Card className="bg-[#121212] border-white/5 shadow-md rounded-2xl hover:border-white/10 transition-all">
      <CardContent className="pt-5 pb-5 px-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider truncate">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-white mt-1 truncate">
              {displayValue}
            </p>
            {description && (
              <p className="text-[11px] text-gray-500 mt-1 truncate">{description}</p>
            )}
          </div>
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${badgeColors[badgeColor]}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>

        {trend && (
          <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
            <span
              className={`text-xs font-semibold ${
                trend.positive ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {trend.positive ? "+" : ""}{trend.value.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-400">vs mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}