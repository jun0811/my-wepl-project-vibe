import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { Button } from "./button";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; onClick?: () => void; href?: string };
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <p className="text-neutral-600 font-medium">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-neutral-400">{description}</p>
      )}
      {action && (
        <div className="mt-4">
          {action.href ? (
            <Link href={action.href}>
              <Button variant="outline" size="sm">
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
