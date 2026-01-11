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
    const clarity = clarityEngineFn(questions[i]);
    results.push({
      order: i + 1,
      original_question: questions[i],
      clarity_output: clarity
    });
  }

  return {
    total_questions: results.length,
    processed_in_order: true,
    responses: results
  };
}