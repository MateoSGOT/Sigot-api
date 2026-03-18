const { getPool, sql } = require('../config/db');

const findAll = async () => {
  const pool = getPool();
  const result = await pool.request()
    .query(`
      SELECT Id_categoria, Nombre, Descripcion, Estado
      FROM CategoriaRepuestos
      WHERE Estado = 1
    `);
  return result.recordset;
};

const findById = async (id) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT Id_categoria, Nombre, Descripcion, Estado
      FROM CategoriaRepuestos
      WHERE Id_categoria = @id
    `);
  return result.recordset[0] || null;
};

const findByNombre = async (nombre, excludeId = null) => {
  const pool = getPool();
  const req = pool.request().input('Nombre', sql.VarChar(60), nombre);
  const excludeClause = excludeId ? 'AND Id_categoria <> @ExcludeId' : '';
  if (excludeId) req.input('ExcludeId', sql.Int, excludeId);
  const result = await req.query(`
    SELECT Id_categoria FROM CategoriaRepuestos
    WHERE Nombre = @Nombre ${excludeClause}
  `);
  return result.recordset[0] || null;
};

const create = async ({ Nombre, Descripcion }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('Nombre',      sql.VarChar(60),  Nombre)
    .input('Descripcion', sql.VarChar(200), Descripcion || null)
    .query(`
      INSERT INTO CategoriaRepuestos (Nombre, Descripcion, Estado)
      OUTPUT INSERTED.Id_categoria, INSERTED.Nombre, INSERTED.Descripcion, INSERTED.Estado
      VALUES (@Nombre, @Descripcion, 1)
    `);
  return result.recordset[0];
};

const update = async (id, { Nombre, Descripcion }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id',          sql.Int,          id)
    .input('Nombre',      sql.VarChar(60),  Nombre      || null)
    .input('Descripcion', sql.VarChar(200), Descripcion || null)
    .query(`
      UPDATE CategoriaRepuestos
      SET Nombre      = COALESCE(@Nombre,      Nombre),
          Descripcion = COALESCE(@Descripcion, Descripcion)
      OUTPUT INSERTED.Id_categoria, INSERTED.Nombre, INSERTED.Descripcion, INSERTED.Estado
      WHERE Id_categoria = @id
    `);
  return result.recordset[0] || null;
};

const toggleEstado = async (id, estado) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id',     sql.Int, id)
    .input('Estado', sql.Bit, estado)
    .query(`
      UPDATE CategoriaRepuestos
      SET Estado = @Estado
      OUTPUT INSERTED.Id_categoria, INSERTED.Nombre, INSERTED.Estado
      WHERE Id_categoria = @id
    `);
  return result.recordset[0] || null;
};

module.exports = { findAll, findById, findByNombre, create, update, toggleEstado };
