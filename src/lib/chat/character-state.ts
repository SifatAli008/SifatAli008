import {
  CHARACTER_SHEETS,
  resolveCharacterImageKey,
  type CharacterSheetId,
} from "@/lib/data/character-sprites";

export type { CharacterSheetId };

export interface CharacterReaction {
  sheetId: CharacterSheetId;
  poseKey: string;
  imageKey: string;
  moodLabel: string;
}

interface MessageLike {
  role: "user" | "assistant";
  content: string;
}

interface ToneScores {
  greeting: number;
  praise: number;
  hire: number;
  tech: number;
  curious: number;
  confused: number;
  negative: number;
  sarcasm: number;
}

interface ToneCandidate {
  sheetId: CharacterSheetId;
  poseKey: string;
  moodLabel: string;
  confidence: number;
}

const BENGALI_SCRIPT = /[\u0980-\u09FF]/;

const GREETING_PATTERN =
  /^\s*(hi|hello|hey|yo|sup|assalam|salam|namaste|kemon|ki\s*obostha|good\s+(morning|evening|afternoon)|হ্যালো|হাই|আসসালাম|সালাম|নমস্কার)/i;
const PRAISE_PATTERN =
  /\b(love|amazing|awesome|great|brilliant|legend|best|thank|thanks|cool|impressive|wonderful|excellent|🔥|❤|wow|appreciate|dhonnobad|dhanobar|onek valo|khub bhalo|darun|ভালো|ধন্যবাদ|দারুণ|অসাধারণ)\b/i;
const HIRE_PATTERN =
  /\b(hire|hiring|collaborat|work together|freelance|contract|budget|rate|availability|project inquiry|reach out|korbo|kaaj|kaj|consult|partnership|হায়ার|নিয়োগ|কাজ|করব|করবো)\b/i;
const TECH_PATTERN =
  /\b(code|coding|github|api|ai|rag|llm|react|next\.?js|firebase|stack|build|built|developer|engineer|project|portfolio|deploy|vercel|cloudinary|full[- ]?stack|typescript|javascript|প্রজেক্ট|স্কিল|টেক)\b/i;
