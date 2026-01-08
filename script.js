
function getClarity() {
  const input = document.getElementById("answers").value.toLowerCase();
  const output = document.getElementById("output");

  if (!input.trim()) {
    output.innerText = "Please describe your situation honestly.";
    return;
  }

  output.innerText = "Analyzing your intelligence...\n\n";

  setTimeout(() => {

    let response = "";

    if (input.includes("career") || input.includes("job")) {
      response = `
CLARITY TYPE: Career Confusion

You are unsure about long-term direction because of too many career options and fear of wrong choices.

FOCUS:
• Stop comparing paths
• Identify one interest + one market skill

ACTION (7 Days):
Day 1–2: Research 2 careers only  
Day 3–4: Skill gap analysis  
Day 5–7: Start one micro-skill project
`;
    } 
    else if (input.includes("skill") || input.includes("learn")) {
      response = `
CLARITY TYPE: Skill Confusion

You want to learn but don’t know what is useful or future-ready.

FOCUS:
• One core skill
• One supporting skill

ACTION:
• Pick one high-leverage skill (AI / Coding / Communication)
• Practice daily for 30 minutes
`;
    }
    else if (input.includes("fear") || input.includes("pressure")) {
      response = `
CLARITY TYPE: Emotional Pressure

Your confusion is emotional, not intellectual.

FOCUS:
• Reduce noise
• Build inner clarity

ACTION:
• Journaling (10 min/day)
• One small win daily
• Reduce social comparison
`;
    }
    else {
      response = `
CLARITY TYPE: General Life Confusion

You lack a structured framework, not intelligence.

FOCUS:
• Self-awareness
• Direction before speed

ACTION:
• Write goals
• Identify strengths
• Build one habit for clarity
`;
    }

    output.innerText = response;

  }, 1000);
}