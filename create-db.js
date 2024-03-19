const mysql = require('mysql2/promise');
const { development: DB_CONFIG } = require('./config/config.json');

let connection;

// create connection
async function createConnection() {
  try {
    connection = await mysql.createConnection({
      host: DB_CONFIG.host,
      user: DB_CONFIG.username,
      password: DB_CONFIG.password,
    });
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

// connect to MySQL server & create database
async function createDatabase() {
  try {
    await connection.connect();
    console.log('Connected to MySQL server.');

    const createDatabaseSQL = `CREATE DATABASE IF NOT EXISTS ${DB_CONFIG.database}`;
    await connection.query(createDatabaseSQL);
    console.log('Database is ready.');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

async function main() {
  await createConnection();
  await createDatabase();
  connection.end();
  console.log('Connection closed.');
  process.exit(0);
}

main();
