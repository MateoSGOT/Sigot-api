require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('Conexión a PostgreSQL establecida (Prisma)');
  } catch (error) {
    console.error('Error al conectar a PostgreSQL:', error.message);
    process.exit(1);
  }
};

module.exports = { prisma, connectDB };
