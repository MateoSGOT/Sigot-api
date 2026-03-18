const { getPool, sql } = require('../config/db');

const findAll = async () => {
  const pool = getPool();
  const result = await pool.request()
    .query(`
      SELECT id_proveedor, Documento, TipoProveedor, nombre, correo,
             contacto, ciudad, direccion, detalles, Estado
      FROM proveedor
      WHERE Estado = 1
    `);
  return result.recordset;
};

const findById = async (id) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT id_proveedor, Documento, TipoProveedor, nombre, correo,
             contacto, ciudad, direccion, detalles, Estado
      FROM proveedor
      WHERE id_proveedor = @id
    `);
  return result.recordset[0] || null;
};

const create = async ({ Documento, TipoProveedor, nombre, correo, contacto, ciudad, direccion, detalles }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('Documento',     sql.VarChar(20),  Documento)
    .input('TipoProveedor', sql.VarChar(20),  TipoProveedor)
    .input('nombre',        sql.VarChar(120), nombre)
    .input('correo',        sql.VarChar(120), correo    || null)
    .input('contacto',      sql.VarChar(20),  contacto  || null)
    .input('ciudad',        sql.VarChar(60),  ciudad    || null)
    .input('direccion',     sql.VarChar(150), direccion || null)
    .input('detalles',      sql.VarChar(200), detalles  || null)
    .query(`
      INSERT INTO proveedor (Documento, TipoProveedor, nombre, correo, contacto, ciudad, direccion, detalles, Estado)
      OUTPUT INSERTED.id_proveedor, INSERTED.Documento, INSERTED.TipoProveedor, INSERTED.nombre,
             INSERTED.correo, INSERTED.contacto, INSERTED.ciudad, INSERTED.direccion,
             INSERTED.detalles, INSERTED.Estado
      VALUES (@Documento, @TipoProveedor, @nombre, @correo, @contacto, @ciudad, @direccion, @detalles, 1)
    `);
  return result.recordset[0];
};

const update = async (id, { Documento, TipoProveedor, nombre, correo, contacto, ciudad, direccion, detalles }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id',            sql.Int,          id)
    .input('Documento',     sql.VarChar(20),  Documento     || null)
    .input('TipoProveedor', sql.VarChar(20),  TipoProveedor || null)
    .input('nombre',        sql.VarChar(120), nombre        || null)
    .input('correo',        sql.VarChar(120), correo        || null)
    .input('contacto',      sql.VarChar(20),  contacto      || null)
    .input('ciudad',        sql.VarChar(60),  ciudad        || null)
    .input('direccion',     sql.VarChar(150), direccion     || null)
    .input('detalles',      sql.VarChar(200), detalles      || null)
    .query(`
      UPDATE proveedor
      SET Documento     = COALESCE(@Documento,     Documento),
          TipoProveedor = COALESCE(@TipoProveedor, TipoProveedor),
          nombre        = COALESCE(@nombre,        nombre),
          correo        = COALESCE(@correo,        correo),
          contacto      = COALESCE(@contacto,      contacto),
          ciudad        = COALESCE(@ciudad,        ciudad),
          direccion     = COALESCE(@direccion,     direccion),
          detalles      = COALESCE(@detalles,      detalles)
      OUTPUT INSERTED.id_proveedor, INSERTED.Documento, INSERTED.TipoProveedor, INSERTED.nombre,
             INSERTED.correo, INSERTED.contacto, INSERTED.ciudad, INSERTED.direccion,
             INSERTED.detalles, INSERTED.Estado
      WHERE id_proveedor = @id
    `);
  return result.recordset[0] || null;
};

const toggleEstado = async (id, estado) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id',     sql.Int, id)
    .input('Estado', sql.Bit, estado)
    .query(`
      UPDATE proveedor
      SET Estado = @Estado
      OUTPUT INSERTED.id_proveedor, INSERTED.nombre, INSERTED.Estado
      WHERE id_proveedor = @id
    `);
  return result.recordset[0] || null;
};

module.exports = { findAll, findById, create, update, toggleEstado };
