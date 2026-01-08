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