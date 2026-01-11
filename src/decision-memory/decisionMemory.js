// Global Decision Store
const decisionHistory = [];

// Save each thinking step
function saveDecision(input, output) {
  const record = {
    id: decisionHistory.length + 1,
    timestamp: new Date().toLocaleString(),
    user_input: input,
    system_output: output
  };

  decisionHistory.push(record);
  return record;
}

// Get full decision history
function getDecisionHistory() {
  return decisionHistory;
}