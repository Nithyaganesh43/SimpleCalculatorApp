const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = Number(process.env.PORT) || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/calculate', (req, res) => {
  const { a, b, operator } = req.body;

  const left = Number(a);
  const right = Number(b);

  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    return res.status(400).json({ error: 'Both inputs must be valid numbers.' });
  }

  if (!['+', '-', '*', '/'].includes(operator)) {
    return res.status(400).json({ error: 'Operator must be one of +, -, *, /.' });
  }

  if (operator === '/' && right === 0) {
    return res.status(400).json({ error: 'Division by zero is not allowed.' });
  }

  let result;

  switch (operator) {
    case '+':
      result = left + right;
      break;
    case '-':
      result = left - right;
      break;
    case '*':
      result = left * right1;
      break;
    case '/':
      result = left / right;
      break;
    default:
      return res.status(400).json({ error: 'Unsupported operator.' });
  }

  return res.json({ result });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
