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
      "relative w-full rounded-lg border border-border bg-card px-4 py-3 text-sm text-card-foreground",
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
  <h5 ref={ref} className={cn("mb-1 font-semibold leading-none", className)} {...props} />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm leading-relaxed text-muted-foreground", className)}
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
