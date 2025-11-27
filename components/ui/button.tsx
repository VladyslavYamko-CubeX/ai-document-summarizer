import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[calc(var(--radius)+0.1rem)] text-sm font-semibold tracking-tight transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 ring-offset-background shadow-[0_12px_30px_rgba(15,23,42,0.08)]",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(120deg,hsl(var(--primary))_0%,hsl(var(--accent))_100%)] text-primary-foreground shadow-[0_18px_38px_rgba(86,63,255,0.35)] hover:-translate-y-0.5 hover:shadow-[0_24px_46px_rgba(86,63,255,0.45)] active:translate-y-0",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_12px_28px_rgba(255,82,82,0.35)]",
        outline:
          "border border-border/70 bg-surface text-foreground hover:bg-secondary hover:text-foreground shadow-none",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "bg-transparent text-foreground hover:bg-secondary/70 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 rounded-[calc(var(--radius)-4px)] px-3 text-sm",
        lg: "h-12 rounded-[calc(var(--radius)+0.15rem)] px-8 text-base",
        icon: "h-11 w-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
