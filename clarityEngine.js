// --- STEP 1: Intent Detection ---
function detectIntent(text) {
  const lower = text.toLowerCase();

  if (lower.includes("confused") || lower.includes("not sure")) return "confusion";
  if (lower.includes("fear") || lower.includes("worried") || lower.includes("scared")) return "fear";
  if (lower.includes("decide") || lower.includes("choose")) return "decision";
  if (lower.includes("plan") || lower.includes("roadmap")) return "planning";

  return "learning";
}

// --- STEP 2: Noise Removal ---
function cleanInput(text) {
  return text
    .replace(/(very|really|extremely)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

// --- STEP 3: Problem Restatement ---
function restateProblem(cleanText, intent) {
  switch (intent) {
    case "confusion":
      return `The core issue is a lack of clarity about a key decision.`;
    case "fear":
      return `The core issue is fear affecting rational decision-making.`;
    case "decision":
      return `The core issue is choosing between multiple options.`;
    case "planning":
      return `The core issue is creating a clear plan forward.`;
    default:
      return `The core issue is understanding the situation clearly.`;
  }
}

// --- STEP 4: Option Structuring ---
function generateOptions(intent) {
  switch (intent) {
    case "confusion":
      return [
        "Break the problem into smaller parts",
        "Clarify constraints and priorities",
        "Delay decision until clarity improves"
      ];
    case "fear":
      return [
        "Separate facts from assumptions",
        "Assess worst-case realistically",
        "Focus on controllable actions"
      ];
    case "decision":
      return [
        "Compare options against clear criteria",
        "Choose the reversible option first",
        "Test one option with low risk"
      ];
    default:
      return [
        "Seek reliable information",
        "Ask a clearer follow-up question",
        "Apply learning in a small way"
      ];
  }
}

// --- STEP 5: Direction Recommendation ---
function recommendDirection(intent) {
  if (intent === "confusion") return "Focus on clarity before committing to action.";
  if (intent === "fear") return "Reduce emotional load before making decisions.";
  if (intent === "decision") return "Choose the option with lowest irreversible risk.";
  return "Convert learning into action.";
}

// --- MAIN CLARITY ENGINE ---
function clarityEngine(userInput) {
  const intent = detectIntent(userInput);
  const cleaned = cleanInput(userInput);
  const problem = restateProblem(cleaned, intent);
  const options = generateOptions(intent);
  const direction = recommendDirection(intent);

  return {
    clarified_problem: problem,
    intent_type: intent,
    structured_options: options,
    recommended_direction: direction,
    next_action: options[0]
  };
}

// --- Example Run ---
const input = "I'm confused about my career and worried about AI replacing jobs";
console.log(clarityEngine(input));