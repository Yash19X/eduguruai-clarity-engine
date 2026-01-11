function getClarity() {
  const input = document.getElementById("answers").value.toLowerCase();
  const output = document.getElementById("output");

  if (!input.trim()) {
    output.innerText = "Please describe one or more concerns.";
    return;
  }

  let responses = [];

  if (input.includes("career") || input.includes("job")) {
    responses.push(`
CAREER CLARITY
• Reduce comparison
• Choose one direction
• Start with skill exploration
`);
  }

  if (input.includes("skill") || input.includes("learn")) {
    responses.push(`
SKILL CLARITY
• One core skill
• Daily practice
• Apply learning quickly
`);
  }

  if (input.includes("fear") || input.includes("pressure")) {
    responses.push(`
EMOTIONAL CLARITY
• Your confusion is emotional
• Reduce noise
• Focus on small wins
`);
  }

  if (responses.length === 0) {
    responses.push(`
GENERAL CLARITY
• You need structure, not motivation
• Build clarity habits
• Reflect weekly
`);
  }

  output.innerText = responses.join("\n------------------\n");
  document.getElementById("answers").value = "";
}
";
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