const CURIOUS_PATTERN =
  /\b(who is|what is|what's|tell me|about sifat|his (work|skills|projects|experience)|best at|background|education|achievement|ki kore|ki kor|kon|kemon|bolen|bolo|সিফাত|কী|কি|কেমন|বলেন|বলো|কাজ|পোর্টফোলিও)\b/i;
const CONFUSED_PATTERN =
  /\b(confus|don't understand|didn't get|not sure what|clarify|explain (this|that|how)|what do you mean|bujhini|bujhi na|বুঝিনা|বুঝি না|মানে কী|মানে কি)\b/i;
const QUESTION_PATTERN = /\?\s*$/;
const NEGATIVE_PATTERN =
  /\b(sorry|can't|cannot|unfortunately|don't know|no idea|outside my lane|not sure on that)\b/i;
const SARCASM_PATTERN =
  /\b(yeah right|as if|obviously|totally|sure sure|let me guess|must be nice|so original|real creative|genius|oh great|another (portfolio|chat) bot|groundbreaking|wow so|not bad for a bot|\/s|🙅|🙄|bet he|invented ai|single.?handedly|তো নাকি|নাকি তো|অবশ্যই তো|হ্যাঁ ঠিক|ঠিক আই|onek bhalo re|ki re)\b/i;
const ASSISTANT_SHARE_PATTERN =
  /\b(he |sifat |his )(built|works|shipped|leads|runs|stack|project)/i;

function scoreSarcasm(text: string): number {
  const lower = text.toLowerCase();
  let score = 0;

  if (SARCASM_PATTERN.test(lower) || SARCASM_PATTERN.test(text)) score += 4;
  if (
    /\b(sure|totally|obviously|clearly|definitely)\b/i.test(lower) &&
    /\bsifat\b/i.test(lower)
  ) {
    score += 2;
  }
  if (PRAISE_PATTERN.test(lower) && /\b(bot|fake|chatgpt|useless|mid)\b/i.test(lower)) {
    score += 3;
  }
  if (text.includes("...") && /\b(best|greatest|legend|genius)\b/i.test(lower)) {
    score += 2;
  }

  return score;
}

function scoreUser(text: string): ToneScores {
  const t = text.trim();
  const lower = t.toLowerCase();
  const words = lower.split(/\s+/).length;
  const hasBengali = BENGALI_SCRIPT.test(t);

  return {
    greeting:
      (GREETING_PATTERN.test(t) && words <= 12 ? 4 : 0) +
      (hasBengali && words <= 8 ? 1 : 0),
    praise: PRAISE_PATTERN.test(lower) || PRAISE_PATTERN.test(t) ? 4 : 0,
    hire: HIRE_PATTERN.test(lower) || HIRE_PATTERN.test(t) ? 4 : 0,
    tech: TECH_PATTERN.test(lower) || TECH_PATTERN.test(t) ? 3 : 0,
    curious:
      (CURIOUS_PATTERN.test(lower) || CURIOUS_PATTERN.test(t) ? 3 : 0) +
      (hasBengali ? 1 : 0),
    confused:
      CONFUSED_PATTERN.test(lower) ||
      CONFUSED_PATTERN.test(t) ||
      (QUESTION_PATTERN.test(t) && words >= 4)
        ? 2
        : 0,
    negative: 0,
    sarcasm: scoreSarcasm(t),
  };
}

function scoreAssistant(text: string): ToneScores {
  const lower = text.toLowerCase();
  const len = text.length;

  return {
    greeting: 0,
    praise: PRAISE_PATTERN.test(lower) ? 2 : 0,
    hire: HIRE_PATTERN.test(lower) ? 2 : 0,
    tech: TECH_PATTERN.test(lower) ? 2 : 0,
    curious: 0,
    confused: 0,
    negative: NEGATIVE_PATTERN.test(lower) ? 3 : 0,
    sarcasm: scoreSarcasm(text),
    ...(len > 140 && ASSISTANT_SHARE_PATTERN.test(text)
      ? { tech: 2, curious: 0 }
      : {}),
  };
}

function buildReaction(
  sheetId: CharacterSheetId,
  poseKey: string,
  moodLabel: string
): CharacterReaction {
  return {
    sheetId,
    poseKey,
    imageKey: resolveCharacterImageKey(sheetId, poseKey),
    moodLabel,
  };
}

function pickToneCandidate(
  userContent: string,
  assistantContent: string
): ToneCandidate {
  const user = scoreUser(userContent);
  const assistant = scoreAssistant(assistantContent);
  const candidates: ToneCandidate[] = [];

  if (user.greeting >= 4) {
    candidates.push({
      sheetId: "enthusiastic",
      poseKey: "idle",
      moodLabel: "Hey there",
      confidence: 5,
    });
  }

  if (user.sarcasm >= 3) {
    candidates.push({
      sheetId: "casual",
      poseKey: "determined",
      moodLabel: "Fair point",
      confidence: 5,
    });
    candidates.push({
      sheetId: "enthusiastic",
      poseKey: "thinking",
      moodLabel: "Nice try",
      confidence: 4,
    });
  }

  if (user.praise >= 4 && user.sarcasm < 2) {
    candidates.push({
      sheetId: "enthusiastic",
      poseKey: "cheer",
      moodLabel: "Appreciate it",
      confidence: 5,
    });
  }

  if (user.hire >= 4 || assistant.hire >= 2) {
    candidates.push({
      sheetId: "professional",
      poseKey: "explaining",
      moodLabel: "Let's talk scope",
      confidence: 5,
    });
  }

  if (user.tech >= 3 && user.confused >= 2) {
    candidates.push({
      sheetId: "developer",
      poseKey: "confused",
      moodLabel: "Breaking it down",
      confidence: 5,
    });
  } else if (user.tech >= 3) {
    candidates.push({
      sheetId: "developer",
      poseKey: "laptop",
      moodLabel: "On the build",
      confidence: 4,
    });
  }

  if (user.curious >= 3 && !user.tech) {
    candidates.push({
      sheetId: "professional",
      poseKey: "confident",
      moodLabel: "Happy to share",
      confidence: 4,
    });
  }

  if (user.confused >= 2 || assistant.negative >= 3) {
    candidates.push({
      sheetId: "casual",
      poseKey: "confused",
      moodLabel: assistant.negative >= 3 ? "Let me clarify" : "Good question",
      confidence: assistant.negative >= 3 ? 4 : 3,
    });
  }

  if (assistant.tech >= 2 && assistantContent.length > 80) {
    candidates.push({
      sheetId: "developer",
      poseKey: "presenting",
      moodLabel: "Here's the detail",
      confidence: 4,
    });
  }

  if (assistantContent.length > 160 && !assistant.negative) {
    candidates.push({
      sheetId: "professional",
      poseKey: "explaining",
      moodLabel: "Explaining",
      confidence: 3,
    });
  }

  if (assistantContent.length > 70 && !assistant.negative) {
    candidates.push({
      sheetId: "enthusiastic",
      poseKey: "presenting",
      moodLabel: "Sharing",
      confidence: 2,
    });
  }

  candidates.push({
    sheetId: "standalone",
    poseKey: "default",
    moodLabel: "Listening",
    confidence: 1,
  });

  candidates.sort((a, b) => b.confidence - a.confidence);
  return candidates[0];
}

/**
 * Show a reaction when tone is clear enough (~70% of real replies, none on filler).
 */
export function shouldShowMessageCharacter(
  userContent: string,
  assistantContent: string,
  match: ToneCandidate
): boolean {
  const len = assistantContent.trim().length;
  if (len < 50) return false;
  if (match.confidence >= 4) return true;
  if (match.confidence >= 3 && len >= 70) return true;
  if (match.confidence >= 2 && len >= 110) return true;
  return false;
}

export function resolveReactionForExchange(
  userContent: string,
  assistantContent: string
): CharacterReaction {
  const match = pickToneCandidate(userContent, assistantContent);
  return buildReaction(match.sheetId, match.poseKey, match.moodLabel);
}

export function resolveCharacterReaction(
  messages: MessageLike[],
  loading: boolean
): CharacterReaction {
  const lastUser = lastOfRole(messages, "user");
  const lastAssistant = lastOfRole(messages, "assistant");
  const userScores = scoreUser(lastUser);

  if (loading) {
    if (userScores.tech >= 3) {
      return buildReaction("developer", "confused", "Thinking…");
    }
    return buildReaction("casual", "confused", "Thinking…");
  }

  if (!lastUser && messages.length <= 1) {
    return buildReaction("standalone", "default", "Ready to help");
  }

  if (lastUser && lastAssistant) {
    return resolveReactionForExchange(lastUser, lastAssistant);
  }

  return buildReaction("standalone", "default", "Listening");
}

function lastOfRole(messages: MessageLike[], role: "user" | "assistant") {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === role) return messages[i].content;
  }
  return "";
}

export type MessageCharacter = Pick<
  CharacterReaction,
  "sheetId" | "poseKey" | "moodLabel"
>;

export function attachMessageCharacter(
  userContent: string,
  assistantContent: string
): MessageCharacter | undefined {
  const match = pickToneCandidate(userContent, assistantContent);
  if (!shouldShowMessageCharacter(userContent, assistantContent, match)) {
    return undefined;
  }
  const { sheetId, poseKey, moodLabel } = match;
  return { sheetId, poseKey, moodLabel };
}

export function getMoodCaption(reaction: CharacterReaction): string {
  return `${CHARACTER_SHEETS[reaction.sheetId].label} · ${reaction.moodLabel}`;
}
