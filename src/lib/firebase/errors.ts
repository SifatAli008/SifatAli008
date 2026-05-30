import { FirebaseError } from "firebase/app";

export function isFirestorePermissionError(error: unknown): boolean {
  return (
    error instanceof FirebaseError &&
    (error.code === "permission-denied" || error.code === "PERMISSION_DENIED")
  );
}

export function getFirestoreErrorMessage(error: unknown): string {
  if (isFirestorePermissionError(error)) {
    return "Firestore permission denied. Sign in to the dashboard and run: npm run firebase:rules";
  }
  if (error instanceof FirebaseError) return error.message;
  if (error instanceof Error) return error.message;
  return "Firestore request failed.";
}
