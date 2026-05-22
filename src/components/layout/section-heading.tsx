import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/motion/fade-in";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  label,
  title,
  description,
  className,
  align = "left",
}: SectionHeadingProps) {
  return (
    <FadeIn className={cn(align === "center" && "text-center", className)}>
      {label && (
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-accent-indigo">
          {label}
        </p>
      )}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-zinc-400",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </FadeIn>
  );
}
