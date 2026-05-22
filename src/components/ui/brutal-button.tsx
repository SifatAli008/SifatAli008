"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const MotionLink = motion(Link);
const MotionA = motion.a;

type Variant = "primary" | "outline" | "accent" | "cream-outline";

interface BrutalButtonProps {
  children: React.ReactNode;
  variant?: Variant;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  href?: string;
  external?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  download?: boolean;
  darkShadow?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: "bg-ink text-cream border-2 border-ink",
  outline: "bg-cream text-ink border-2 border-ink",
  accent: "bg-accent text-cream border-2 border-ink",
  "cream-outline": "bg-transparent text-cream border-2 border-cream",
};

const motionProps = {
  whileHover: { x: -3, y: -3 },
  whileTap: { x: 4, y: 4 },
  transition: { type: "spring" as const, stiffness: 500, damping: 28 },
};

export function BrutalButton({
  children,
  variant = "primary",
  icon: Icon,
  iconPosition = "right",
  href,
  external,
  type = "button",
  disabled,
  className,
  onClick,
  download,
  darkShadow,
}: BrutalButtonProps) {
  const classes = cn(
    "btn-3d inline-flex items-center justify-center gap-2.5 font-sans text-xs font-semibold uppercase tracking-[0.1em]",
    variantStyles[variant],
    darkShadow && "btn-3d-on-dark",
    disabled && "pointer-events-none opacity-50",
    className
  );

  const content = (
    <>
      {Icon && iconPosition === "left" && (
        <Icon className="h-4 w-4 shrink-0 icon-animate" strokeWidth={2.5} aria-hidden />
      )}
      <span>{children}</span>
      {Icon && iconPosition === "right" && (
        <Icon className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
      )}
    </>
  );

  if (href) {
    if (external || download) {
      return (
        <MotionA
          href={href}
          download={download}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className={classes}
          onClick={onClick}
          {...motionProps}
        >
          {content}
        </MotionA>
      );
    }
    return (
      <MotionLink href={href} className={classes} onClick={onClick} {...motionProps}>
        {content}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
      {...motionProps}
    >
      {content}
    </motion.button>
  );
}
