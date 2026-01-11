function detectEmotion(text) {
  const emotions = {
    fear: ["scared", "afraid", "anxious", "future", "fear"],
    confusion: ["confused", "confusion", "not sure"],
    stress: ["pressure", "overwhelmed"]
  };

  for (let emotion in emotions) {
    if (emotions[emotion].some(word => text.toLowerCase().includes(word))) {
      return emotion;
    }
  }

  return "neutral";
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