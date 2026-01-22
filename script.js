0let lastSpokenText = "";
let decisionHistory = JSON.parse(localStorage.getItem("decisionHistory") || "[]");

/* ------------------ VOICE INPUT ------------------ */
function startVoice() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice recognition not supported.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-IN";
  recognition.start();

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    const input = document.getElementById("answers");
    input.value = input.value ? input.value + " " + text : text;
  };
}

/* ------------------ STATUS BAR ------------------ */
function showStatus(msg = "EduGuruAI is analyzing…") {
  const bar = document.getElementById("statusBar");
  bar.classList.remove("hidden");
  bar.querySelector(".statusText").innerText = msg;
}

function hideStatus() {
  document.getElementById("statusBar").classList.add("hidden");
}

/* ------------------ CORE ENGINE ------------------ */
function getClarity() {
  const input = document.getElementById("answers").value.trim();
  if (!input) return;

  showStatus();

  setTimeout(() => {
    const questions = splitQuestions(input);
    const responses = questions.map(analyzeQuestion);

    const result = { responses };
    renderCards(result);

    decisionHistory.push(result);
    localStorage.setItem("decisionHistory", JSON.stringify(decisionHistory));

    lastSpokenText = responses
      .map(r => `${r.clarity.recommended_direction}. Next: ${r.clarity.next_action}`)
      .join(". ");

    hideStatus();
  }, 700);
}

/* ------------------ QUESTION SPLIT ------------------ */
function splitQuestions(text) {
  if (text.includes("?")) {
    return text.split("?").map(q => q.trim()).filter(Boolean);
  }
  return [text];
}

/* ------------------ AI LOGIC (SIMULATED) ------------------ */
function analyzeQuestion(q) {
  return {
    question: q,
    clarity: {
      intent: detectIntent(q),
      confidence: Math.floor(65 + Math.random() * 30),
      clarified_problem: "You are feeling unclear and need structured thinking.",
      recommended_direction: "Pause and focus on clarity before action.",
      next_action: "Write 3 options and choose the most realistic one."
    }
  };
}

function detectIntent(q) {
  const t = q.toLowerCase();
  if (t.includes("career")) return "Career";
  if (t.includes("study")) return "Education";
  if (t.includes("decision")) return "Decision";
  return "General";
}

/* ------------------ UI RENDER ------------------ */
function renderCards(result) {
  const wrap = document.getElementById("outputCards");
  wrap.innerHTML = "";

  result.responses.forEach((r, i) => {
    const level =
      r.clarity.confidence >= 80 ? "High" :
      r.clarity.confidence >= 65 ? "Medium" : "Low";

    const card = document.createElement("div");
    card.className = "responseCard";

    card.innerHTML = `
      <div class="cardHeader">
        <div class="questionTitle">Q${i + 1}: ${r.question}</div>
        <div class="badges">
          <span class="badge">${r.clarity.intent}</span>
          <span class="badge good">${level} • ${r.clarity.confidence}%</span>
        </div>
      </div>
      <div class="cardBody">
        <p><strong>Core Issue:</strong> ${r.clarity.clarified_problem}</p>
        <p><strong>Direction:</strong> ${r.clarity.recommended_direction}</p>
        <p><strong>Next Action:</strong> ✅ ${r.clarity.next_action}</p>
      </div>
    `;

    wrap.appendChild(card);
  });
}

/* ------------------ QUICK ACTIONS ------------------ */
function quickAction(mode) {
  const box = document.getElementById("answers");
  if (!box.value) return;

  if (mode === "short") box.value += "\nMake it shorter.";
  if (mode === "steps") box.value += "\nExplain step by step.";
  if (mode === "actions") box.value += "\nGive 3 next actions.";

  getClarity();
}

/* ------------------ DEMO ------------------ */
function setDemoPrompt(type) {
  const demos = {
    career: "I am confused about my career path.",
    study: "I don’t know how to study effectively.",
    decision: "I need help making an important decision."
  };
  document.getElementById("answers").value = demos[type];
  getClarity();
}

/* ------------------ SPEECH OUTPUT ------------------ */
function speakLast() {
  if (!lastSpokenText) return;
  const msg = new SpeechSynthesisUtterance(lastSpokenText);
  speechSynthesis.speak(msg);
}

/* ------------------ CLEAR ------------------ */
function clearDecisionHistoryUI() {
  localStorage.removeItem("decisionHistory");
  document.getElementById("outputCards").innerHTML = "";
}
/* ------------------ URL SHARE DEMO ------------------ */
function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");

  if (q) {
    const decoded = decodeURIComponent(q.replace(/\+/g, " "));
    const input = document.getElementById("answers");
    input.value = decoded;

    // Auto run clarity after short delay
    setTimeout(() => {
      getClarity();
    }, 400);
  }
}

// Run on page load
window.addEventListener("load", loadFromURL);