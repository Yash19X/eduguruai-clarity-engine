function splitQuestions(text) {
  return text
    .replace(/\?/g, "?|")
    .split(/\band\b|\balso\b|\baur\b|\|/i)
    .map(q => q.trim())
    .filter(q => q.length > 3);
}

function detectIntent(text) {
  const lower = text.toLowerCase();
  if (lower.includes("confused") || lower.includes("not sure")) return "confusion";
  if (lower.includes("fear") || lower.includes("worried") || lower.includes("scared")) return "fear";
  if (lower.includes("decide") || lower.includes("choose")) return "decision";
  if (lower.includes("plan") || lower.includes("roadmap")) return "planning";
  return "learning";
}

function clarityEngine(question) {
  const intent = detectIntent(question);
  const problem = `The core issue is a lack of clarity about a ${intent} context.`;
  const options = [
    "Break the problem into parts",
    "Clarify priorities",
    "Begin with the first small step"
  ];
  const direction = "Focus on clarity before action.";
  return { clarified_problem: problem, structured_options: options, recommended_direction: direction, next_action: options[0] };
}

function multiQuestionEngineV2(input) {
  const questions = splitQuestions(input);
  const responses = questions.map(q => ({
    question: q,
    clarity: clarityEngine(q)
  }));
  return { type: "multi-question", count: responses.length, responses };
}

async function getClarity() {
  const userInput = document.getElementById("answers").value;
  if (!userInput.trim()) { document.getElementById("output").innerText = "Please enter a question."; return; }
  const result = multiQuestionEngineV2(userInput);
  let out = "";
  result.responses.forEach((r, i) => {
    out += `Q${i+1}: ${r.question}\nClarity: ${r.clarity.clarified_problem}\nDirection: ${r.clarity.recommended_direction}\nNext: ${r.clarity.next_action}\n\n`;
  });
  document.getElementById("output").innerText = out;
  document.getElementById("answers").value = "";
}