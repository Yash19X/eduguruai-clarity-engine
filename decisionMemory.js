const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY
});

const database = client.database("EduGuruAI");
const container = database.container("DecisionMemory");

// SAVE DECISION
async function saveDecision(record) {
  record.timestamp = new Date().toISOString();
  record.outcome_status = "unknown";

  await container.items.create(record);
  return record;
}

// FETCH RECENT DECISIONS
async function getRecentDecisions(userId, limit = 5) {
  const querySpec = {
    query: "SELECT * FROM c WHERE c.user_id = @userId ORDER BY c.timestamp DESC",
    parameters: [{ name: "@userId", value: userId }]
  };

  const { resources } = await container.items
    .query(querySpec)
    .fetchAll();

  return resources.slice(0, limit);
}

module.exports = {
  saveDecision,
  getRecentDecisions
};