const { getPool, sql } = require('../config/db');

const findAll = async () => {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT Id_Rol, Nombre, Descripcion, Estado
    FROM Rol
    ORDER BY Nombre
  `);
  return result.recordset;
};

const findById = async (id) => {
  const pool = getPool();
  const result = await pool.request()
    .input('Id_Rol', sql.Int, id)
    .query(`
      SELECT Id_Rol, Nombre, Descripcion, Estado
      FROM Rol
      WHERE Id_Rol = @Id_Rol
    `);
  return result.recordset[0] || null;
};

const findByNombre = async (nombre, excludeId = null) => {
  const pool = getPool();
  const request = pool.request().input('Nombre', sql.VarChar(50), nombre);
  const whereExclude = excludeId ? 'AND Id_Rol <> @ExcludeId' : '';
  if (excludeId) request.input('ExcludeId', sql.Int, excludeId);
  const result = await request.query(
    `SELECT Id_Rol FROM Rol WHERE Nombre = @Nombre ${whereExclude}`
  );
  return result.recordset[0] || null;
};

const create = async ({ Nombre, Descripcion }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('Nombre',      sql.VarChar(50),  Nombre)
    .input('Descripcion', sql.VarChar(200), Descripcion || null)
    .query(`
      INSERT INTO Rol (Nombre, Descripcion, Estado)
      OUTPUT INSERTED.Id_Rol, INSERTED.Nombre, INSERTED.Descripcion, INSERTED.Estado
      VALUES (@Nombre, @Descripcion, 1)
    `);
  return result.recordset[0];
};

const update = async (id, { Nombre, Descripcion }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('Id_Rol',      sql.Int,          id)
    .input('Nombre',      sql.VarChar(50),  Nombre      || null)
    .input('Descripcion', sql.VarChar(200), Descripcion || null)
    .query(`
      UPDATE Rol
      SET Nombre      = COALESCE(@Nombre,      Nombre),
          Descripcion = COALESCE(@Descripcion, Descripcion)
      OUTPUT INSERTED.Id_Rol, INSERTED.Nombre, INSERTED.Descripcion, INSERTED.Estado
      WHERE Id_Rol = @Id_Rol
    `);
  return result.recordset[0] || null;
};

const toggleEstado = async (id, estado) => {
  const pool = getPool();
  const result = await pool.request()
    .input('Id_Rol', sql.Int, id)
    .input('Estado', sql.Bit, estado)
    .query(`
      UPDATE Rol SET Estado = @Estado
      OUTPUT INSERTED.Id_Rol, INSERTED.Estado
      WHERE Id_Rol = @Id_Rol
    `);
  return result.recordset[0] || null;
};

module.exports = { findAll, findById, findByNombre, create, update, toggleEstado };
