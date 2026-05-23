const { Client } = require('pg');

async function setupDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5433,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Hanuman@123',
    database: 'postgres' // Connect to default DB first to create our target DB
  });

  try {
    console.log('Connecting to PostgreSQL...');
    await client.connect();
    
    console.log('Checking if marketpivot database exists...');
    const res = await client.query("SELECT datname FROM pg_catalog.pg_database WHERE datname = 'marketpivot'");
    
    if (res.rowCount === 0) {
      console.log('Database does not exist. Creating marketpivot...');
      await client.query('CREATE DATABASE marketpivot');
      console.log('Database marketpivot created successfully.');
    } else {
      console.log('Database marketpivot already exists.');
    }
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

require('dotenv').config();
setupDatabase();
