const { getPool, sql } = require('../config/db');

const findAll = async () => {
  const pool = getPool();
  const result = await pool.request().query(`
    SELECT c.Id_Cliente, c.Documento, c.Nombre, c.Foto, c.Estado,
           c.Correo, c.Contacto, c.Id_TipoDoc,
           t.Nombre AS TipoDoc
    FROM Cliente c
    INNER JOIN Tipo_Doc t ON c.Id_TipoDoc = t.Id_TipoDoc
    WHERE c.Estado = 1
    ORDER BY c.Nombre
  `);
  return result.recordset;
};

const findById = async (id) => {
  const pool = getPool();
  const result = await pool.request()
    .input('Id_Cliente', sql.Int, id)
    .query(`
      SELECT c.Id_Cliente, c.Documento, c.Nombre, c.Foto, c.Estado,
             c.Correo, c.Contacto, c.Id_TipoDoc,
             t.Nombre AS TipoDoc
      FROM Cliente c
      INNER JOIN Tipo_Doc t ON c.Id_TipoDoc = t.Id_TipoDoc
      WHERE c.Id_Cliente = @Id_Cliente
    `);
  return result.recordset[0] || null;
};

const create = async ({ Documento, Nombre, Id_TipoDoc, Foto, Correo, Contacto }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('Documento',  sql.VarChar(20),  Documento)
    .input('Nombre',     sql.VarChar(100), Nombre)
    .input('Id_TipoDoc', sql.Int,          Id_TipoDoc)
    .input('Foto',       sql.VarChar(255), Foto    || null)
    .input('Correo',     sql.VarChar(120), Correo  || null)
    .input('Contacto',   sql.VarChar(50),  Contacto || null)
    .query(`
      INSERT INTO Cliente (Documento, Nombre, Id_TipoDoc, Foto, Estado, Correo, Contacto)
      OUTPUT INSERTED.Id_Cliente, INSERTED.Documento, INSERTED.Nombre,
             INSERTED.Id_TipoDoc, INSERTED.Foto, INSERTED.Estado,
             INSERTED.Correo, INSERTED.Contacto
      VALUES (@Documento, @Nombre, @Id_TipoDoc, @Foto, 1, @Correo, @Contacto)
    `);
  return result.recordset[0];
};

const update = async (id, { Documento, Nombre, Id_TipoDoc, Foto, Correo, Contacto }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('Id_Cliente', sql.Int,          id)
    .input('Documento',  sql.VarChar(20),  Documento)
    .input('Nombre',     sql.VarChar(100), Nombre)
    .input('Id_TipoDoc', sql.Int,          Id_TipoDoc)
    .input('Foto',       sql.VarChar(255), Foto     || null)
    .input('Correo',     sql.VarChar(120), Correo   || null)
    .input('Contacto',   sql.VarChar(50),  Contacto || null)
    .query(`
      UPDATE Cliente
      SET Documento  = COALESCE(@Documento,  Documento),
          Nombre     = COALESCE(@Nombre,     Nombre),
          Id_TipoDoc = COALESCE(@Id_TipoDoc, Id_TipoDoc),
          Foto       = COALESCE(@Foto,       Foto),
          Correo     = COALESCE(@Correo,     Correo),
          Contacto   = COALESCE(@Contacto,   Contacto)
      OUTPUT INSERTED.Id_Cliente, INSERTED.Documento, INSERTED.Nombre,
             INSERTED.Id_TipoDoc, INSERTED.Foto, INSERTED.Estado,
             INSERTED.Correo, INSERTED.Contacto
      WHERE Id_Cliente = @Id_Cliente
    `);
  return result.recordset[0] || null;
};

const toggleEstado = async (id, estado) => {
  const pool = getPool();
  const result = await pool.request()
    .input('Id_Cliente', sql.Int, id)
    .input('Estado',     sql.Bit, estado)
    .query(`
      UPDATE Cliente SET Estado = @Estado
      OUTPUT INSERTED.Id_Cliente, INSERTED.Estado
      WHERE Id_Cliente = @Id_Cliente
    `);
  return result.recordset[0] || null;
};

module.exports = { findAll, findById, create, update, toggleEstado };
