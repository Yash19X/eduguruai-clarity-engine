// sdk/index.js
import axios from "axios";

const BASE_URL = "https://api.eduguruai.com/v1";

export async function getClarity(input, userId) {
  const res = await axios.post(`${BASE_URL}/clarity`, {
    text: input,
    userId
  });
  return res.data;
}

export async function getMultiQuestionClarity(input, userId) {
  const res = await axios.post(`${BASE_URL}/multi-question`, {
    text: input,
    userId
  });
  return res.data;
}

export async function getDecisionHistory(userId) {
  const res = await axios.get(`${BASE_URL}/decision-history/${userId}`);
  return res.data;
}