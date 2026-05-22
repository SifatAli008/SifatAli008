import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";

export function ContactCta() {
  return (
    <section className="section-gap border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn className="glass-strong glow-border rounded-3xl p-12 text-center md:p-16">
          <SectionHeading
            align="center"
            title="Let's build something remarkable"
            description="Open to AI engineering, full-stack roles, research collaborations, and startup partnerships."
          />
          <Button asChild size="lg" className="mt-8">
            <Link href="/contact">
              Start a conversation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
