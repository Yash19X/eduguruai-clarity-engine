let lastSpeechText = "";

/* ✅ Utilities */
function nowISO() {
  return new Date().toISOString();
}

function detectLanguage(text) {
  return /[\u0900-\u097F]/.test(text) ? "hi-IN" : "en-US";
}

function splitQuestions(text) {
  return text
    .replace(/\?/g, "?|")
    .split(/\band\b|\balso\b|\baur\b|\|/i)
    .map(q => q.trim())
    .filter(q => q.length > 3);
}

/* ✅ Strong intent detection */
function detectIntent(text) {
  const t = text.toLowerCase();

  if (t.includes("career") || t.includes("job") || t.includes("profession") || t.includes("placement") || t.includes("future"))
    return "career";

  if (t.includes("study") || t.includes("exam") || t.includes("school") || t.includes("college") || t.includes("subject"))
    return "education";

  if (t.includes("money") || t.includes("earn") || t.includes("business") || t.includes("startup") || t.includes("income"))
    return "money";

  if (t.includes("fear") || t.includes("scared") || t.includes("worried") || t.includes("anxiety") || t.includes("stress") || t.includes("dar"))
    return "fear";

  if (t.includes("choose") || t.includes("select") || t.includes("decide") || t.includes("option") || t.includes("which"))
    return "decision";

  if (t.includes("plan") || t.includes("roadmap") || t.includes("strategy") || t.includes("how to"))
    return "planning";

  return "general";
}

/* ✅ Confidence Score (rule-based, MVP safe) */
function confidenceScore(question, intent) {
  let score = 68;

  // More words = more context
  const words = question.trim().split(/\s+/).length;
  if (words >= 8) score += 8;
  if (words >= 15) score += 6;

  // If intent is clear, more confidence
  if (intent !== "general") score += 8;

  // If multiple question marks or too short, reduce
  if (question.length < 10) score -= 10;
  if ((question.match(/\?/g) || []).length > 1) score -= 4;

  // Random slight variance to feel natural (but stable)
  score += Math.floor(Math.random() * 6) - 2;

  // Clamp 40–95
  score = Math.max(40, Math.min(95, score));

  return score;
}

/* ✅ Clarity Engine responses */
function clarityEngine(question) {
  const lang = detectLanguage(question);
  const intent = detectIntent(question);
  const confidence = confidenceScore(question, intent);

  // Hindi responses
  if (lang === "hi-IN") {
    switch (intent) {
      case "career":
        return {
          intent,
          confidence,
          clarified_problem: "Aap career direction ko lekar confused hain.",
          recommended_direction: "Pehle apni strength + interest + market demand align karo.",
          next_action: "3 skills likho jo aap improve kar sakte ho aur 1 career track choose karo."
        };

      case "education":
        return {
          intent,
          confidence,
          clarified_problem: "Aap padhai / exam ko lekar clarity nahi paa rahe ho.",
          recommended_direction: "Syllabus ko chhote parts me divide karke daily plan banao.",
          next_action: "Aaj ka 1 topic select karo aur 45 minutes deep study karo."
        };

      case "money":
        return {
          intent,
          confidence,
          clarified_problem: "Aap earning / money goal ko lekar unclear ho.",
          recommended_direction: "Skill-first approach lo, phir income model choose karo.",
          next_action: "1 skill choose karo (coding/design/sales) aur 7 din ka learning plan banao."
        };

      case "fear":
        return {
          intent,
          confidence,
          clarified_problem: "Aapka fear aapki decision clarity ko block kar raha hai.",
          recommended_direction: "Facts aur assumptions ko alag karo, phir next step choose karo.",
          next_action: "Apna biggest fear likho aur uska smallest controllable step define karo."
        };

      case "decision":
        return {
          intent,
          confidence,
          clarified_problem: "Aapko options me se choose karna hai par criteria clear nahi hai.",
          recommended_direction: "3 criteria set karo: interest, scope, effort.",
          next_action: "Har option ko 1–10 score do aur top 1 choose karo."
        };

      case "planning":
        return {
          intent,
          confidence,
          clarified_problem: "Aapko roadmap chahiye but steps unclear hain.",
          recommended_direction: "Roadmap ko 3 phases me divide karo: learn → build → launch.",
          next_action: "Phase 1 ke liye aaj ka 1 task fix karo (1 hour)."
        };

      default:
        return {
          intent,
          confidence,
          clarified_problem: "Aap kisi important cheez ko lekar confusion me ho.",
          recommended_direction: "Problem ko clearly define karo aur next smallest step choose karo.",
          next_action: "1 sentence me apni main problem likho."
        };
    }
  }

  // English responses
  switch (intent) {
    case "career":
      return {
        intent,
        confidence,
        clarified_problem: "You are confused about your career direction.",
        recommended_direction: "Align your strengths, interests, and market demand first.",
        next_action: "List 3 skills to improve and pick 1 career track to explore this week."
      };

    case "education":
      return {
        intent,
        confidence,
        clarified_problem: "You need clarity about studying or exams.",
        recommended_direction: "Break the syllabus into small parts and follow a daily plan.",
        next_action: "Pick 1 topic today and do 45 minutes of focused study."
      };

    case "money":
      return {
        intent,
        confidence,
        clarified_problem: "You are unclear about how to earn or grow income.",
        recommended_direction: "Build one high-value skill, then choose an income model.",
        next_action: "Pick 1 skill and create a 7-day learning plan."
      };

    case "fear":
      return {
        intent,
        confidence,
        clarified_problem: "Fear is blocking your decision clarity.",
        recommended_direction: "Separate facts from assumptions before deciding.",
        next_action: "Write your biggest fear and define one controllable step."
      };

    case "decision":
      return {
        intent,
        confidence,
        clarified_problem: "You need to choose between options but your criteria are unclear.",
        recommended_direction: "Decide based on interest, scope, and effort.",
        next_action: "Score each option from 1–10 and pick the top one."
      };

    case "planning":
      return {
        intent,
        confidence,
        clarified_problem: "You want a roadmap but the steps are unclear.",
        recommended_direction: "Build in phases: learn → build → launch.",
        next_action: "Pick one task for Phase 1 and execute it for 1 hour today."
      };

    default:
      return {
        intent,
        confidence,
        clarified_problem: "You are confused about something important.",
        recommended_direction: "Define the real problem and choose the smallest next step.",
        next_action: "Write your main problem in one sentence."
      };
  }
}

