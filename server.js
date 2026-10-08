const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const app = express();
const port = Number(process.env.PORT || 3001);
const rootDir = __dirname;
const allowedOrigins = new Set(['http://localhost:8000', 'http://127.0.0.1:8000']);

const memoryUsers = [];
const memoryPosts = [
  {
    id: 1,
    author: 'Comunidade FemCare',
    content: 'Bem-vinda ao fórum! Aqui vocês podem compartilhar dúvidas, experiências e apoio mútuo.',
    createdAt: new Date().toISOString()
  }
];

let dbPool = null;
let dbMode = 'memory';

async function initDatabase() {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME;

  if (!host || !user || !database) {
    console.log('MySQL não configurado. Usando armazenamento em memória para demo do fórum.');
    return null;
  }

  try {
    dbPool = mysql.createPool({
      host,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4'
    });

    await dbPool.query('SELECT 1 + 1 AS result');
    dbMode = 'mysql';
    console.log('Conexão MySQL estabelecida.');

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(180) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        author_name VARCHAR(120) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    return dbPool;
  } catch (error) {
    console.warn('Falha ao conectar ao MySQL:', error.message);
    console.log('Usando armazenamento em memória como fallback para a demo.');
    dbPool = null;
    dbMode = 'memory';
    return null;
  }
}

function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

async function findUserByEmail(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (dbMode === 'mysql' && dbPool) {
    const [rows] = await dbPool.query('SELECT * FROM users WHERE LOWER(email) = ?', [normalizedEmail]);
    return rows[0] || null;
  }

  return memoryUsers.find((user) => user.email.toLowerCase() === normalizedEmail) || null;
}

async function createUser({ name, email, passwordHash }) {
  const normalizedName = String(name || '').trim();
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (dbMode === 'mysql' && dbPool) {
    const [result] = await dbPool.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [normalizedName, normalizedEmail, passwordHash]
    );

    return {
      id: result.insertId,
      name: normalizedName,
      email: normalizedEmail
    };
  }

  const user = {
    id: Date.now(),
    name: normalizedName,
    email: normalizedEmail,
    password_hash: passwordHash
  };

  memoryUsers.push(user);
  return user;
}

async function getPosts() {
  if (dbMode === 'mysql' && dbPool) {
    const [rows] = await dbPool.query('SELECT * FROM posts ORDER BY created_at DESC');
    return rows.map((row) => ({
      id: row.id,
      author: row.author_name,
      content: row.content,
      createdAt: row.created_at
    }));
  }

  return [...memoryPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function addPost(authorName, content) {
  const cleanAuthor = String(authorName || '').trim();
  const cleanContent = String(content || '').trim();

  if (!cleanAuthor || !cleanContent) {
    throw new Error('Conteúdo e autor são obrigatórios.');
  }

  if (dbMode === 'mysql' && dbPool) {
    const [result] = await dbPool.query(
      'INSERT INTO posts (author_name, content) VALUES (?, ?)',
      [cleanAuthor, cleanContent]
    );

    return {
      id: result.insertId,
      author: cleanAuthor,
      content: cleanContent,
      createdAt: new Date().toISOString()
    };
  }

  const post = {
    id: Date.now(),
    author: cleanAuthor,
    content: cleanContent,
    createdAt: new Date().toISOString()
  };

  memoryPosts.unshift(post);
  return post;
}

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.static(rootDir));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'femcare-secret-session',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax'
  }
}));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, mode: dbMode });
});

app.get('/api/session', (req, res) => {
  if (!req.session.user) {
    return res.json({ loggedIn: false, user: null });
  }

  return res.json({ loggedIn: true, user: sanitizeUser(req.session.user) });
});

app.post('/api/register', async (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'A senha precisa ter pelo menos 6 caracteres.' });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: 'E-mail já cadastrado. Tente fazer login.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const user = await createUser({ name, email, passwordHash });

  req.session.user = sanitizeUser(user);
  return res.status(201).json({
    message: 'Cadastro realizado com sucesso!',
    user: sanitizeUser(user)
  });
});

app.post('/api/login', async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');

  if (!email || !password) {
    return res.status(400).json({ message: 'Informe e-mail e senha.' });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
  }

  const passwordMatches = bcrypt.compareSync(password, user.password_hash || user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
  }

  req.session.user = sanitizeUser(user);
  return res.json({
    message: 'Login realizado com sucesso!',
    user: sanitizeUser(user)
  });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logout realizado com sucesso.' });
  });
});

app.get('/api/posts', async (req, res) => {
  const posts = await getPosts();
  res.json({ posts });
});

app.post('/api/posts', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Você precisa estar logado para publicar.' });
  }

  const content = String(req.body.content || '').trim();
  if (!content) {
    return res.status(400).json({ message: 'O conteúdo da mensagem não pode estar vazio.' });
  }

  try {
    const post = await addPost(req.session.user.name, content);
    return res.status(201).json({ message: 'Mensagem publicada com sucesso.', post });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Não foi possível publicar a mensagem.' });
  }
});

app.get('/forum.html', (req, res) => {
  res.sendFile(`${rootDir}/forum.html`);
});

app.get(['/', '/index.html'], (req, res) => {
  return res.sendFile(`${rootDir}/index.html`);
});

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'Rota da API não encontrada.' });
  }

  if (req.path.endsWith('.html')) {
    const filePath = `${rootDir}${req.path}`;
    return res.sendFile(filePath);
  }

  return res.status(404).send('Página não encontrada.');
});

async function startServer() {
  await initDatabase();
  app.listen(port, () => {
    console.log(`FemCare fórum rodando em http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Erro ao iniciar o servidor:', error);
  process.exit(1);
});
