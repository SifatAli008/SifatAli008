"use client";

import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/messages";
import { useLocale } from "@/components/i18n/locale-provider";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
  compact?: boolean;
};

export function LanguageSwitcher({
  className,
  compact = false,
}: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      role="group"
      aria-label={t("lang.label")}
    >
      {!compact ? (
        <span className="sr-only">{t("lang.label")}</span>
      ) : null}
      {LOCALES.map((code: Locale) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className={cn(
            "border-2 border-ink px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors",
            locale === code
              ? "bg-ink text-cream"
              : "bg-white text-ink hover:bg-[#fff8ef]"
          )}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
