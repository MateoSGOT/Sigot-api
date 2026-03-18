const sql = require('mssql');

const config = {
  server:   process.env.DB_SERVER,
  port:     parseInt(process.env.DB_PORT) || 1433,
  database: process.env.DB_DATABASE,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool;

const connectDB = async () => {
  try {
    pool = await sql.connect(config);
    console.log('Conexión a SQL Server establecida');
    return pool;
  } catch (error) {
    console.error('Error al conectar a SQL Server:', error.message);
    process.exit(1);
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('La base de datos no está inicializada. Llama a connectDB() primero.');
  }
  return pool;
};

module.exports = { connectDB, getPool, sql };
