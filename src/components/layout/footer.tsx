import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Writing" },
  { href: "/archive", label: "Archive" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t-[3px] border-accent bg-ink">
      <div className="site-container flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="label-mono text-cream">SIFAT ALI © {new Date().getFullYear()}</p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="label-mono text-cream/60 transition-colors hover:text-accent"
                >
                  {link.label.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
