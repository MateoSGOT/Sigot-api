const { getPool, sql } = require('../config/db');

const findAll = async () => {
  const pool = getPool();
  const result = await pool.request()
    .query(`
      SELECT Id_Servicio, Nombre, Descripcion, Precio, Estado
      FROM Servicios
      WHERE Estado = 1
    `);
  return result.recordset;
};

const findById = async (id) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT Id_Servicio, Nombre, Descripcion, Precio, Estado
      FROM Servicios
      WHERE Id_Servicio = @id
    `);
  return result.recordset[0] || null;
};

const findByNombre = async (nombre, excludeId = null) => {
  const pool = getPool();
  const req = pool.request().input('Nombre', sql.VarChar(80), nombre);
  const excludeClause = excludeId ? 'AND Id_Servicio <> @ExcludeId' : '';
  if (excludeId) req.input('ExcludeId', sql.Int, excludeId);
  const result = await req.query(`
    SELECT Id_Servicio FROM Servicios
    WHERE Nombre = @Nombre ${excludeClause}
  `);
  return result.recordset[0] || null;
};

const create = async ({ Nombre, Descripcion, Precio }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('Nombre',      sql.VarChar(80),      Nombre)
    .input('Descripcion', sql.VarChar(200),     Descripcion || null)
    .input('Precio',      sql.Decimal(10, 2),   Precio)
    .query(`
      INSERT INTO Servicios (Nombre, Descripcion, Precio, Estado)
      OUTPUT INSERTED.Id_Servicio, INSERTED.Nombre, INSERTED.Descripcion,
             INSERTED.Precio, INSERTED.Estado
      VALUES (@Nombre, @Descripcion, @Precio, 1)
    `);
  return result.recordset[0];
};

const update = async (id, { Nombre, Descripcion, Precio }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id',          sql.Int,            id)
    .input('Nombre',      sql.VarChar(80),    Nombre        || null)
    .input('Descripcion', sql.VarChar(200),   Descripcion   || null)
    .input('Precio',      sql.Decimal(10, 2), Precio        ?? null)
    .query(`
      UPDATE Servicios
      SET Nombre      = COALESCE(@Nombre,      Nombre),
          Descripcion = COALESCE(@Descripcion, Descripcion),
          Precio      = COALESCE(@Precio,      Precio)
      OUTPUT INSERTED.Id_Servicio, INSERTED.Nombre, INSERTED.Descripcion,
             INSERTED.Precio, INSERTED.Estado
      WHERE Id_Servicio = @id
    `);
  return result.recordset[0] || null;
};

const toggleEstado = async (id, estado) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id',     sql.Int, id)
    .input('Estado', sql.Bit, estado)
    .query(`
      UPDATE Servicios
      SET Estado = @Estado
      OUTPUT INSERTED.Id_Servicio, INSERTED.Nombre, INSERTED.Estado
      WHERE Id_Servicio = @id
    `);
  return result.recordset[0] || null;
};

module.exports = { findAll, findById, findByNombre, create, update, toggleEstado };
