import { NextResponse } from "next/server";
import { publishedArticles } from "@/lib/data/articles";
import { verifyAdminIdToken } from "@/lib/firebase/verify-id-token";
import { calculateReadingTime } from "@/lib/utils";

/** Returns full article payloads for an authenticated admin (server-only source). */
export async function GET(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const idToken = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  const admin = await verifyAdminIdToken(idToken);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = publishedArticles.map((article) => ({
    ...article,
    status: "published" as const,
    readingTime: calculateReadingTime(article.content),
  }));

  return NextResponse.json({ posts });
}
