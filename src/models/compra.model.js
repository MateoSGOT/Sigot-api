const { getPool, sql } = require('../config/db');

const findAll = async () => {
  const pool = getPool();
  const result = await pool.request()
    .query(`
      SELECT c.Id_Compra, c.Fecha_compra, c.id_proveedor,
             p.nombre AS proveedor, c.Total, c.Estado
      FROM Compras c
      JOIN proveedor p ON p.id_proveedor = c.id_proveedor
      WHERE c.Estado = 1
      ORDER BY c.Id_Compra DESC
    `);
  return result.recordset;
};

const findById = async (id) => {
  const pool = getPool();

  const compraResult = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT c.Id_Compra, c.Fecha_compra, c.id_proveedor,
             p.nombre AS proveedor, c.Total, c.Estado
      FROM Compras c
      JOIN proveedor p ON p.id_proveedor = c.id_proveedor
      WHERE c.Id_Compra = @id
    `);

  const compra = compraResult.recordset[0] || null;
  if (!compra) return null;

  const detalleResult = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT cd.Id_Repuesto, r.NombreRepuesto,
             cd.cantidad, cd.valor_unidad, cd.subtotal
      FROM Compras_Detalle cd
      JOIN Repuestos r ON r.Id_Repuesto = cd.Id_Repuesto
      WHERE cd.Id_Compra = @id
    `);

  compra.detalles = detalleResult.recordset;
  return compra;
};

const create = async ({ Fecha_compra, id_proveedor, Total, detalles }) => {
  const pool = getPool();
  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    // 1. Insertar cabecera
    const compraReq = new sql.Request(transaction);
    const compraResult = await compraReq
      .input('Fecha_compra',  sql.Date,          Fecha_compra)
      .input('id_proveedor',  sql.Int,            id_proveedor)
      .input('Total',         sql.Decimal(10, 2), Total)
      .query(`
        INSERT INTO Compras (Fecha_compra, id_proveedor, Total, Estado)
        OUTPUT INSERTED.Id_Compra, INSERTED.Fecha_compra,
               INSERTED.id_proveedor, INSERTED.Total, INSERTED.Estado
        VALUES (@Fecha_compra, @id_proveedor, @Total, 1)
      `);

    const compra = compraResult.recordset[0];
    const Id_Compra = compra.Id_Compra;

    // 2. Insertar detalle y actualizar stock por línea
    for (const det of detalles) {
      const detReq = new sql.Request(transaction);
      await detReq
        .input('Id_Compra',    sql.Int,            Id_Compra)
        .input('Id_Repuesto',  sql.Int,            det.Id_Repuesto)
        .input('cantidad',     sql.Int,            det.cantidad)
        .input('valor_unidad', sql.Decimal(10, 2), det.valor_unidad)
        .input('subtotal',     sql.Decimal(10, 2), det.subtotal)
        .query(`
          INSERT INTO Compras_Detalle (Id_Compra, Id_Repuesto, cantidad, valor_unidad, subtotal)
          VALUES (@Id_Compra, @Id_Repuesto, @cantidad, @valor_unidad, @subtotal)
        `);

      const stockReq = new sql.Request(transaction);
      await stockReq
        .input('cantidad',    sql.Int, det.cantidad)
        .input('Id_Repuesto', sql.Int, det.Id_Repuesto)
        .query(`
          UPDATE Repuestos
          SET Stock = Stock + @cantidad
          WHERE Id_Repuesto = @Id_Repuesto
        `);
    }

    await transaction.commit();
    return compra;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

const toggleEstado = async (id, estado) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id',     sql.Int, id)
    .input('Estado', sql.Bit, estado)
    .query(`
      UPDATE Compras
      SET Estado = @Estado
      OUTPUT INSERTED.Id_Compra, INSERTED.Estado
      WHERE Id_Compra = @id
    `);
  return result.recordset[0] || null;
};

module.exports = { findAll, findById, create, toggleEstado };
