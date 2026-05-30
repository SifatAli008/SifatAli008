export const ALLOWED_ADMIN_EMAILS = [
  "alisifat061@gmail.com",
  "sifatali008@gmail.com",
] as const;

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ALLOWED_ADMIN_EMAILS.some(
    (allowed) => allowed.toLowerCase() === normalized
  );
}

export class UnauthorizedAdminError extends Error {
  constructor() {
    super("UNAUTHORIZED_ADMIN");
    this.name = "UnauthorizedAdminError";
  }
}
