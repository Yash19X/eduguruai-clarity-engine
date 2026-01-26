/***********************
 * EduGuruAI – Clarity Engine v3
 * Human Intelligence OS (MVP)
 ***********************/

let lastSpeechText = "";

/* ========= Utilities ========= */
function nowISO() {
  return new Date().toISOString();
}

function detectLanguage(text) {
  return /[\u0900-\u097F]/.test(text) ? "hi-IN" : "en-US";
}

/* ========= Intelligent Question Split ========= */
function splitQuestions(text) {
  const qMarks = (text.match(/\?/g) || []).length;
  if (qMarks > 1) {
    return text
      .split("?")
      .map(q => q.trim())
      .filter(q => q.length > 6);
  }
  return [text.trim()];
}

/* ========= Intent Detection ========= */
function detectIntent(text) {
  const t = text.toLowerCase();

  if (t.includes("career") || t.includes("job") || t.includes("profession"))
    return "career";
  if (t.includes("study") || t.includes("exam") || t.includes("college"))
    return "education";
  if (t.includes("money") || t.includes("earn") || t.includes("income"))
    return "money";
  if (t.includes("fear") || t.includes("dar") || t.includes("scared"))
    return "fear";
  if (t.includes("choose") || t.includes("decide") || t.includes("option"))
    return "decision";
  if (t.includes("plan") || t.includes("roadmap") || t.includes("strategy"))
    return "planning";

  return "general";
}

/* ========= Constraint Detection ========= */
function detectConstraints(text) {
  const t = text.toLowerCase();
  const constraints = [];

  if (t.includes("time") || t.includes("busy") || t.includes("fast"))
    constraints.push("time");

  if (t.includes("money") || t.includes("no money") || t.includes("poor"))
    constraints.push("money");

  if (t.includes("skill") || t.includes("beginner") || t.includes("no experience"))
    constraints.push("skill");

  return constraints;
}

/* ========= Thinking Pattern Detection ========= */
function detectThinkingPattern(text) {
  const t = text.toLowerCase();

  if (t.includes("again and again") || t.includes("overthink"))
    return "overthinking";

  if (t.includes("fear") || t.includes("dar") || t.includes("what if"))
    return "fear_bias";

  return "balanced";
}

/* ========= Confidence Score ========= */
function confidenceScore(question, intent) {
  let score = 65;

  const words = question.split(/\s+/).length;
  if (words >= 8) score += 8;
  if (intent !== "general") score += 7;
  if (question.length < 10) score -= 10;

  return Math.max(40, Math.min(95, score));
}

/* ========= Context Extract ========= */
function extractFocus(question) {
  return question.split(" ").slice(0, 12).join(" ");
}

/* ========= Clarity Engine ========= */
function clarityEngine(question) {
  const lang = detectLanguage(question);
  const intent = detectIntent(question);
  const constraints = detectConstraints(question);
  const thinking = detectThinkingPattern(question);
  const confidence = confidenceScore(question, intent);

  const constraintNote =
    constraints.length > 0
      ? `Constraints noticed: ${constraints.join(", ")}. `
      : "";

  const thinkingNote =
    thinking === "overthinking"
      ? "You may be overthinking this. "
      : thinking === "fear_bias"
      ? "Fear seems to be influencing your thinking. "
      : "";

  if (lang === "hi-IN") {
    return {
      intent,
      confidence,
      clarified_problem:
        `Aap "${extractFocus(question)}..." ko lekar confused hain.`,
      recommended_direction:
        `${thinkingNote}${constraintNote}Pehle clarity lao, phir action lo.`,
      next_action:
        "Ek chhota, controllable step choose karo jo aaj hi ho sake."
    };
  }

  return {
    intent,
    confidence,
    clarified_problem:
      `You are confused about "${extractFocus(question)}..."`,
    recommended_direction:
      `${thinkingNote}${constraintNote}Focus on clarity before action.`,
    next_action:
      "Choose one small, controllable step you can take today."
  };
}

/* ========= LocalStorage Memory ========= */
const HISTORY_KEY = "eduguruai_decision_history_v3";

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch {
    return [];
  }
}

function pushToHistory(record) {
  const history = loadHistory();
  history.unshift(record);
  if (history.length > 50) history.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

/* ========= Multi-Question Engine ========= */
function multiQuestionEngine(input) {
  const questions = splitQuestions(input);
  return questions.map(q => ({
    question: q,
    clarity: clarityEngine(q)
  }));
}

/* ========= MAIN ========= */
function getClarity() {
  const input = document.getElementById("answers").value;
  const output = document.getElementById("output");

  if (!input.trim()) {
    output.innerText = "Please enter a question.";
    return;
  }

  const results = multiQuestionEngine(input);
  let report = "EduGuruAI – Clarity Report\n========================\n\n";
  lastSpeechText = "";

  results.forEach((r, i) => {
    report += `Q${i + 1}: ${r.question}\n`;
    report += `Intent: ${r.clarity.intent}\n`;
    report += `Confidence: ${r.clarity.confidence}%\n`;
    report += `Core Issue: ${r.clarity.clarified_problem}\n`;
    report += `Direction: ${r.clarity.recommended_direction}\n`;
    report += `Next Action: ${r.clarity.next_action}\n\n`;

    pushToHistory({
      timestamp: nowISO(),
      ...r
    });

    lastSpeechText +=
      `For question ${i + 1}, ${r.clarity.recommended_direction} `;
  });

  output.innerText = report;
}

/* ========= Voice Output ========= */
function speakLast() {
  if (!lastSpeechText) return;
  const u = new SpeechSynthesisUtterance(lastSpeechText);
  u.lang = detectLanguage(lastSpeechText);
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}