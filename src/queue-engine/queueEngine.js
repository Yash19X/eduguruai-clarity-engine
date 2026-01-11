function classifyIntent(text) {
  if (text.includes("career")) return "career";
  if (text.includes("AI") || text.includes("MBA")) return "education";
  return "general";
}
// Split input into multiple logical questions
function splitQuestions(text) {
  return text
    .split(/and|,|\?|\.|\n/gi)
    .map(q => q.trim())
    .filter(q => q.length > 5);
}

// Queue Engine
function queueEngine(userInput, clarityEngineFn) {
  const questions = splitQuestions(userInput);
  const results = [];

  for (let i = 0; i < questions.length; i++) {
  const question = questions[i];

  const clarity = clarityEngineFn(question);
  const intent = classifyIntent(question);

  results.push({
    order: i + 1,
    intent: intent,
    question: question,
    clarity_output: clarity
  });
}

  return {
    total_questions: results.length,
    processed_in_order: true,
    responses: results
  };
}