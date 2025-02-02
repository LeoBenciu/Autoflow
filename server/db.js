require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://me:password@localhost:5432/api',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
