const { getPool, sql } = require('../config/db');

const findAll = async () => {
  const pool = getPool();
  const result = await pool.request()
    .query(`
      SELECT n.Id_Novedad, n.id_empleado, e.Nombre AS empleado,
             n.Descripcion, n.Fecha_Novedad, n.FechaRealizacion
      FROM Novedades n
      JOIN Empleado e ON e.id_empleado = n.id_empleado
      ORDER BY n.Id_Novedad DESC
    `);
  return result.recordset;
};

const findById = async (id) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT n.Id_Novedad, n.id_empleado, e.Nombre AS empleado,
             n.Descripcion, n.Fecha_Novedad, n.FechaRealizacion
      FROM Novedades n
      JOIN Empleado e ON e.id_empleado = n.id_empleado
      WHERE n.Id_Novedad = @id
    `);
  return result.recordset[0] || null;
};

const create = async ({ id_empleado, Descripcion, Fecha_Novedad, FechaRealizacion }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id_empleado',      sql.Int,          id_empleado)
    .input('Descripcion',      sql.VarChar(500), Descripcion      || null)
    .input('Fecha_Novedad',    sql.Date,         Fecha_Novedad    || null)
    .input('FechaRealizacion', sql.Date,         FechaRealizacion || null)
    .query(`
      INSERT INTO Novedades (id_empleado, Descripcion, Fecha_Novedad, FechaRealizacion)
      OUTPUT INSERTED.Id_Novedad, INSERTED.id_empleado, INSERTED.Descripcion,
             INSERTED.Fecha_Novedad, INSERTED.FechaRealizacion
      VALUES (@id_empleado, @Descripcion, @Fecha_Novedad, @FechaRealizacion)
    `);
  return result.recordset[0];
};

const update = async (id, { id_empleado, Descripcion, Fecha_Novedad, FechaRealizacion }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id',               sql.Int,          id)
    .input('id_empleado',      sql.Int,          id_empleado      ?? null)
    .input('Descripcion',      sql.VarChar(500), Descripcion      || null)
    .input('Fecha_Novedad',    sql.Date,         Fecha_Novedad    || null)
    .input('FechaRealizacion', sql.Date,         FechaRealizacion || null)
    .query(`
      UPDATE Novedades
      SET id_empleado      = COALESCE(@id_empleado,      id_empleado),
          Descripcion      = COALESCE(@Descripcion,      Descripcion),
          Fecha_Novedad    = COALESCE(@Fecha_Novedad,    Fecha_Novedad),
          FechaRealizacion = COALESCE(@FechaRealizacion, FechaRealizacion)
      OUTPUT INSERTED.Id_Novedad, INSERTED.id_empleado, INSERTED.Descripcion,
             INSERTED.Fecha_Novedad, INSERTED.FechaRealizacion
      WHERE Id_Novedad = @id
    `);
  return result.recordset[0] || null;
};

module.exports = { findAll, findById, create, update };
