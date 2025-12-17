-- categories
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  label TEXT,
  icon TEXT,
  description TEXT,
  order_index INT
);

-- sections
CREATE TABLE sections (
  id SERIAL PRIMARY KEY,
  category_id TEXT REFERENCES categories(id),
  title TEXT,
  order_index INT
);

-- items (shortcut, concept, node, todo 등 공통)
CREATE TABLE items (
  id TEXT PRIMARY KEY,
  section_id INT REFERENCES sections(id),
  type TEXT,
  title TEXT,
  description TEXT,
  data JSONB,
  tags TEXT[],
  is_completed BOOLEAN,
  github_url TEXT,
  youtube_url TEXT,
  image_url TEXT,
  model_url TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
