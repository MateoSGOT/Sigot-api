require('dotenv').config({ path: '/home/mateo/sigot-api/.env' });
const bcrypt = require('bcryptjs');
const sql = require('mssql');

const config = {
  server:   process.env.DB_SERVER,
  port:     parseInt(process.env.DB_PORT) || 1433,
  database: process.env.DB_DATABASE,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options:  { encrypt: false, trustServerCertificate: true },
};

async function run(pool, query, label) {
  try {
    await pool.request().query(query);
    console.log('OK:', label);
  } catch (e) {
    console.log('SKIP (ya existe o error):', label, '-', e.message);
  }
}

(async () => {
  const pool = await sql.connect(config);
  console.log('Conectado a SQL Server\n');

  // Tipo_Doc
  const tipos = [
    'Cédula de Ciudadanía', 'Cédula de Extranjería', 'NIT', 'Pasaporte', 'Tarjeta de Identidad'
  ];
  for (const t of tipos) {
    await run(pool,
      `IF NOT EXISTS (SELECT 1 FROM Tipo_Doc WHERE Nombre = '${t}') INSERT INTO Tipo_Doc (Nombre) VALUES ('${t}')`,
      `Tipo_Doc: ${t}`
    );
  }

  // Rol
  const roles = [
    ['Administrador', 'Acceso total al sistema'],
    ['Mecánico',      'Técnico de taller'],
    ['Recepcionista', 'Atención al cliente y agenda'],
  ];
  for (const [nombre, desc] of roles) {
    await run(pool,
      `IF NOT EXISTS (SELECT 1 FROM Rol WHERE Nombre = '${nombre}') INSERT INTO Rol (Nombre, Descripcion, Estado) VALUES ('${nombre}', '${desc}', 1)`,
      `Rol: ${nombre}`
    );
  }

  // Marca
  const marcas = ['Chevrolet','Renault','Mazda','Toyota','Nissan','Kia','Hyundai','Ford','Volkswagen','Honda','Suzuki','Mitsubishi'];
  for (const m of marcas) {
    await run(pool,
      `IF NOT EXISTS (SELECT 1 FROM Marca WHERE Nombre = '${m}') INSERT INTO Marca (Nombre, Estado) VALUES ('${m}', 1)`,
      `Marca: ${m}`
    );
  }

  // CategoriaRepuestos
  const cats = [
    ['Filtros',      'Filtros de aceite, aire y combustible'],
    ['Frenos',       'Pastillas, discos y tambores'],
    ['Suspensión',   'Amortiguadores, resortes y bujes'],
    ['Motor',        'Partes internas del motor'],
    ['Eléctrico',    'Baterías, alternadores y fusibles'],
    ['Transmisión',  'Embrague, caja de cambios y diferenciales'],
    ['Lubricantes',  'Aceites y grasas'],
  ];
  for (const [nombre, desc] of cats) {
    await run(pool,
      `IF NOT EXISTS (SELECT 1 FROM CategoriaRepuestos WHERE Nombre = '${nombre}') INSERT INTO CategoriaRepuestos (Nombre, Descripcion, Estado) VALUES ('${nombre}', '${desc}', 1)`,
      `CategoriaRepuestos: ${nombre}`
    );
  }

  // Servicios
  const servicios = [
    ['Cambio de aceite',              'Cambio de aceite de motor y filtro',                80000],
    ['Revisión de frenos',            'Inspección y ajuste del sistema de frenos',         60000],
    ['Cambio de pastillas',           'Cambio de pastillas de freno delanteras',          120000],
    ['Alineación y balanceo',         'Alineación de dirección y balanceo de ruedas',      90000],
    ['Diagnóstico general',           'Revisión completa del vehículo con scanner',        50000],
    ['Cambio de correa de distribución','Reemplazo de correa de distribución y tensor',   350000],
    ['Mantenimiento preventivo',      'Revisión de 30 puntos del vehículo',               180000],
  ];
  for (const [nombre, desc, precio] of servicios) {
    await run(pool,
      `IF NOT EXISTS (SELECT 1 FROM Servicios WHERE Nombre = '${nombre}') INSERT INTO Servicios (Nombre, Descripcion, Precio, Estado) VALUES ('${nombre}', '${desc}', ${precio}, 1)`,
      `Servicio: ${nombre}`
    );
  }

  // Empleado admin
  const hash = await bcrypt.hash('Admin2024!', 10);
  const idRol = (await pool.request().query("SELECT TOP 1 Id_Rol FROM Rol WHERE Nombre = 'Administrador'")).recordset[0]?.Id_Rol;
  const idTipo = (await pool.request().query("SELECT TOP 1 Id_TipoDoc FROM Tipo_Doc WHERE Nombre = 'Cédula de Ciudadanía'")).recordset[0]?.Id_TipoDoc;

  await pool.request()
    .input('hash',       sql.VarChar(255), hash)
    .input('correo',     sql.VarChar(120), 'admin@sigot.com')
    .input('documento',  sql.VarChar(20),  '0000000001')
    .input('nombre',     sql.VarChar(100), 'Administrador SIGOT')
    .input('Id_TipoDoc', sql.Int,          idTipo)
    .input('Id_Rol',     sql.Int,          idRol)
    .query(`
      IF NOT EXISTS (SELECT 1 FROM Empleado WHERE Correo = @correo)
        INSERT INTO Empleado (Documento, Nombre, Id_TipoDoc, Id_Rol, Correo, Password, Estado)
        VALUES (@documento, @nombre, @Id_TipoDoc, @Id_Rol, @correo, @hash, 1)
      ELSE
        UPDATE Empleado SET Password = @hash WHERE Correo = @correo
    `);
  console.log('OK: Empleado admin@sigot.com');

  // Verificación final
  console.log('\n--- VERIFICACIÓN ---');
  const tablas = ['Tipo_Doc', 'Rol', 'Marca', 'CategoriaRepuestos', 'Servicios', 'Empleado'];
  for (const t of tablas) {
    const r = await pool.request().query(`SELECT COUNT(*) AS n FROM ${t}`);
    console.log(`${t}: ${r.recordset[0].n} registros`);
  }

  await pool.close();
  console.log('\nSeed completado.');
})().catch(err => { console.error('ERROR FATAL:', err.message); process.exit(1); });
