const decisionHistory = [];

function saveDecision(input, output){
  decisionHistory.push({
    id: decisionHistory.length+1,
    timestamp: new Date().toLocaleString(),
    user_input: input,
    system_output: output
  });
}

function showHistory(){
  const history = decisionHistory;
  const historyDiv = document.getElementById("history");
  let html = "<h3>Thinking Timeline</h3>";
  history.forEach(item=>{
    html += `<div class="card">
      <b>#${item.id} - ${item.timestamp}</b><br/>
      <b>User Input:</b> ${item.user_input}<br/>
      <b>System Output:</b>
      <pre>${JSON.stringify(item.system_output, null, 2)}</pre>
    </div>`;
  });
  historyDiv.innerHTML = html;
}