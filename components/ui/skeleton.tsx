import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[calc(var(--radius)-4px)] bg-gradient-to-r from-muted via-muted/70 to-muted",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
