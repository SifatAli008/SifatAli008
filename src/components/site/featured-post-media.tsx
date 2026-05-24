import Image from "next/image";
import { Linkedin } from "lucide-react";
import type { FeaturedItem } from "@/lib/data/featured";

interface FeaturedPostMediaProps {
  item: FeaturedItem;
  index: number;
  compact?: boolean;
}

/** Static image or lightweight brutalist card — no third-party iframes */
export function FeaturedPostMedia({
  item,
  index,
  compact = false,
}: FeaturedPostMediaProps) {
  if (item.image) {
    return (
      <div className="relative aspect-[4/3] w-full bg-ink">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 33vw, 400px"
          loading={index > 0 ? "lazy" : undefined}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex aspect-[4/3] w-full flex-col justify-between p-5 ${
        item.accent ? "bg-accent/10" : "bg-cream"
      }`}
      aria-hidden
    >
      <div className="flex items-center justify-between">
        <Linkedin className="h-5 w-5 text-[#0A66C2]" aria-hidden />
        <span className="label-mono text-[9px] text-muted">LINKEDIN</span>
      </div>
      <div className="space-y-2">
        {item.badge ? (
          <span className="label-mono inline-block border-2 border-ink bg-accent px-2 py-0.5 text-[9px] font-bold text-cream">
            {item.badge}
          </span>
        ) : null}
        <p
          className={`font-sans font-bold leading-tight text-ink ${
            compact ? "line-clamp-3 text-sm" : "line-clamp-4 text-base md:text-lg"
          }`}
        >
          {item.title}
        </p>
        <p className="label-mono line-clamp-2 text-[9px] text-muted">
          {item.subtitle}
        </p>
      </div>
      <p className="label-mono text-[9px] text-muted">VIEW ON LINKEDIN ↗</p>
    </div>
  );
}
