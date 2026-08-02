import { isAllowedAdminEmail } from "@/lib/auth/allowed-admins";

type LookupResponse = {
  users?: { email?: string; localId?: string }[];
  error?: { message?: string };
};

/** Verify a Firebase ID token via Identity Toolkit (no Admin SDK required). */
export async function verifyAdminIdToken(
  idToken: string
): Promise<{ email: string; uid: string } | null> {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!apiKey || !idToken) return null;

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );

  if (!res.ok) return null;
  const data = (await res.json()) as LookupResponse;
  const user = data.users?.[0];
  const email = user?.email?.trim().toLowerCase();
  if (!email || !user?.localId || !isAllowedAdminEmail(email)) return null;
  return { email, uid: user.localId };
}
