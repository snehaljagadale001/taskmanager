const { Pool } = require('pg');
console.log("DATABASE_URL:", process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

const initDB = async () => {
  try {
    const client = await pool.connect();

    console.log('PostgreSQL Connected Successfully');

    client.release();
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err;
  }
};

module.exports = { pool, initDB };