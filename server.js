import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import MemoryClient from 'mem0ai';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4180;

const mem0 = process.env.MEM0_API_KEY
  ? new MemoryClient({ apiKey: process.env.MEM0_API_KEY })
  : null;
if (!mem0) console.warn('MEM0_API_KEY not set — taste memory will stay local-only (see .env.example).');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/memory', async (req, res) => {
  if (!mem0) return res.status(503).json({ error: 'mem0 not configured' });
  const { userId, text } = req.body || {};
  if (!userId || !text) return res.status(400).json({ error: 'userId and text are required' });
  try {
    await mem0.add([{ role: 'user', content: text }], { userId });
    res.json({ ok: true });
  } catch (err) {
    console.error('mem0 add failed:', err.message);
    res.status(502).json({ error: 'mem0 add failed' });
  }
});

app.get('/api/memory/search', async (req, res) => {
  if (!mem0) return res.status(503).json({ error: 'mem0 not configured' });
  const { userId, q } = req.query;
  if (!userId || !q) return res.status(400).json({ error: 'userId and q are required' });
  try {
    const response = await mem0.search(String(q), { filters: { user_id: String(userId) } });
    const list = Array.isArray(response) ? response : (response?.results || response?.memories || []);
    res.json({ results: list.map(r => r.memory || r.text || String(r)) });
  } catch (err) {
    console.error('mem0 search failed:', err.message);
    res.status(502).json({ error: 'mem0 search failed' });
  }
});

app.listen(PORT, () => console.log(`Desi Wedding running at http://localhost:${PORT}`));
