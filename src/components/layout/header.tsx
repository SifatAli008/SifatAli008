"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#featured", label: "Featured" },
  { href: "/#research", label: "Research" },
  { href: "/#faq", label: "FAQ" },
  { href: "/projects", label: "Projects" },
  { href: "/#github", label: "GitHub" },
  { href: "/blog", label: "Writing" },
  { href: "/contact", label: "Contact" },
];

function useDhakaClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(now);
      setTime(formatted.toUpperCase());
    };
    format();
    const id = window.setInterval(format, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return time;
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dhakaTime = useDhakaClock();

  const isActive = (href: string) =>
    pathname === href ||
    (href === "/projects" && pathname.startsWith("/projects")) ||
    (href === "/blog" && pathname.startsWith("/blog")) ||
    (href === "/contact" && pathname.startsWith("/contact"));

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur-md">
        <div className="site-container relative flex h-[4.25rem] items-center justify-between gap-4">
          <Link
            href="/"
            className="relative z-10 shrink-0 font-display text-[1.15rem] font-bold tracking-[0.08em] text-ink transition-colors hover:text-accent"
          >
            SIFAT ALI
          </Link>

          <nav
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 lg:flex xl:gap-8"
            aria-label="Primary"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-active={isActive(link.href) ? "true" : undefined}
                className={cn(
                  "nav-link-cover font-sans text-[14px] font-semibold tracking-[-0.01em] text-ink",
                  isActive(link.href) && "text-ink"
                )}
              >
                <span className="nav-link-cover-mask">
                  <span className="nav-link-cover-track">
                    <span>{link.label}</span>
                    <span aria-hidden className="text-accent">
                      {link.label}
                    </span>
                  </span>
                </span>
              </Link>
            ))}
          </nav>

          <div className="relative z-10 hidden items-center gap-5 lg:flex">
            <div className="min-w-[4.5rem] text-right leading-tight">
              <p className="font-sans text-[12px] font-semibold tracking-wide text-ink">
                {dhakaTime || "—"}{" "}
                <span className="text-ink/45">DHK</span>
              </p>
              <p className="font-sans text-[11px] text-ink/40">GMT+6</p>
            </div>

            <Link
              href="/contact"
              className="group inline-flex items-center gap-1.5 font-sans text-[14px] font-semibold text-ink"
            >
              <span className="nav-link-cover">
                <span className="nav-link-cover-mask">
                  <span className="nav-link-cover-track">
                    <span>Collaborate</span>
                    <span aria-hidden className="text-accent">
                      Collaborate
                    </span>
                  </span>
                </span>
              </span>
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                strokeWidth={2.25}
              />
            </Link>
          </div>

          <button
            type="button"
            className="relative z-10 flex h-10 w-10 items-center justify-center text-ink lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-cream lg:hidden">
          <div className="site-container flex h-[4.25rem] items-center justify-between border-b border-ink/10">
            <span className="font-display text-[1.15rem] font-bold tracking-[0.08em] text-ink">
              SIFAT ALI
            </span>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center text-ink"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>

          <nav
            className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 py-8"
            aria-label="Mobile"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "border-b border-ink/8 py-4 font-sans text-2xl font-medium text-ink/70 transition-colors hover:text-ink",
                  isActive(link.href) && "text-ink"
                )}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="mt-8 flex items-center justify-between gap-4">
              <div className="leading-tight">
                <p className="font-sans text-sm font-semibold text-ink">
                  {dhakaTime || "—"}{" "}
                  <span className="text-ink/45">DHK</span>
                </p>
                <p className="font-sans text-xs text-ink/40">GMT+6</p>
              </div>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 font-sans text-base font-semibold text-ink hover:text-accent"
              >
                Collaborate
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
