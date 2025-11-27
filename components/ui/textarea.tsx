import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-[calc(var(--radius)-2px)] border border-[hsl(var(--field-border))] bg-[hsl(var(--field-background))] px-4 py-3 text-[var(--text-base)] leading-relaxed text-[hsl(var(--field-foreground))] shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition-all placeholder:text-muted-foreground/70 focus-visible:border-primary/60 focus-visible:bg-[hsl(var(--surface))] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
