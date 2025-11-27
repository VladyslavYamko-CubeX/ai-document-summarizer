import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-[calc(var(--radius)-2px)] border border-[hsl(var(--field-border))] bg-[hsl(var(--field-background))] px-4 py-2 text-[var(--text-base)] text-[hsl(var(--field-foreground))] shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition-all placeholder:text-muted-foreground/70 focus-visible:border-primary/60 focus-visible:bg-[hsl(var(--surface))] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
