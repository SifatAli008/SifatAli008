export function userFacingChatError(reason: string, status?: number): string {
  if (status === 429 || reason.includes("RESOURCE_EXHAUSTED")) {
    if (reason.includes("free_tier") || reason.includes("Quota exceeded")) {
      return "AI free-tier limit reached — wait a bit or try again later.";
    }
    return "Too many requests at once — wait a few seconds and try again.";
  }
  if (
    status === 401 ||
    status === 403 ||
    reason.includes("API key not valid") ||
    reason.includes("No auth credentials")
  ) {
    return "An AI API key on the server is invalid — check GEMINI_API_KEY, GROQ_API_KEY, and OPENROUTER_API_KEY.";
  }
  if (status === 404 || reason.includes("not found for API version")) {
    return "The configured AI model is unavailable — check GEMINI_MODEL or OPENROUTER_MODEL.";
  }
  if (reason === "empty_candidate" || reason === "all_models_failed") {
    return "The model returned an empty reply — try again in a moment.";
  }
  if (reason === "no_provider_configured") {
    return "Brain's not wired up yet — add GEMINI_API_KEY, GROQ_API_KEY, or OPENROUTER_API_KEY on the server.";
  }
  if (status === 504 || reason === "timeout") {
    return "That took too long — try again with a shorter question.";
  }
  if (status === 503 || status === 502 || status === 500) {
    return "The AI service is busy right now — try again in a moment.";
  }
  return "I could not reach the AI model right now — try again in a moment.";
}
