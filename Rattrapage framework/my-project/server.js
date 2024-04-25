const express = require('express');
const session = require('express-session');
const pg = require('pg');
const bcrypt = require('bcryptjs');
const PGSession = require('connect-pg-simple')(session);
require('dotenv').config();
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;

const pgPool = new pg.Pool({
  connectionString: process.env.POSTGRES_URI
});
app.use(cors({
    credentials: true, // to support session cookies
    origin: 'http://localhost:3000' // or wherever your frontend is hosted
}));
app.use(express.json());
app.use(session({
  store: new PGSession({
    pool: pgPool,                // Connection pool
    tableName: 'session'        // Use another table name for storing sessions
  }),
  secret: '1234',              // Secret used to sign the session ID cookie
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

// PostgreSQL table creation logic
const createUserTable = async () => {
  const client = await pgPool.connect();
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `;
    await client.query(sql);
  } finally {
    client.release();
  }
};

createUserTable();

// Routes
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const client = await pgPool.connect();
  try {
    const result = await client.query('INSERT INTO users(username, password) VALUES($1, $2) RETURNING id', [username, hashedPassword]);
    req.session.userId = result.rows[0].id;
    res.status(201).send('User registered and logged in');
  } catch (error) {
    console.log(error)
    res.status(500).send(error.message);
  } finally {
    client.release();
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const client = await pgPool.connect();
  try {
    const result = await client.query('SELECT id, password FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }
    req.session.userId = user.id;
    res.send('Logged in successfully');
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    client.release();
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
