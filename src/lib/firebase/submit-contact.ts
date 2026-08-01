import { addDoc, collection } from "firebase/firestore";
import { db } from "./client";

/** Lightweight client-safe contact submit (no seed/fallback imports). */
export async function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!db) {
    console.info("[Contact fallback]", data);
    return { success: true };
  }
  try {
    await addDoc(collection(db, "contacts"), {
      ...data,
      read: false,
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to submit",
    };
  }
}