/* ✅ LocalStorage Decision History */
const HISTORY_KEY = "eduguruai_decision_history_v1";

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function pushToHistory(record) {
  const history = loadHistory();
  history.unshift(record); // latest first
  saveHistory(history);
}

function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

/* ✅ Render History (Last 5) */
function renderHistoryBlock() {
  const history = loadHistory().slice(0, 5);
  if (history.length === 0) {
    return "No saved decisions yet.\n";
  }

  let block = "Recent Decision History (Last 5)\n------------------------------\n";
  history.forEach((h, idx) => {
    block += `#${idx + 1} • ${new Date(h.timestamp).toLocaleString()}\n`;
    block += `Q: ${h.question}\n`;
    block += `Intent: ${h.intent} | Confidence: ${h.confidence}%\n`;
    block += `Next Action: ${h.next_action}\n\n`;
  });

  return block;
}

/* ✅ Multi-question engine */
function multiQuestionEngine(input) {
  const questions = splitQuestions(input);

  const responses = questions.map((q) => {
    const clarity = clarityEngine(q);
    return { question: q, clarity };
  });

  return { count: responses.length, responses };
}

/* ✅ Main Action */
function getClarity() {
  const input = document.getElementById("answers").value;
  const output = document.getElementById("output");

  if (!input.trim()) {
    output.innerText = "Please enter a question.";
    return;
  }

  const result = multiQuestionEngine(input);

  let report = `EduGuruAI Clarity Report\n=========================\n`;
  report += `Questions detected: ${result.count}\n`;
  report += `Mode: Multi-Question Queue ✅\n\n`;

  lastSpeechText = "";

  result.responses.forEach((r, i) => {
    report += `Processing Q${i + 1}/${result.count}...\n`;
    report += `Q${i + 1}: ${r.question}\n`;
    report += `• Intent: ${r.clarity.intent}\n`;
    report += `• Confidence Score: ${r.clarity.confidence}%\n`;
    report += `• Core Issue: ${r.clarity.clarified_problem}\n`;
    report += `• Direction: ${r.clarity.recommended_direction}\n`;
    report += `• Next Action: ${r.clarity.next_action}\n\n`;

    // Save to Decision History
    pushToHistory({
      timestamp: nowISO(),
      question: r.question,
      intent: r.clarity.intent,
      confidence: r.clarity.confidence,
      core_issue: r.clarity.clarified_problem,
      direction: r.clarity.recommended_direction,
      next_action: r.clarity.next_action
    });

    lastSpeechText += `Question ${i + 1}. ${r.clarity.recommended_direction}. Next step: ${r.clarity.next_action}. `;
  });

  report += `✅ Saved to Decision History (LocalStorage)\n\n`;
  report += renderHistoryBlock();

  output.innerText = report;
}

/* ✅ Demo Prompts */
function setDemoPrompt(type) {
  const prompts = {
    career: "I am confused about my career. Should I choose coding or business?",
    study: "I can't focus on study and I forget things quickly. What should I do?",
    decision: "I have too many options and I can't decide which is best for me."
  };

  document.getElementById("answers").value = prompts[type] || "";
  getClarity();
}

/* ✅ Clear History Button Support */
function clearDecisionHistoryUI() {
  clearHistory();
  document.getElementById("output").innerText =
    "✅ Decision History cleared.\nNow ask a question again to generate a new clarity report.";
}

/* ✅ Voice Output */
function speak(text) {
  if (!("speechSynthesis" in window)) return;

  const lang = detectLanguage(text);
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function speakLast() {
  if (!lastSpeechText) {
    alert("No clarity available to speak.");
    return;
  }
  speak(lastSpeechText);
}

/* ✅ Voice Input */
let recognition;
function startVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice recognition not supported.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "hi-IN"; // Hindi + Hinglish best
  recognition.start();

  document.getElementById("output").innerText = "🎙️ Listening...";

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("answers").value = transcript;
    getClarity();
  };
}