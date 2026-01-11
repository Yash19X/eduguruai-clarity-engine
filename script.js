// ================================
// EduGuruAI Clarity Engine v1.1
// ================================

// ----------------------
// Step 1: Intent Detection
// ----------------------
function detectIntent(text) {
  const lower = text.toLowerCase();
  if (lower.includes("confused") || lower.includes("not sure") || lower.includes("uncertain")) return "confusion";
  if (lower.includes("fear") || lower.includes("worried") || lower.includes("scared")) return "fear";
  if (lower.includes("decide") || lower.includes("choose") || lower.includes("decision")) return "decision";
  if (lower.includes("plan") || lower.includes("roadmap") || lower.includes("strategy")) return "planning";
  return "learning";
}

// ----------------------
// Step 2: Noise Removal
// ----------------------
function cleanInput(text) {
  return text
    .replace(/(very|really|extremely|actually|just)/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ----------------------
// Step 3: Problem Restatement
// ----------------------
function restateProblem(intent) {
  switch(intent) {
    case "confusion":
      return "The core issue is a lack of clarity about a key decision.";
    case "fear":
      return "The core issue is fear affecting rational decision-making.";
    case "decision":
      return "The core issue is choosing between multiple options.";
    case "planning":
      return "The core issue is creating a clear, actionable plan.";
    default:
      return "The core issue is understanding the situation clearly.";
  }
}

// ----------------------
// Step 4: Option Generation
// ----------------------
function generateOptions(intent) {
  switch(intent) {
    case "confusion":
      return [
        "Break the problem into smaller parts.",
        "Clarify constraints and priorities.",
        "Delay decision until clarity improves."
      ];
    case "fear":
      return [
        "Separate facts from assumptions.",
        "Assess worst-case realistically.",
        "Focus on controllable actions."
      ];
    case "decision":
      return [
        "Compare options against clear criteria.",
        "Choose the reversible option first.",
        "Test one option with low risk."
      ];
    case "planning":
      return [
        "List steps in order of importance.",
        "Set clear deadlines.",
        "Start with the smallest actionable step."
      ];
    default:
      return [
        "Gather reliable information.",
        "Ask clarifying questions.",
        "Take one small action to learn."
      ];
  }
}

// ----------------------
// Step 5: Recommended Direction
// ----------------------
function recommendDirection(intent) {
  switch(intent) {
    case "confusion": return "Focus on clarity before committing to action.";
    case "fear": return "Reduce emotional load before making decisions.";
    case "decision": return "Choose the option with lowest irreversible risk.";
    case "planning": return "Start with the smallest actionable step.";
    default: return "Convert learning into action.";
  }
}

// ----------------------
// Step 6: Clarity Engine Main Function
// ----------------------
function clarityEngine(userInput) {
  if(!userInput || userInput.trim() === "") return {error: "Input is empty."};

  const intent = detectIntent(userInput);
  const cleaned = cleanInput(userInput);
  const problem = restateProblem(intent);
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

// ================================
// Example Usage
// ================================
const input = "I'm really confused about my career and worried that AI will replace jobs.";
const output = clarityEngine(input);

console.log(output);