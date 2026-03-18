const { getPool, sql } = require('../config/db');

const findAll = async () => {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT v.Id_Vehiculo, v.Placa, v.VIN, v.Modelo, v.Año, v.Color, v.NumeroEjes, v.Estado,
           v.Id_Cliente, c.Nombre AS Cliente,
           v.Id_Marca,  m.Nombre AS Marca
    FROM Vehiculo v
    INNER JOIN Cliente c ON v.Id_Cliente = c.Id_Cliente
    INNER JOIN Marca   m ON v.Id_Marca   = m.Id_Marca
    WHERE v.Estado = 1
    ORDER BY v.Placa
  `);
  return result.recordset;
};

const findById = async (id) => {
  const pool = getPool();
  const result = await pool.request()
    .input('Id_Vehiculo', sql.Int, id)
    .query(`
      SELECT v.Id_Vehiculo, v.Placa, v.VIN, v.Modelo, v.Año, v.Color, v.NumeroEjes, v.Estado,
             v.Id_Cliente, c.Nombre AS Cliente,
             v.Id_Marca,  m.Nombre AS Marca
      FROM Vehiculo v
      INNER JOIN Cliente c ON v.Id_Cliente = c.Id_Cliente
      INNER JOIN Marca   m ON v.Id_Marca   = m.Id_Marca
      WHERE v.Id_Vehiculo = @Id_Vehiculo
    `);
  return result.recordset[0] || null;
};

const findByPlaca = async (placa, excludeId = null) => {
  const pool = getPool();
  const request = pool.request().input('Placa', sql.VarChar(10), placa);
  const whereExclude = excludeId ? 'AND Id_Vehiculo <> @ExcludeId' : '';
  if (excludeId) request.input('ExcludeId', sql.Int, excludeId);
  const result = await request.query(
    `SELECT Id_Vehiculo FROM Vehiculo WHERE Placa = @Placa ${whereExclude}`
  );
  return result.recordset[0] || null;
};

const findByVIN = async (vin, excludeId = null) => {
  const pool = getPool();
  const request = pool.request().input('VIN', sql.VarChar(30), vin);
  const whereExclude = excludeId ? 'AND Id_Vehiculo <> @ExcludeId' : '';
  if (excludeId) request.input('ExcludeId', sql.Int, excludeId);
  const result = await request.query(
    `SELECT Id_Vehiculo FROM Vehiculo WHERE VIN = @VIN ${whereExclude}`
  );
  return result.recordset[0] || null;
};

const create = async ({ Placa, VIN, Id_Cliente, Id_Marca, Modelo, Año, Color, NumeroEjes }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('Placa',      sql.VarChar(10), Placa)
    .input('VIN',        sql.VarChar(30), VIN        || null)
    .input('Id_Cliente', sql.Int,         Id_Cliente)
    .input('Id_Marca',   sql.Int,         Id_Marca)
    .input('Modelo',     sql.VarChar(50), Modelo)
    .input('Año',        sql.Int,         Año)
    .input('Color',      sql.VarChar(30), Color      || null)
    .input('NumeroEjes', sql.Int,         NumeroEjes || null)
    .query(`
      INSERT INTO Vehiculo (Placa, VIN, Id_Cliente, Id_Marca, Modelo, Año, Color, NumeroEjes, Estado)
      OUTPUT INSERTED.Id_Vehiculo, INSERTED.Placa, INSERTED.VIN, INSERTED.Id_Cliente,
             INSERTED.Id_Marca, INSERTED.Modelo, INSERTED.Año, INSERTED.Color,
             INSERTED.NumeroEjes, INSERTED.Estado
      VALUES (@Placa, @VIN, @Id_Cliente, @Id_Marca, @Modelo, @Año, @Color, @NumeroEjes, 1)
    `);
  return result.recordset[0];
};

const update = async (id, { Placa, VIN, Id_Cliente, Id_Marca, Modelo, Año, Color, NumeroEjes }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('Id_Vehiculo', sql.Int,         id)
    .input('Placa',       sql.VarChar(10), Placa      || null)
    .input('VIN',         sql.VarChar(30), VIN        || null)
    .input('Id_Cliente',  sql.Int,         Id_Cliente || null)
    .input('Id_Marca',    sql.Int,         Id_Marca   || null)
    .input('Modelo',      sql.VarChar(50), Modelo     || null)
    .input('Año',         sql.Int,         Año        || null)
    .input('Color',       sql.VarChar(30), Color      || null)
    .input('NumeroEjes',  sql.Int,         NumeroEjes || null)
    .query(`
      UPDATE Vehiculo
      SET Placa      = COALESCE(@Placa,      Placa),
          VIN        = COALESCE(@VIN,        VIN),
          Id_Cliente = COALESCE(@Id_Cliente, Id_Cliente),
          Id_Marca   = COALESCE(@Id_Marca,   Id_Marca),
          Modelo     = COALESCE(@Modelo,     Modelo),
          Año        = COALESCE(@Año,        Año),
          Color      = COALESCE(@Color,      Color),
          NumeroEjes = COALESCE(@NumeroEjes, NumeroEjes)
      OUTPUT INSERTED.Id_Vehiculo, INSERTED.Placa, INSERTED.VIN, INSERTED.Id_Cliente,
             INSERTED.Id_Marca, INSERTED.Modelo, INSERTED.Año, INSERTED.Color,
             INSERTED.NumeroEjes, INSERTED.Estado
      WHERE Id_Vehiculo = @Id_Vehiculo
    `);
  return result.recordset[0] || null;
};

const toggleEstado = async (id, estado) => {
  const pool = getPool();
  const result = await pool.request()
    .input('Id_Vehiculo', sql.Int, id)
    .input('Estado',      sql.Bit, estado)
    .query(`
      UPDATE Vehiculo SET Estado = @Estado
      OUTPUT INSERTED.Id_Vehiculo, INSERTED.Estado
      WHERE Id_Vehiculo = @Id_Vehiculo
    `);
  return result.recordset[0] || null;
};

module.exports = { findAll, findById, findByPlaca, findByVIN, create, update, toggleEstado };
