function splitQuestions(text) {
  return text
    .replace(/\?/g, "?|")
    .split(/\band\b|\balso\b|\baur\b|\|/i)
    .map(q => q.trim())
    .filter(q => q.length > 3);
}

function detectIntent(text) {
  const lower = text.toLowerCase();

  if (lower.includes("confused") || lower.includes("not sure"))
    return "confusion";

  if (lower.includes("fear") || lower.includes("worried") || lower.includes("scared"))
    return "fear";

  if (lower.includes("decide") || lower.includes("choose"))
    return "decision";

  if (lower.includes("plan") || lower.includes("roadmap"))
    return "planning";

  return "learning";
}

function clarityEngine(question) {
  const intent = detectIntent(question);

  const problem = `The core issue is a lack of clarity related to ${intent}.`;

  const options = [
    "Break the situation into smaller parts",
    "Identify what you can control right now",
    "Take one small, low-risk action"
  ];

  const direction = "Clarity comes before action. Simplify first.";

  return {
    clarified_problem: problem,
    structured_options: options,
    recommended_direction: direction,
    next_action: options[0]
  };
}

function multiQuestionEngineV2(input) {
  const questions = splitQuestions(input);

  const responses = questions.map(q => ({
    question: q,
    clarity: clarityEngine(q)
  }));

  return {
    type: "multi-question",
    count: responses.length,
    responses
  };
}

function getClarity() {
  const userInput = document.getElementById("answers").value;
  const output = document.getElementById("output");

  if (!userInput.trim()) {
    output.innerText = "Please enter your question or confusion.";
    return;
  }

  const result = multiQuestionEngineV2(userInput);

  let report = `EduGuruAI Clarity Report\n-------------------------\n`;
  report += `Questions detected: ${result.count}\n\n`;

  result.responses.forEach((r, i) => {
    report += `Q${i + 1}: ${r.question}\n`;
    report += `• Core Issue: ${r.clarity.clarified_problem}\n`;
    report += `• Direction: ${r.clarity.recommended_direction}\n`;
    report += `• Next Action: ${r.clarity.next_action}\n\n`;
  });

  output.innerText = report;

  speak(
    result.responses
      .map(
        (r, i) =>
          `Question ${i + 1}. ${r.clarity.recommended_direction}. Next step: ${r.clarity.next_action}.`
      )
      .join(" ")
  );

  document.getElementById("answers").value = "";
}

/* ---------- VOICE INPUT ---------- */

let recognition;

function startVoice() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    alert("Voice recognition not supported in this browser.");
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onstart = () => {
    document.getElementById("output").innerText =
      "🎙️ Listening... Speak now.";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("answers").value = transcript;
    getClarity();
  };

  recognition.onerror = (event) => {
    document.getElementById("output").innerText =
      "Voice error: " + event.error;
  };
}

/* ---------- VOICE OUTPUT ---------- */

function speak(text) {
  if (!("speechSynthesis" in window)) {
    console.log("Text-to-speech not supported");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}