import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: string;
  badgeColor?: "red" | "green" | "blue" | "amber" | "gray";
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  badgeColor = "red",
}: MetricCardProps) {
  const colorMap = {
    red: "bg-[#E8231F]/15 text-[#E8231F] border-[#E8231F]/30",
    green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    blue: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    gray: "bg-zinc-800 text-zinc-300 border-zinc-700",
  };

  return (
    <Card className="bg-[#121212] border-white/5 shadow-md hover:border-white/10 transition-all rounded-xl">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-400">{title}</p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</h3>
          </div>
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${colorMap[badgeColor]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {(description || trend) && (
          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-white/5 text-xs text-gray-400">
            {trend && <span className="font-semibold text-emerald-400">{trend}</span>}
            {description && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
