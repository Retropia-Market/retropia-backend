import * as mysql from 'mysql2/promise';

const { DATABASE_HOST, DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD } =
  process.env;

export const pool = mysql.createPool({
  host: DATABASE_HOST,
  database: DATABASE_NAME,
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
});
