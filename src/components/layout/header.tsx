"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  User,
  FolderKanban,
  PenLine,
  Mail,
  ArrowRight,
  Menu,
  X,
  BarChart3,
  FlaskConical,
  Github,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrutalButton } from "@/components/ui/brutal-button";

const links = [
  { href: "/#about", label: "ABOUT", icon: User },
  { href: "/#featured", label: "FEATURED", icon: BarChart3 },
  { href: "/#research", label: "RESEARCH", icon: FlaskConical },
  { href: "/projects", label: "PROJECTS", icon: FolderKanban },
  { href: "/#github", label: "GITHUB", icon: Github },
  { href: "/blog", label: "WRITING", icon: PenLine },
  { href: "/contact", label: "CONTACT", icon: Mail },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-ink">
        <div className="site-container flex h-16 items-center justify-between">
          <Link
            href="/"
            className="group flex items-center gap-2 font-display text-[22px] tracking-[0.1em] text-cream"
          >
            <span className="icon-3d-box flex h-8 w-8 items-center justify-center border-2 border-cream bg-accent transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
              <span className="font-display text-sm text-cream">SA</span>
            </span>
            SIFAT ALI
          </Link>

          <nav className="hidden items-center md:flex" aria-label="Primary">
            {links.map((link, i) => {
              const Icon = link.icon;
              return (
                <span key={link.href} className="flex items-center">
                  {i > 0 && (
                    <span className="mx-3 text-cream/40" aria-hidden>
                      |
                    </span>
                  )}
                  <Link
                    href={link.href}
                    className={cn(
                      "nav-link-underline label-mono flex items-center gap-1.5 text-cream",
                      (pathname === link.href ||
                        (link.href === "/projects" && pathname.startsWith("/projects"))) &&
                        "text-accent"
                    )}
                  >
                    <Icon className="h-3 w-3" strokeWidth={2.5} />
                    {link.label}
                  </Link>
                </span>
              );
            })}
            <span className="mx-4 text-cream/40">|</span>
            <BrutalButton
              href="/contact"
              variant="cream-outline"
              icon={ArrowRight}
              className="btn-3d-on-dark !px-4 !py-2 text-[11px]"
            >
              COLLABORATE
            </BrutalButton>
          </nav>

          <button
            type="button"
            className="icon-3d-box flex h-10 w-10 items-center justify-center border-2 border-cream bg-ink md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-cream" strokeWidth={2.5} />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-ink">
          <div className="site-container flex h-16 items-center justify-between border-b border-cream/20">
            <span className="font-display text-[22px] tracking-[0.1em] text-cream">
              SIFAT ALI
            </span>
            <button
              type="button"
              className="icon-3d-box flex h-10 w-10 items-center justify-center border-2 border-cream"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-cream" strokeWidth={2.5} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-6 px-6" aria-label="Mobile">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-4 font-display text-[64px] leading-none text-cream transition-colors duration-0 hover:text-accent"
                  onClick={() => setOpen(false)}
                >
                  <Icon
                    className="h-10 w-10 shrink-0 opacity-40 group-hover:opacity-100 group-hover:text-accent"
                    strokeWidth={1.5}
                  />
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-8" onClick={() => setOpen(false)}>
              <BrutalButton
                href="/contact"
                variant="accent"
                icon={ArrowRight}
                className="w-full max-w-xs"
              >
                COLLABORATE
              </BrutalButton>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
