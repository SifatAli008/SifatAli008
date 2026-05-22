"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Icon3DProps {
  icon: LucideIcon;
  label?: string;
  className?: string;
  boxClassName?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { box: "h-10 w-10", icon: "h-4 w-4" },
  md: { box: "h-12 w-12", icon: "h-5 w-5" },
  lg: { box: "h-14 w-14", icon: "h-6 w-6" },
};

export function Icon3D({
  icon: Icon,
  label,
  className,
  boxClassName,
  size = "md",
}: Icon3DProps) {
  return (
    <motion.div
      className={cn("inline-flex flex-col items-center gap-2", className)}
      whileHover={{ x: -2, y: -2 }}
      whileTap={{ x: 2, y: 2 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    >
      <div
        className={cn(
          "icon-3d-box flex items-center justify-center border-2 border-ink bg-cream",
          sizes[size].box,
          boxClassName
        )}
      >
        <Icon className={cn(sizes[size].icon, "text-ink")} strokeWidth={2.5} />
      </div>
      {label && <span className="label-mono text-muted">{label}</span>}
    </motion.div>
  );
}
