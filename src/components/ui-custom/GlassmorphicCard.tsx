
import React from "react";
import { cn } from "@/lib/utils";

interface GlassmorphicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  intensity?: "low" | "medium" | "high";
}

const GlassmorphicCard = ({
  className,
  children,
  intensity = "medium",
  ...props
}: GlassmorphicCardProps) => {
  const intensityClasses = {
    low: "bg-white/5 backdrop-blur-sm border-white/10",
    medium: "bg-white/10 backdrop-blur-md border-white/20",
    high: "bg-white/20 backdrop-blur-lg border-white/30",
  };

  return (
    <div
      className={cn(
        "rounded-xl shadow-glass p-6",
        intensityClasses[intensity],
        "dark:bg-black/20 dark:border-white/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassmorphicCard;
