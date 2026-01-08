async function getClarity() {
  const userInput = document.getElementById("answers").value;
  document.getElementById("output").innerText = "Analyzing your intelligence...";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": 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"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are EduGuruAI, a Human Intelligence OS Clarity Engine. Convert student confusion into clear direction, strengths, risks, and a 7-day action plan."
        },
        {
          role: "user",
          content: userInput
        }
      ]
    })
  });

  const data = await response.json();
  document.getElementById("output").innerText =
    data.choices[0].message.content;
}
