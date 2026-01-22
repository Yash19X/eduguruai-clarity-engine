let lastSpeechText = "";

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

/* ✅ Much stronger intent detection */
function detectIntent(text) {
  const t = text.toLowerCase();

  // Career
  if (t.includes("career") || t.includes("job") || t.includes("profession") || t.includes("placement") || t.includes("future"))
    return "career";

  // Education / Study
  if (t.includes("study") || t.includes("exam") || t.includes("school") || t.includes("college") || t.includes("subject"))
    return "education";

  // Money / Business
  if (t.includes("money") || t.includes("earn") || t.includes("business") || t.includes("startup") || t.includes("income"))
    return "money";

  // Stress / Fear
  if (t.includes("fear") || t.includes("scared") || t.includes("worried") || t.includes("anxiety") || t.includes("stress") || t.includes("dar"))
    return "fear";

  // Decision / Choose
  if (t.includes("choose") || t.includes("select") || t.includes("decide") || t.includes("option") || t.includes("which"))
    return "decision";

  // Planning
  if (t.includes("plan") || t.includes("roadmap") || t.includes("strategy") || t.includes("how to"))
    return "planning";

  // Default
  return "general";
}

/* ✅ Real Clarity Engine responses based on intent */
function clarityEngine(question) {
  const lang = detectLanguage(question);
  const intent = detectIntent(question);

  if (lang === "hi-IN") {
    switch (intent) {
      case "career":
        return {
          clarified_problem: "Aap career direction ko lekar confused hain.",
          recommended_direction: "Pehle apni strength + interest + market demand align karo.",
          next_action: "3 skills likho jo aap improve kar sakte ho aur 1 career track choose karo."
        };

      case "education":
        return {
          clarified_problem: "Aap padhai / exam ko lekar clarity nahi paa rahe ho.",
          recommended_direction: "Syllabus ko chhote parts me divide karke daily plan banao.",
          next_action: "Aaj ka 1 topic select karo aur 45 minutes deep study karo."
        };

      case "money":
        return {
          clarified_problem: "Aap earning / money goal ko lekar unclear ho.",
          recommended_direction: "Skill-first approach lo, phir income model choose karo.",
          next_action: "1 skill choose karo (coding/design/sales) aur 7 din ka learning plan banao."
        };

      case "fear":
        return {
          clarified_problem: "Aapka fear aapki decision clarity ko block kar raha hai.",
          recommended_direction: "Facts aur assumptions ko alag karo, phir next step choose karo.",
          next_action: "Apna biggest fear likho aur uska smallest controllable step define karo."
        };

      case "decision":
        return {
          clarified_problem: "Aapko options me se choose karna hai par criteria clear nahi hai.",
          recommended_direction: "3 criteria set karo: interest, scope, effort.",
          next_action: "Har option ko 1–10 score do aur top 1 choose karo."
        };

      case "planning":
        return {
          clarified_problem: "Aapko roadmap chahiye but steps unclear hain.",
          recommended_direction: "Roadmap ko 3 phases me divide karo: learn → build → launch.",
          next_action: "Phase 1 ke liye aaj ka 1 task fix karo (1 hour)."
        };

      default:
        return {
          clarified_problem: "Aap kisi important cheez ko lekar confusion me ho.",
          recommended_direction: "Problem ko clearly define karo aur next smallest step choose karo.",
          next_action: "1 sentence me apni main problem likho."
        };
    }
  }

  // ✅ English responses
  switch (intent) {
    case "career":
      return {
        clarified_problem: "You are confused about your career direction.",
        recommended_direction: "Align your strengths, interests, and market demand first.",
        next_action: "List 3 skills to improve and pick 1 career track to explore this week."
      };

    case "education":
      return {
        clarified_problem: "You need clarity about studying or exams.",
        recommended_direction: "Break the syllabus into small parts and follow a daily plan.",
        next_action: "Pick 1 topic today and do 45 minutes of focused study."
      };

    case "money":
      return {
        clarified_problem: "You are unclear about how to earn or grow income.",
        recommended_direction: "Build one high-value skill, then choose an income model.",
        next_action: "Pick 1 skill and create a 7-day learning plan."
      };

    case "fear":
      return {
        clarified_problem: "Fear is blocking your decision clarity.",
        recommended_direction: "Separate facts from assumptions before deciding.",
        next_action: "Write your biggest fear and define one controllable step."
      };

    case "decision":
      return {
        clarified_problem: "You need to choose between options but your criteria are unclear.",
        recommended_direction: "Decide based on interest, scope, and effort.",
        next_action: "Score each option from 1–10 and pick the top one."
      };

    case "planning":
      return {
        clarified_problem: "You want a roadmap but the steps are unclear.",
        recommended_direction: "Build in phases: learn → build → launch.",
        next_action: "Pick one task for Phase 1 and execute it for 1 hour today."
      };

    default:
      return {
        clarified_problem: "You are confused about something important.",
        recommended_direction: "Define the real problem and choose the smallest next step.",
        next_action: "Write your main problem in one sentence."
      };
  }
}

/* Multi-question engine */
function multiQuestionEngine(input) {
  const questions = splitQuestions(input);
  const responses = questions.map(q => ({
    question: q,
    clarity: clarityEngine(q)
  }));

  return { count: responses.length, responses };
}

function getClarity() {
  const input = document.getElementById("answers").value;
  const output = document.getElementById("output");

  if (!input.trim()) {
    output.innerText = "Please enter a question.";
    return;
  }

  const result = multiQuestionEngine(input);

  let report = `EduGuruAI Clarity Report\n-------------------------\n`;
  report += `Questions detected: ${result.count}\n\n`;

  lastSpeechText = "";

  result.responses.forEach((r, i) => {
    report += `Q${i + 1}: ${r.question}\n`;
    report += `• Core Issue: ${r.clarity.clarified_problem}\n`;
    report += `• Direction: ${r.clarity.recommended_direction}\n`;
    report += `• Next Action: ${r.clarity.next_action}\n\n`;

    lastSpeechText += `Question ${i + 1}. ${r.clarity.recommended_direction}. Next step: ${r.clarity.next_action}. `;
  });

  output.innerText = report;
}

/* Voice Output */
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

/* Voice Input */
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