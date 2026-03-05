import { cn } from "@/shared/lib/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: "sm" | "md" | "lg";
}

export function Card({ children, className, padding = "md", ...props }: CardProps) {
  const paddings = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={cn(
        "rounded-2xl bg-white border border-neutral-100 shadow-sm",
        paddings[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
