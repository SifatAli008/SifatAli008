import { ADMIN_HOME_PATH } from "./routes";

export const ADMIN_NAV_LABELS: Record<string, string> = {
  [ADMIN_HOME_PATH]: "Overview",
  "/admin/projects": "Projects",
  "/admin/blog": "Blog",
  "/admin/skills": "Skills",
  "/admin/experience": "Experience",
  "/admin/achievements": "Achievements",
  "/admin/contacts": "Contacts",
  "/admin/settings": "Settings",
};

export function getAdminPageTitle(pathname: string): string {
  if (ADMIN_NAV_LABELS[pathname]) return ADMIN_NAV_LABELS[pathname];
  const match = Object.entries(ADMIN_NAV_LABELS)
    .filter(([path]) => path !== ADMIN_HOME_PATH)
    .find(([path]) => pathname.startsWith(path));
  return match?.[1] ?? "Admin";
}
