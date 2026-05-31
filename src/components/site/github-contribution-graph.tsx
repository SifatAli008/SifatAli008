"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import {
  contributionLevel,
  getContributionYearOptions,
  getMonthLabels,
  resolveGitHubUsernameForContributions,
  type ContributionCalendar,
} from "@/lib/github/contributions";
import { cn } from "@/lib/utils";

interface GitHubContributionGraphProps {
  githubUrl?: string;
}

const LEVEL_CLASS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "bg-cream",
  1: "bg-accent/35",
  2: "bg-accent/55",
  3: "bg-accent/80",
  4: "bg-accent",
};

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const CELL = 11;
const GAP = 3;
const DAY_COL = 30;
const ROW_H = 7 * CELL + 6 * GAP;

interface HoveredCell {
  date: string;
  count: number;
  weekIndex: number;
  dayIndex: number;
}

function formatDayTitle(date: string, count: number) {
  if (!date) return "";
  const formatted = new Date(date).toLocaleDateString("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${count} contribution${count === 1 ? "" : "s"} on ${formatted}`;
}

function cellPosition(weekIndex: number, dayIndex: number) {
  const gridPad = 1;
  const left = gridPad + weekIndex * (CELL + GAP) + CELL / 2;
  const top = gridPad + dayIndex * (CELL + GAP) + CELL / 2;
  return { left, top };
}

function chartWidth(weekCount: number) {
  if (weekCount <= 0) return 0;
  return weekCount * (CELL + GAP) - GAP;
}

export function GitHubContributionGraph({ githubUrl }: GitHubContributionGraphProps) {
  const username = resolveGitHubUsernameForContributions(githubUrl);
  const years = useMemo(() => getContributionYearOptions(), []);
  const [year, setYear] = useState(years[0]);
  const [calendar, setCalendar] = useState<ContributionCalendar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hovered, setHovered] = useState<HoveredCell | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/github/contributions?username=${encodeURIComponent(username)}&year=${year}`
        );
        const data = (await response.json()) as ContributionCalendar & { error?: string };

        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load contributions");
        }

        if (!cancelled) setCalendar(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load contributions");
          setCalendar(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [username, year]);

  useEffect(() => {
    setHovered(null);
  }, [year]);

  const weekCount = calendar?.weeks.length ?? 0;
  const gridW = chartWidth(weekCount);
  const chartBlockW = gridW + DAY_COL + 8;
  const total = calendar?.totalContributions ?? 0;
  const profileUrl = `https://github.com/${username}`;

  const monthLabels = useMemo(
    () => (calendar?.weeks ? getMonthLabels(calendar.weeks) : []),
    [calendar?.weeks]
  );

  const cells = useMemo(() => {
    if (!calendar?.weeks) return [];
    return calendar.weeks.flatMap((week, weekIndex) =>
      week.map((day, dayIndex) => ({
        key: `${weekIndex}-${dayIndex}-${day.date || "empty"}`,
        day,
        weekIndex,
        dayIndex,
        delay: weekIndex * 0.012 + dayIndex * 0.006,
      }))
    );
  }, [calendar?.weeks]);

  return (
    <div className="max-w-full overflow-x-auto pb-1">
      <motion.div
        className="inline-block w-fit max-w-none border-[3px] border-ink bg-cream"
        style={{ boxShadow: "8px 8px 0 0 #0a0a0a" }}
        whileHover={{ boxShadow: "10px 10px 0 0 #0a0a0a" }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        <div
          className="space-y-3 border-b-2 border-ink px-4 py-3"
          style={{ width: chartBlockW > 0 ? chartBlockW + 32 : undefined, minWidth: 280 }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${year}-${total}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="font-display text-xl leading-none text-ink md:text-2xl"
                >
                  {loading ? "-" : total.toLocaleString()}
                  <span className="ml-1.5 text-sm text-muted md:text-base">contributions</span>
                </motion.p>
              </AnimatePresence>
              <p className="label-mono mt-1 text-[10px] text-muted">Calendar year {year}</p>
            </div>
            <motion.div whileHover={{ x: 2, y: -2 }} transition={{ type: "spring", stiffness: 500 }}>
              <Link
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="label-mono inline-flex shrink-0 items-center gap-1 border-2 border-ink px-2 py-1 text-[10px] text-ink transition-colors hover:bg-ink hover:text-cream"
              >
                @{username.toUpperCase()}
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </motion.div>
          </div>

          <div className="flex flex-wrap gap-1">
            {years.map((option) => {
              const active = option === year;
              return (
                <motion.button
                  key={option}
                  type="button"
                  onClick={() => setYear(option)}
                  whileTap={{ scale: 0.94 }}
                  className={cn(
                    "label-mono relative px-2 py-0.5 text-[10px] transition-colors",
                    active
                      ? "border-2 border-ink bg-accent text-cream"
                      : "border-2 border-transparent text-muted hover:border-ink/30 hover:text-ink"
                  )}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="p-4">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center text-muted"
                style={{ width: chartBlockW || 280, height: ROW_H + 32 }}
              >
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-2 text-center"
                style={{ width: chartBlockW || 280, height: ROW_H + 32 }}
              >
                <p className="text-sm text-muted">{error}</p>
                <Link href={profileUrl} className="label-mono text-[10px] text-accent hover:underline">
                  View on GitHub ↗
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key={`grid-${year}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
                style={{ width: chartBlockW }}
              >
                <div
                  className="relative mb-2 h-4"
                  style={{ width: gridW, marginLeft: DAY_COL + 8 }}
                >
                  {monthLabels.map(({ label, index }) => (
                    <motion.span
                      key={`${label}-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="label-mono absolute top-0 text-[9px] uppercase tracking-wider text-muted"
                      style={{ left: index * (CELL + GAP) }}
                    >
                      {label}
                    </motion.span>
                  ))}
                </div>

                <div className="mb-2 min-h-[14px]" style={{ marginLeft: DAY_COL + 8 }}>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={hovered ? `${hovered.date}-${hovered.count}` : "empty"}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className={cn(
                        "label-mono text-[10px]",
                        hovered ? "text-ink" : "text-muted"
                      )}
                    >
                      {hovered
                        ? formatDayTitle(hovered.date, hovered.count)
                        : "Hover a square for details"}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <div className="flex items-start gap-2 overflow-visible">
                  <div
                    className="flex shrink-0 flex-col justify-between pt-[1px] text-[9px] leading-none text-muted"
                    style={{ width: DAY_COL, height: ROW_H }}
                  >
                    {DAY_LABELS.map((label, index) => (
                      <span key={index} className="label-mono uppercase">
                        {label}
                      </span>
                    ))}
                  </div>

                  <div className="relative shrink-0 overflow-visible">
                    <AnimatePresence>
                      {hovered ? (
                        <motion.div
                          key={`${hovered.date}-${hovered.weekIndex}-${hovered.dayIndex}`}
                          initial={{ opacity: 0, y: 4, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 4, scale: 0.96 }}
                          transition={{ duration: 0.12 }}
                          className="pointer-events-none absolute z-30 whitespace-nowrap border-2 border-ink bg-ink px-2 py-1 label-mono text-[10px] text-cream"
                          style={{
                            left: cellPosition(hovered.weekIndex, hovered.dayIndex).left,
                            top: cellPosition(hovered.weekIndex, hovered.dayIndex).top,
                            transform: "translate(-50%, calc(-100% - 6px))",
                            boxShadow: "3px 3px 0 0 #ff3b00",
                          }}
                        >
                          {formatDayTitle(hovered.date, hovered.count)}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    <div
                      className="grid border-2 border-ink bg-ink/[0.03] p-1"
                      style={{
                        gridTemplateRows: `repeat(7, ${CELL}px)`,
                        gridTemplateColumns: `repeat(${weekCount}, ${CELL}px)`,
                        gridAutoFlow: "column",
                        gap: GAP,
                      }}
                      onMouseLeave={() => setHovered(null)}
                    >
                      {cells.map(({ key, day, weekIndex, dayIndex, delay }) => {
                        const level = contributionLevel(day.count);
                        const hasDate = Boolean(day.date);
                        const isHovered =
                          hovered?.date === day.date &&
                          hovered.weekIndex === weekIndex &&
                          hovered.dayIndex === dayIndex;

                        return (
                          <motion.span
                            key={key}
                            role={hasDate ? "button" : undefined}
                            tabIndex={hasDate ? 0 : -1}
                            aria-label={hasDate ? formatDayTitle(day.date, day.count) : undefined}
                            onMouseEnter={() => {
                              if (hasDate) {
                                setHovered({ date: day.date, count: day.count, weekIndex, dayIndex });
                              }
                            }}
                            onFocus={() => {
                              if (hasDate) {
                                setHovered({ date: day.date, count: day.count, weekIndex, dayIndex });
                              }
                            }}
                            onBlur={() => setHovered(null)}
                            initial={{ opacity: 0, scale: 0.4 }}
                            animate={{ opacity: 1, scale: isHovered ? 1.35 : 1 }}
                            transition={{
                              opacity: { duration: 0.2, delay, ease: [0.22, 1, 0.36, 1] },
                              scale: { type: "spring", stiffness: 500, damping: 28 },
                            }}
                            className={cn(
                              "block border border-ink/20",
                              hasDate ? "cursor-pointer" : "cursor-default",
                              LEVEL_CLASS[level],
                              isHovered && "z-10 shadow-[0_0_0_1px_#0a0a0a]",
                              level >= 3 && hasDate && "ring-1 ring-accent/30"
                            )}
                            style={{ width: CELL, height: CELL }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-3 flex flex-wrap items-center gap-2"
                  style={{ marginLeft: DAY_COL + 8 }}
                >
                  <span className="label-mono text-[9px] uppercase text-muted">Less</span>
                  {([0, 1, 2, 3, 4] as const).map((level) => (
                    <span
                      key={level}
                      className={cn("block border border-ink/20", LEVEL_CLASS[level])}
                      style={{ width: CELL, height: CELL }}
                    />
                  ))}
                  <span className="label-mono text-[9px] uppercase text-muted">More</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
