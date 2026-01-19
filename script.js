let lastSpeechText = "";

/* ---------- LANGUAGE DETECTION ---------- */
function detectLanguage(text) {
  // If any Devanagari characters found → Hindi
  return /[\u0900-\u097F]/.test(text) ? "hi-IN" : "en-US";
}

/* ---------- QUESTION SPLITTER ---------- */
function splitQuestions(text) {
  return text
    .replace(/\?/g, "?|")
    .split(/\band\b|\balso\b|\baur\b|\|/i)
    .map(q => q.trim())
    .filter(q => q.length > 3);
}

/* ---------- INTENT DETECTION ---------- */
function detectIntent(text) {
  const lower = text.toLowerCase();

  if (lower.includes("confused") || lower.includes("samajh") || lower.includes("clear"))
    return "confusion";

  if (lower.includes("fear") || lower.includes("dar") || lower.includes("scared"))
    return "fear";

  if (lower.includes("decide") || lower.includes("choose") || lower.includes("nirnay"))
    return "decision";

  if (lower.includes("plan") || lower.includes("roadmap") || lower.includes("yojana"))
    return "planning";

  return "learning";
}

/* ---------- CLARITY ENGINE ---------- */
function clarityEngine(question, lang) {
  const intent = detectIntent(question);

  if (lang === "hi-IN") {
    return {
      clarified_problem: `मुख्य समस्या ${intent} से जुड़ी स्पष्टता की कमी है।`,
      recommended_direction: "कार्य से पहले स्पष्टता पर ध्यान दें।",
      next_action: "समस्या को छोटे हिस्सों में बाँटें।"
    };
  }

  return {
    clarified_problem: `The core issue is a lack of clarity related to ${intent}.`,
    recommended_direction: "Clarity comes before action. Simplify first.",
    next_action: "Break the situation into smaller parts."
  };
}

/* ---------- MULTI QUESTION ENGINE ---------- */
function multiQuestionEngineV2(input, lang) {
  const questions = splitQuestions(input);
  const responses = questions.map(q => ({
    question: q,
    clarity: clarityEngine(q, lang)
  }));
  return { count: responses.length, responses };
}

/* ---------- MAIN ---------- */
function getClarity() {
  const userInput = document.getElementById("answers").value;
  const output = document.getElementById("output");

  if (!userInput.trim()) {
    output.innerText = "Please enter your question or confusion.";
    return;
  }

  const lang = detectLanguage(userInput);
  const result = multiQuestionEngineV2(userInput, lang);

  let report = `EduGuruAI Clarity Report\n-------------------------\n`;
  report += `Questions detected: ${result.count}\n\n`;

  lastSpeechText = "";

  result.responses.forEach((r, i) => {
    report += `Q${i + 1}: ${r.question}\n`;
    report += `• Core Issue: ${r.clarity.clarified_problem}\n`;
    report += `• Direction: ${r.clarity.recommended_direction}\n`;
    report += `• Next Action: ${r.clarity.next_action}\n\n`;

    lastSpeechText +=
      `Question ${i + 1}. ${r.clarity.recommended_direction}. Next step: ${r.clarity.next_action}. `;
  });

  output.innerText = report;
  document.getElementById("answers").value = "";
}

/* ---------- VOICE INPUT ---------- */
let recognition;

function startVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice recognition not supported.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-US"; // works for Hindi speech too
  recognition.start();

  recognition.onstart = () => {
    document.getElementById("output").innerText = "🎙️ Listening...";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("answers").value = transcript;
    getClarity();
  };
}

/* ---------- VOICE OUTPUT ---------- */
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