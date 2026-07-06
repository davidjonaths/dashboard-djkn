const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sipka_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'changemeplease';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, 'uploads/') });

app.get('/health', async (_req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    res.json({ ok: true, message: 'Backend MySQL siap' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get('/api/dashboard/summary', async (_req, res) => {
  try {
    const [pegawaiRows] = await pool.query('SELECT COUNT(*) AS total_pegawai FROM pegawai');
    const [unitRows] = await pool.query('SELECT COUNT(DISTINCT unit) AS total_unit FROM pegawai');
    const [jkRows] = await pool.query('SELECT jk, COUNT(*) AS total FROM pegawai GROUP BY jk');

    res.json({
      totalPegawai: pegawaiRows[0].total_pegawai,
      totalUnit: unitRows[0].total_unit,
      distribusiJk: jkRows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ensure users table exists
async function ensureUsersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL DEFAULT 'editor',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  // Optionally create admin user from env
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;
  if (adminUser && adminPass) {
    const [rows] = await pool.query('SELECT id FROM users WHERE username = ?', [adminUser]);
    if (rows.length === 0) {
      const hash = await bcrypt.hash(adminPass, 10);
      await pool.query('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [adminUser, hash, 'admin']);
      console.log('Created initial admin user from env');
    }
  }
}

// ensure pegawai table has photo column
async function ensurePegawaiPhotoColumn() {
  try {
    await pool.query("ALTER TABLE pegawai ADD COLUMN IF NOT EXISTS photo VARCHAR(255) DEFAULT NULL");
  } catch (e) {
    // MySQL older versions may error on IF NOT EXISTS; try graceful check
    try {
      const [rows] = await pool.query("SHOW COLUMNS FROM pegawai LIKE 'photo'");
      if (!rows || rows.length === 0) {
        await pool.query("ALTER TABLE pegawai ADD COLUMN photo VARCHAR(255) DEFAULT NULL");
      }
    } catch (e2) { console.warn('Could not ensure photo column:', e2.message); }
  }
}

// JWT middleware
function authenticateToken(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Token required' });
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = payload;
    next();
  });
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (req.user.role !== role && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const seed = req.query.token || req.headers['x-seed-token'];
    const expected = process.env.SEED_TOKEN || 'letmein';
    if (seed !== expected) return res.status(403).json({ error: 'Unauthorized' });
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [username, hash, role || 'editor']);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const [rows] = await pool.query('SELECT id, username, password_hash, role FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ ok: true, token });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Upload photo endpoint
app.post('/api/pegawai/:id/photo', authenticateToken, authorizeRole('admin'), upload.single('photo'), async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    if (!req.file) return res.status(400).json({ error: 'File required' });
    const filename = req.file.filename; const relPath = path.join('uploads', filename);
    await pool.query('UPDATE pegawai SET photo = ? WHERE id = ?', [relPath, id]);
    res.json({ ok: true, photo: relPath });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/pegawai', async (req, res) => {
  try {
    const search = (req.query.search || '').toString().trim();
    const limit = Math.min(Number(req.query.limit || 50), 200);
    const offset = Math.max(Number(req.query.offset || 0), 0);

    let sql = 'SELECT id, nip, nama, jabatan, eselon, unit, jk, pendidikan, generasi, goldar, agama FROM pegawai';
    const params = [];

    if (search) {
      sql += ' WHERE nama LIKE ? OR nip LIKE ? OR unit LIKE ?';
      const keyword = `%${search}%`;
      params.push(keyword, keyword, keyword);
    }

    sql += ' ORDER BY nama LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Seed endpoint (admin only)
app.post('/api/seed', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { seedCount } = req.body || {}; const n = Math.max(1, Math.min(1000, Number(seedCount || 50)));
    const { seed } = require('./seed');
    await seed(n);
    res.json({ ok: true, inserted: n });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/pegawai', async (req, res) => {
  try {
    const { nip, nama, jabatan, eselon, unit, jk, pendidikan, generasi, goldar, agama } = req.body;

    if (!nip || !nama) {
      return res.status(400).json({ error: 'nip dan nama wajib diisi' });
    }

    const [result] = await pool.query(
      'INSERT INTO pegawai (nip, nama, jabatan, eselon, unit, jk, pendidikan, generasi, goldar, agama) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nip, nama, jabatan || null, eselon || null, unit || null, jk || 'Laki-Laki', pendidikan || null, generasi || null, goldar || null, agama || null]
    );

    res.status(201).json({ id: result.insertId, message: 'Data pegawai berhasil ditambahkan' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk insert endpoint (expects array of pegawai objects)
app.post('/api/pegawai/bulk', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const data = req.body;
    if (!Array.isArray(data) || data.length === 0) return res.status(400).json({ error: 'Array of pegawai required' });

    const validRows = [];
    const errors = [];

    data.forEach((p, idx) => {
      const rowErrors = [];
      if (!p.nip || String(p.nip).trim() === '') rowErrors.push('nip required');
      if (!p.nama || String(p.nama).trim() === '') rowErrors.push('nama required');
      // optional: validate jk
      if (p.jk && !['Laki-Laki', 'Perempuan'].includes(p.jk)) rowErrors.push('jk must be Laki-Laki or Perempuan');

      if (rowErrors.length > 0) {
        errors.push({ index: idx, errors: rowErrors, row: p });
      } else {
        validRows.push([
          p.nip || null,
          p.nama || null,
          p.eselon || null,
          p.unit || null,
          p.jk || 'Laki-Laki',
          p.pendidikan || null,
          p.generasi || null,
          p.goldar || null,
          p.agama || null
        ]);
      }
    });

    let inserted = 0;
    if (validRows.length > 0) {
      const sql = 'INSERT IGNORE INTO pegawai (nip,nama,eselon,unit,jk,pendidikan,generasi,goldar,agama) VALUES ?';
      const [result] = await pool.query(sql, [validRows]);
      inserted = result.affectedRows || 0;
    }

    res.json({ ok: true, insertedRows: inserted, errors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug route: return registered routes as JSON
app.get('/_routes', (_req, res) => {
  try {
    const routes = [];
    if (app._router && app._router.stack) {
      app._router.stack.forEach(layer => {
        if (layer.route && layer.route.path) {
          routes.push({ path: layer.route.path, methods: Object.keys(layer.route.methods) });
        } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
          layer.handle.stack.forEach(r => {
            if (r.route && r.route.path) {
              routes.push({ path: r.route.path, methods: Object.keys(r.route.methods) });
            }
          });
        }
      });
    }
    res.json(routes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ensure db tables then start
ensureUsersTable().catch(err => console.error('Users table init error:', err.message));
ensurePegawaiPhotoColumn().catch(err => console.error('Pegawai photo column init error:', err.message));

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);

  // Debug: list registered routes for troubleshooting
  try {
    if (app._router && app._router.stack) {
      console.log('--- Registered routes ---');
      app._router.stack.forEach(layer => {
        if (layer.route && layer.route.path) {
          const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
          console.log(`${methods} ${layer.route.path}`);
        } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
          layer.handle.stack.forEach(r => {
            if (r.route && r.route.path) {
              const methods = Object.keys(r.route.methods).join(',').toUpperCase();
              console.log(`${methods} ${r.route.path}`);
            }
          });
        }
      });
      console.log('--- end routes ---');
    }
  } catch (e) {
    console.log('Error listing routes:', e.message);
  }
});
