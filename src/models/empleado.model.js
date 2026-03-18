const { getPool, sql } = require('../config/db');

const findAll = async () => {
  const pool = getPool();
  const result = await pool.request()
    .query(`
      SELECT e.id_empleado, e.Documento, e.Nombre, e.Id_TipoDoc, e.Id_Rol,
             e.Correo, e.Foto, e.Estado,
             r.Nombre AS Rol,
             t.Nombre AS TipoDocumento
      FROM Empleado e
      INNER JOIN Rol r ON e.Id_Rol = r.Id_Rol
      INNER JOIN Tipo_Doc t ON e.Id_TipoDoc = t.Id_TipoDoc
      WHERE e.Estado = 1
    `);
  return result.recordset;
};

const findById = async (id) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT e.id_empleado, e.Documento, e.Nombre, e.Id_TipoDoc, e.Id_Rol,
             e.Correo, e.Foto, e.Estado,
             r.Nombre AS Rol,
             t.Nombre AS TipoDocumento
      FROM Empleado e
      INNER JOIN Rol r ON e.Id_Rol = r.Id_Rol
      INNER JOIN Tipo_Doc t ON e.Id_TipoDoc = t.Id_TipoDoc
      WHERE e.id_empleado = @id
    `);
  return result.recordset[0] || null;
};

const findByCorreo = async (correo, excludeId = null) => {
  const pool = getPool();
  const req = pool.request().input('Correo', sql.VarChar(120), correo);
  const excludeClause = excludeId ? 'AND id_empleado <> @ExcludeId' : '';
  if (excludeId) req.input('ExcludeId', sql.Int, excludeId);
  const result = await req.query(`
    SELECT e.id_empleado, e.Documento, e.Nombre, e.Correo, e.Password,
           e.Id_Rol, e.Foto, e.Estado,
           r.Nombre AS Rol
    FROM Empleado e
    INNER JOIN Rol r ON e.Id_Rol = r.Id_Rol
    WHERE e.Correo = @Correo ${excludeClause}
  `);
  return result.recordset[0] || null;
};

const findByDocumento = async (documento, excludeId = null) => {
  const pool = getPool();
  const req = pool.request().input('Documento', sql.VarChar(20), documento);
  const excludeClause = excludeId ? 'AND id_empleado <> @ExcludeId' : '';
  if (excludeId) req.input('ExcludeId', sql.Int, excludeId);
  const result = await req.query(`
    SELECT id_empleado FROM Empleado
    WHERE Documento = @Documento ${excludeClause}
  `);
  return result.recordset[0] || null;
};

const create = async ({ Documento, Nombre, Id_TipoDoc, Id_Rol, Correo, Password, Foto }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('Documento',  sql.VarChar(20),  Documento)
    .input('Nombre',     sql.VarChar(100), Nombre)
    .input('Id_TipoDoc', sql.Int,          Id_TipoDoc)
    .input('Id_Rol',     sql.Int,          Id_Rol)
    .input('Correo',     sql.VarChar(120), Correo)
    .input('Password',   sql.VarChar(255), Password)
    .input('Foto',       sql.VarChar(255), Foto || null)
    .query(`
      INSERT INTO Empleado (Documento, Nombre, Id_TipoDoc, Id_Rol, Correo, Password, Foto, Estado)
      OUTPUT INSERTED.id_empleado, INSERTED.Documento, INSERTED.Nombre,
             INSERTED.Id_TipoDoc, INSERTED.Id_Rol, INSERTED.Correo, INSERTED.Foto, INSERTED.Estado
      VALUES (@Documento, @Nombre, @Id_TipoDoc, @Id_Rol, @Correo, @Password, @Foto, 1)
    `);
  return result.recordset[0];
};

const update = async (id, { Documento, Nombre, Id_TipoDoc, Id_Rol, Correo, Foto }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id',         sql.Int,          id)
    .input('Documento',  sql.VarChar(20),  Documento  || null)
    .input('Nombre',     sql.VarChar(100), Nombre     || null)
    .input('Id_TipoDoc', sql.Int,          Id_TipoDoc || null)
    .input('Id_Rol',     sql.Int,          Id_Rol     || null)
    .input('Correo',     sql.VarChar(120), Correo     || null)
    .input('Foto',       sql.VarChar(255), Foto       !== undefined ? Foto : undefined)
    .query(`
      UPDATE Empleado
      SET Documento  = COALESCE(@Documento,  Documento),
          Nombre     = COALESCE(@Nombre,     Nombre),
          Id_TipoDoc = COALESCE(@Id_TipoDoc, Id_TipoDoc),
          Id_Rol     = COALESCE(@Id_Rol,     Id_Rol),
          Correo     = COALESCE(@Correo,     Correo),
          Foto       = COALESCE(@Foto,       Foto)
      OUTPUT INSERTED.id_empleado, INSERTED.Documento, INSERTED.Nombre,
             INSERTED.Id_TipoDoc, INSERTED.Id_Rol, INSERTED.Correo, INSERTED.Foto, INSERTED.Estado
      WHERE id_empleado = @id
    `);
  return result.recordset[0] || null;
};

const toggleEstado = async (id, estado) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id',     sql.Int, id)
    .input('Estado', sql.Bit, estado)
    .query(`
      UPDATE Empleado
      SET Estado = @Estado
      OUTPUT INSERTED.id_empleado, INSERTED.Nombre, INSERTED.Correo, INSERTED.Estado
      WHERE id_empleado = @id
    `);
  return result.recordset[0] || null;
};

module.exports = { findAll, findById, findByCorreo, findByDocumento, create, update, toggleEstado };
