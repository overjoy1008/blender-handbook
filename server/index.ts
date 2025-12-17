import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from './db';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
// Fix: Added 'as any' cast to resolve 'NextHandleFunction' vs 'PathParams' type mismatch in certain TS environments
app.use(express.json() as any);

// Serve static files from dist folder (built frontend)
app.use(express.static(path.join(__dirname, '../dist')));

// --- CATEGORIES ---
app.get('/api/categories', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM categories ORDER BY order_index ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- SECTIONS ---
app.get('/api/sections', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM sections ORDER BY order_index ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/sections', async (req, res) => {
  try {
    const { category_id, title, order_index } = req.body;
    const { rows } = await query(
      'INSERT INTO sections (category_id, title, order_index) VALUES ($1, $2, $3) RETURNING *',
      [category_id, title, order_index || 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create section' });
  }
});

app.patch('/api/sections/:id', async (req, res) => {
  try {
    const { title } = req.body;
    const { id } = req.params;
    const { rows } = await query(
      'UPDATE sections SET title = $1 WHERE id = $2 RETURNING *',
      [title, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update section' });
  }
});

app.delete('/api/sections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Database should ideally have ON DELETE CASCADE for items, but manually ensuring here
    await query('DELETE FROM items WHERE section_id = $1', [id]);
    await query('DELETE FROM sections WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete section' });
  }
});

// --- ITEMS ---
app.get('/api/items', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM items ORDER BY section_id ASC, order_index ASC');
    const flatRows = rows.map(row => {
      const { data, ...rest } = row;
      return { ...rest, ...data };
    });
    res.json(flatRows);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/items', async (req, res) => {
  try {
    const { section_id, type, title, description, tags, github_url, youtube_url, image_url, model_url, order_index, ...data } = req.body;
    const text = `
      INSERT INTO items (section_id, type, title, description, tags, github_url, youtube_url, image_url, model_url, data, order_index, is_completed, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, false, NOW())
      RETURNING *
    `;
    const values = [section_id, type, title, description, tags || [], github_url, youtube_url, image_url, model_url, data, order_index || 0];
    const { rows } = await query(text, values);
    const { data: savedData, ...rest } = rows[0];
    res.status(201).json({ ...rest, ...savedData });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

app.patch('/api/items/:id', async (req, res) => {
  try {
    const { section_id, type, title, description, tags, github_url, youtube_url, image_url, model_url, order_index, ...data } = req.body;
    const { id } = req.params;
    const text = `
      UPDATE items 
      SET section_id = $1, title = $2, description = $3, tags = $4, github_url = $5, 
          youtube_url = $6, image_url = $7, model_url = $8, data = $9, order_index = $10
      WHERE id = $11 RETURNING *
    `;
    const values = [section_id, title, description, tags || [], github_url, youtube_url, image_url, model_url, data, order_index || 0, id];
    const { rows } = await query(text, values);
    if (rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    const { data: savedData, ...rest } = rows[0];
    res.json({ ...rest, ...savedData });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM items WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

app.patch('/api/todo/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const { isCompleted } = req.body;
    const { rows } = await query('UPDATE items SET is_completed = $1 WHERE id = $2 RETURNING *', [isCompleted, id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    const { data, ...rest } = rows[0];
    res.json({ ...rest, ...data });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle todo' });
  }
});

// Catch-all route for SPA - serve index.html for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});