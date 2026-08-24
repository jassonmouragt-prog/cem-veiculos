import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/auth-service";

interface AdminHeaderProps {
  title: string;
  description?: string;
  onOpenMobileMenu?: () => void;
  actions?: React.ReactNode;
}

export function AdminHeader({
  title,
  description,
  onOpenMobileMenu,
  actions,
}: AdminHeaderProps) {
  const user = getCurrentUser();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 min-w-0">
        {onOpenMobileMenu && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenMobileMenu}
            className="lg:hidden h-9 w-9 text-gray-400 hover:text-white rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}
        <div className="flex flex-col min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
            {title}
          </h1>
          {description && (
            <p className="text-xs text-gray-400 hidden sm:block truncate">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {actions}
        <div className="hidden md:flex items-center gap-2 pl-3 border-l border-white/10 text-xs text-gray-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{user?.name || "Admin"}</span>
        </div>
      </div>
    </header>
  );
}
