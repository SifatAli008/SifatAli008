import { getGitHubToken, parseGitHubUsername } from "@/lib/github/repo-info";

export interface ContributionDay {
  date: string;
  count: number;
}

export interface ContributionCalendar {
  username: string;
  year: number;
  totalContributions: number;
  weeks: ContributionDay[][];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function resolveGitHubUsernameForContributions(
  githubUrl: string | undefined,
  fallback = "SifatAli008"
): string {
  return parseGitHubUsername(githubUrl ?? fallback);
}

export function contributionLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

export function getMonthLabels(weeks: ContributionDay[][]): { label: string; index: number }[] {
  const labels: { label: string; index: number }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, index) => {
    const firstDay = week.find((day) => day.date);
    if (!firstDay) return;

    const month = new Date(firstDay.date).getUTCMonth();
    if (month !== lastMonth) {
      labels.push({ label: MONTHS[month], index });
      lastMonth = month;
    }
  });

  return labels;
}

function padWeeks(days: ContributionDay[]): ContributionDay[][] {
  if (days.length === 0) return [];

  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];

  const firstDay = new Date(sorted[0].date);
  for (let i = 0; i < firstDay.getUTCDay(); i++) {
    currentWeek.push({ date: "", count: 0 });
  }

  for (const day of sorted) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: "", count: 0 });
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

async function fetchViaGraphQL(
  username: string,
  year: number
): Promise<ContributionCalendar | null> {
  const token = getGitHubToken();
  if (!token) return null;

  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year}-12-31T23:59:59Z`;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "SifatAli-Portfolio",
    },
    body: JSON.stringify({
      query: `
        query($username: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `,
      variables: { username, from, to },
    }),
    next: { revalidate: 3600 },
  });

  if (!response.ok) return null;

  const json = (await response.json()) as {
    data?: {
      user?: {
        contributionsCollection?: {
          contributionCalendar?: {
            totalContributions: number;
            weeks: { contributionDays: { contributionCount: number; date: string }[] }[];
          };
        };
      };
    };
  };

  const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) return null;

  return {
    username,
    year,
    totalContributions: calendar.totalContributions,
    weeks: calendar.weeks.map((week) =>
      week.contributionDays.map((day) => ({
        date: day.date.slice(0, 10),
        count: day.contributionCount,
      }))
    ),
  };
}

async function fetchViaPublicApi(
  username: string,
  year: number
): Promise<ContributionCalendar | null> {
  const response = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=${year}`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) return null;

  const json = (await response.json()) as {
    total?: Record<string, number>;
    contributions?: { date: string; count: number }[];
  };

  const contributions = json.contributions ?? [];
  if (contributions.length === 0) return null;

  const days = contributions.map((item) => ({
    date: item.date,
    count: item.count,
  }));

  return {
    username,
    year,
    totalContributions: json.total?.[String(year)] ?? days.reduce((sum, d) => sum + d.count, 0),
    weeks: padWeeks(days),
  };
}

export async function fetchGitHubContributions(
  usernameInput: string | undefined,
  year = new Date().getFullYear()
): Promise<ContributionCalendar> {
  const username = parseGitHubUsername(usernameInput);
  const targetYear = year;

  const graphResult = await fetchViaGraphQL(username, targetYear);
  if (graphResult) return graphResult;

  const publicResult = await fetchViaPublicApi(username, targetYear);
  if (publicResult) return publicResult;

  return {
    username,
    year: targetYear,
    totalContributions: 0,
    weeks: [],
  };
}

export function getContributionYearOptions(currentYear = new Date().getFullYear()): number[] {
  return Array.from({ length: 5 }, (_, i) => currentYear - i);
}
