
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface GradientButtonProps extends React.ComponentProps<typeof Button> {
  gradientClassName?: string;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, gradientClassName, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "relative text-white overflow-hidden",
          "before:absolute before:inset-0 before:bg-gradient-primary before:animate-background-gradient",
          "hover:before:opacity-90 before:transition-opacity",
          "shadow-md hover:shadow-lg transition-shadow",
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </Button>
    );
  }
);

GradientButton.displayName = "GradientButton";

export default GradientButton;
