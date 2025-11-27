import * as React from "react";
import { AlertCircle, Info } from "lucide-react";

import { cn } from "@/lib/utils";

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      "relative w-full rounded-[calc(var(--radius)-2px)] border border-border/70 bg-surface px-5 py-4 text-sm text-card-foreground shadow-[0_16px_40px_rgba(15,23,42,0.08)]",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight text-foreground", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm leading-relaxed text-muted-foreground/90", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export const AlertIcon: React.FC<{ variant?: "info" | "error" }> = ({ variant }) => {
  if (variant === "error") {
    return <AlertCircle className="mr-2 h-4 w-4 text-destructive" />;
  }
  return <Info className="mr-2 h-4 w-4 text-primary" />;
};

export { Alert, AlertDescription, AlertTitle };
