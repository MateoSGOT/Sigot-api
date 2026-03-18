const { getPool, sql } = require('../config/db');

const findAll = async () => {
  const pool = getPool();
  const result = await pool.request()
    .query(`
      SELECT r.Id_Repuesto, r.NombreRepuesto, r.Stock, r.Precio, r.Estado,
             r.Id_categoria, c.Nombre AS Categoria
      FROM Repuestos r
      INNER JOIN CategoriaRepuestos c ON r.Id_categoria = c.Id_categoria
      WHERE r.Estado = 1
    `);
  return result.recordset;
};

const findById = async (id) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT r.Id_Repuesto, r.NombreRepuesto, r.Stock, r.Precio, r.Estado,
             r.Id_categoria, c.Nombre AS Categoria
      FROM Repuestos r
      INNER JOIN CategoriaRepuestos c ON r.Id_categoria = c.Id_categoria
      WHERE r.Id_Repuesto = @id
    `);
  return result.recordset[0] || null;
};

const findStock = async () => {
  const pool = getPool();
  const result = await pool.request()
    .query(`
      SELECT r.Id_Repuesto, r.NombreRepuesto, r.Stock, r.Precio,
             r.Id_categoria, c.Nombre AS Categoria
      FROM Repuestos r
      INNER JOIN CategoriaRepuestos c ON r.Id_categoria = c.Id_categoria
      WHERE r.Estado = 1
      ORDER BY r.Stock ASC
    `);
  return result.recordset;
};

const create = async ({ NombreRepuesto, Stock, Precio, Id_categoria }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('NombreRepuesto', sql.VarChar(120),    NombreRepuesto)
    .input('Stock',          sql.Int,             Stock ?? 0)
    .input('Precio',         sql.Decimal(10, 2),  Precio)
    .input('Id_categoria',   sql.Int,             Id_categoria)
    .query(`
      INSERT INTO Repuestos (NombreRepuesto, Stock, Precio, Estado, Id_categoria)
      OUTPUT INSERTED.Id_Repuesto, INSERTED.NombreRepuesto, INSERTED.Stock,
             INSERTED.Precio, INSERTED.Estado, INSERTED.Id_categoria
      VALUES (@NombreRepuesto, @Stock, @Precio, 1, @Id_categoria)
    `);
  return result.recordset[0];
};

const update = async (id, { NombreRepuesto, Stock, Precio, Id_categoria }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id',             sql.Int,            id)
    .input('NombreRepuesto', sql.VarChar(120),   NombreRepuesto ?? null)
    .input('Stock',          sql.Int,            Stock          ?? null)
    .input('Precio',         sql.Decimal(10, 2), Precio         ?? null)
    .input('Id_categoria',   sql.Int,            Id_categoria   ?? null)
    .query(`
      UPDATE Repuestos
      SET NombreRepuesto = COALESCE(@NombreRepuesto, NombreRepuesto),
          Stock          = COALESCE(@Stock,          Stock),
          Precio         = COALESCE(@Precio,         Precio),
          Id_categoria   = COALESCE(@Id_categoria,   Id_categoria)
      OUTPUT INSERTED.Id_Repuesto, INSERTED.NombreRepuesto, INSERTED.Stock,
             INSERTED.Precio, INSERTED.Estado, INSERTED.Id_categoria
      WHERE Id_Repuesto = @id
    `);
  return result.recordset[0] || null;
};

const toggleEstado = async (id, estado) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id',     sql.Int, id)
    .input('Estado', sql.Bit, estado)
    .query(`
      UPDATE Repuestos
      SET Estado = @Estado
      OUTPUT INSERTED.Id_Repuesto, INSERTED.NombreRepuesto, INSERTED.Stock, INSERTED.Estado
      WHERE Id_Repuesto = @id
    `);
  return result.recordset[0] || null;
};

module.exports = { findAll, findById, findStock, create, update, toggleEstado };
