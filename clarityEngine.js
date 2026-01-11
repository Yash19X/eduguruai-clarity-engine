// --- Emotion Detection ---
function detectEmotion(text) {
  const fear = ["fear","worried","scared","anxious"];
  const confusion = ["confused","not sure","uncertain"];
  const stress = ["pressure","overwhelmed"];
  const lower = text.toLowerCase();
  if (fear.some(w=>lower.includes(w))) return "fear";
  if (confusion.some(w=>lower.includes(w))) return "confusion";
  if (stress.some(w=>lower.includes(w))) return "stress";
  return "neutral";
}

// --- Intent Detection ---
function detectIntent(text) {
  const lower = text.toLowerCase();
  if (lower.includes("career")) return "career";
  if (lower.includes("ai") || lower.includes("mba") || lower.includes("study")) return "education";
  if (lower.includes("fear") || lower.includes("future") || lower.includes("worried")) return "fear";
  if (lower.includes("skill") || lower.includes("learn") || lower.includes("practice")) return "learning";
  return "general";
}

// --- Self-Learning Dictionary ---
const intentDictionary = {}; // future inputs add here

function updateIntentDictionary(text, intent) {
  // Learn new phrases for future
  const words = text.toLowerCase().split(" ");
  words.forEach(w => {
    if(!intentDictionary[w]) intentDictionary[w] = intent;
  });
}

// --- Problem Restatement ---
function restateProblem(text, intent) {
  switch(intent) {
    case "career": return "CAREER CLARITY • Reduce comparison • Choose one direction • Start with skill exploration";
    case "education": return "EDUCATION CLARITY • Compare options • Explore deeply • Take action on one choice";
    case "fear": return "EMOTIONAL CLARITY • Fear is normal • Take small steps • Focus on one actionable task";
    case "learning": return "SKILL CLARITY • One core skill • Daily practice • Apply learning quickly";
    default: return "GENERAL CLARITY • Break problem into parts • Take small steps • Experiment & learn";
  }
}

// --- Options Generator ---
function generateOptions(intent) {
  const baseOptions = {
    career: ["Break career goals into small steps", "Talk to mentors", "Explore options deeply"],
    education: ["Research paths", "Try small courses", "Compare outcomes"],
    fear: ["Write fears down", "Focus on controllable actions", "Meditate or journal"],
    learning: ["Practice daily", "Apply learning", "Seek feedback"],
    general: ["Break problem into smaller steps", "Seek guidance", "Test small actions"]
  };
  // Shuffle for fun
  return baseOptions[intent] ? baseOptions[intent].sort(()=>0.5-Math.random()) : baseOptions["general"];
}

// --- Direction Recommender ---
function recommendDirection(intent) {
  switch(intent){
    case "career": return "Focus on one career option first.";
    case "education": return "Experiment with a small step first.";
    case "fear": return "Reduce fear before making big decisions.";
    case "learning": return "Convert learning into actionable steps.";
    default: return "Start small and iterate.";
  }
}

// --- Main Clarity Engine ---
function clarityEngine(userInput) {
  const questions = userInput.split(/and|but|because|while|,|\./gi).map(q=>q.trim()).filter(q=>q);
  const results = [];

  questions.forEach(q => {
    let intent = detectIntent(q);
    if(!intent) intent = "general";

    const problem = restateProblem(q, intent);
    const options = generateOptions(intent);
    const direction = recommendDirection(intent);

    updateIntentDictionary(q, intent); // Self-learning hook

    results.push({
      question: q,
      intent_type: intent,
      clarified_problem: problem,
      structured_options: options,
      recommended_direction: direction,
      next_action: options[0]
    });
  });

  return results;
}
// --- Fun & Encouragement Phrases ---
const encouragements = [
  "You got this! 💪",
  "One step at a time 🌟",
  "Keep going! 🚀",
  "Small wins lead to big results 🏆",
  "Focus and act! ✨"
];

// --- Shuffle function ---
function shuffleArray(array) {
  return array.sort(() => 0.5 - Math.random());
}

// --- Main Clarity Engine ---
function clarityEngine(userInput) {
  // Split input into multi-questions
  const questions = userInput.split(/and|but|because|while|,|\./gi)
    .map(q => q.trim())
    .filter(q => q);

  const results = [];

  questions.forEach(q => {
    let intent = detectIntent(q);
    if(!intent) intent = "general";

    const problem = restateProblem(q, intent);

    // Randomized options + fun layer
    const baseOptions = generateOptions(intent);
    const options = shuffleArray(baseOptions).map(o => `${o} ${shuffleArray(encouragements)[0]}`);

    const direction = recommendDirection(intent);

    // Self-learning hook
    updateIntentDictionary(q, intent);

    results.push({
      question: q,
      intent_type: intent,
      clarified_problem: problem,
      structured_options: options,
      recommended_direction: `${direction} ${shuffleArray(encouragements)[0]}`,
      next_action: options[0]
    });
  });

  return results;
}