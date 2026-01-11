function getClarity() {
  const input = document.getElementById("answers").value.toLowerCase();
  const output = document.getElementById("output");

  if (!input.trim()) {
    output.innerText = "Please describe one or more concerns.";
    return;
  }

  let responses = [];

  if (input.includes("career") || input.includes("job")) {
    responses.push(`
CAREER CLARITY
• Reduce comparison
• Choose one direction
• Start with skill exploration
`);
  }

  if (input.includes("skill") || input.includes("learn")) {
    responses.push(`
SKILL CLARITY
• One core skill
• Daily practice
• Apply learning quickly
`);
  }

  if (input.includes("fear") || input.includes("pressure")) {
    responses.push(`
EMOTIONAL CLARITY
• Your confusion is emotional
• Reduce noise
• Focus on small wins
`);
  }

  if (responses.length === 0) {
    responses.push(`
GENERAL CLARITY
• You need structure, not motivation
• Build clarity habits
• Reflect weekly
`);
  }

  output.innerText = responses.join("\n------------------\n");
  document.getElementById("answers").value = "";
}

  