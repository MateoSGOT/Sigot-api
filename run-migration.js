require('dotenv').config();
const sql = require('mssql');

const config = {
  server:   process.env.DB_SERVER,
  port:     parseInt(process.env.DB_PORT) || 1433,
  database: process.env.DB_DATABASE,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options:  { encrypt: false, trustServerCertificate: true },
};

const tablas = ['Vehiculo', 'Agenda'];

(async () => {
  const pool = await sql.connect(config);

  for (const tabla of tablas) {
    const check = await pool.request().query(`
      SELECT 1 FROM sys.columns
      WHERE object_id = OBJECT_ID('${tabla}') AND name = 'Estado'
    `);

    if (check.recordset.length === 0) {
      await pool.request().query(
        `ALTER TABLE ${tabla} ADD Estado bit NOT NULL DEFAULT 1`
      );
      console.log(`OK: Estado agregado a ${tabla}`);
    } else {
      console.log(`SKIP: ${tabla} ya tiene columna Estado`);
    }
  }

  // Verificación final
  console.log('\n--- VERIFICACIÓN ---');
  const result = await pool.request().query(`
    SELECT t.name AS Tabla, c.name AS Columna
    FROM sys.columns c
    JOIN sys.tables t ON t.object_id = c.object_id
    WHERE t.name IN ('Vehiculo','Agenda') AND c.name = 'Estado'
  `);
  result.recordset.forEach(r => console.log(`${r.Tabla}.Estado ✓`));

  await pool.close();
  console.log('\nMigración completada.');
})().catch(err => { console.error('ERROR:', err.message); process.exit(1); });
