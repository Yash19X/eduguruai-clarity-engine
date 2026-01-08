function getClarity() {
  const userInput = document.getElementById("answers").value;
  const output = document.getElementById("output");

  if (!userInput.trim()) {
    output.innerText = "Please describe your situation honestly.";
    return;
  }

  output.innerText = "Analyzing your intelligence...\n\n";

  setTimeout(() => {
    output.innerText =
`CLARITY SUMMARY
You are experiencing confusion due to lack of structured guidance, external pressure, and unclear goals.

KEY STRENGTHS
• Curiosity to understand yourself
• Awareness of confusion (this is rare)
• Desire to improve

ROOT PROBLEM
• No clarity framework
• Too many options, no direction
• Fear of wrong decisions

CLEAR DIRECTION
Focus on building core thinking skills, digital literacy, and one high-leverage skill instead of chasing everything.

7-DAY ACTION PLAN
Day 1–2: Self-assessment & goal writing  
Day 3: Learn one future-ready skill (AI / problem solving)  
Day 4: Apply knowledge in a small task  
Day 5: Reflect & refine direction  
Day 6–7: Build consistency & clarity habit

NEXT STEP
This clarity engine becomes the foundation of EduGuruAI – a Human Intelligence OS.`;
  }, 1200);
}
document.getElementById("answers").value = "";
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