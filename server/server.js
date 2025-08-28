import express from 'express';
import cors from 'cors';
import { getDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// ปรับ CORS ตามจริงได้ภายหลัง
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.json({ ok: true }));

// List
app.get('/api/reports', async (req, res) => {
  try {
    const db = await getDB();
    const rows = await db.all('SELECT * FROM reports ORDER BY id DESC');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed to list' });
  }
});

// Create
app.post('/api/reports', async (req, res) => {
  try {
    const { title, category, details, priority, createdAt } = req.body || {};
    if (!title) return res.status(400).json({ error: 'title required' });
    const db = await getDB();
    const created = createdAt || new Date().toISOString();
    const result = await db.run(
      'INSERT INTO reports (title, category, details, priority, createdAt) VALUES (?,?,?,?,?)',
      [title, category || '', details || '', priority || 'Medium', created]
    );
    res.json({ id: result.lastID, ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed to save' });
  }
});

// Delete
app.delete('/api/reports/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'invalid id' });
    const db = await getDB();
    await db.run('DELETE FROM reports WHERE id = ?', [id]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed to delete' });
  }
});

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
