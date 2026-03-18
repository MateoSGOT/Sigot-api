const { getPool, sql } = require('../config/db');

const findAll = async () => {
  const pool = getPool();
  const result = await pool.request()
    .query(`
      SELECT o.Id_Orden, o.Id_Agenda,
             c.Nombre  AS cliente,
             v.Placa   AS vehiculo,
             e.Nombre  AS empleado,
             o.Diagnostico, o.Kilometraje,
             o.FechaIngreso, o.FechaEntrega, o.Estado
      FROM Orden_de_Trabajo o
      JOIN Agenda   a ON a.Id_Agenda  = o.Id_Agenda
      JOIN Cliente  c ON c.Id_Cliente = a.Id_Cliente
      JOIN Vehiculo v ON v.Id_Vehiculo = a.Id_Vehiculo
      JOIN Empleado e ON e.id_empleado = a.id_empleado
      WHERE o.Estado = 1
      ORDER BY o.Id_Orden DESC
    `);
  return result.recordset;
};

const findById = async (id) => {
  const pool = getPool();

  const ordenResult = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT o.Id_Orden, o.Id_Agenda,
             c.Nombre  AS cliente,
             v.Placa   AS vehiculo,
             e.Nombre  AS empleado,
             o.Diagnostico, o.Kilometraje,
             o.FechaIngreso, o.FechaEntrega, o.Estado
      FROM Orden_de_Trabajo o
      JOIN Agenda   a ON a.Id_Agenda   = o.Id_Agenda
      JOIN Cliente  c ON c.Id_Cliente  = a.Id_Cliente
      JOIN Vehiculo v ON v.Id_Vehiculo = a.Id_Vehiculo
      JOIN Empleado e ON e.id_empleado = a.id_empleado
      WHERE o.Id_Orden = @id
    `);

  const orden = ordenResult.recordset[0] || null;
  if (!orden) return null;

  const serviciosResult = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT xs.Id_Servicio, s.Nombre AS servicio,
             xs.precio_unitario, xs.subtotal
      FROM Orden_de_Trabajo_x_Servicios xs
      JOIN Servicios s ON s.Id_Servicio = xs.Id_Servicio
      WHERE xs.Id_Orden = @id
    `);

  const repuestosResult = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT xr.Id_Repuesto, r.NombreRepuesto AS repuesto,
             xr.cantidad, xr.precio_unitario, xr.subtotal
      FROM Orden_de_Trabajo_x_Repuestos xr
      JOIN Repuestos r ON r.Id_Repuesto = xr.Id_Repuesto
      WHERE xr.Id_Orden = @id
    `);

  orden.servicios  = serviciosResult.recordset;
  orden.repuestos  = repuestosResult.recordset;
  return orden;
};

const update = async (id, { Diagnostico, Kilometraje, FechaIngreso, FechaEntrega }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id',           sql.Int,          id)
    .input('Diagnostico',  sql.VarChar(500), Diagnostico  || null)
    .input('Kilometraje',  sql.Int,          Kilometraje  ?? null)
    .input('FechaIngreso', sql.Date,         FechaIngreso || null)
    .input('FechaEntrega', sql.Date,         FechaEntrega || null)
    .query(`
      UPDATE Orden_de_Trabajo
      SET Diagnostico  = COALESCE(@Diagnostico,  Diagnostico),
          Kilometraje  = COALESCE(@Kilometraje,  Kilometraje),
          FechaIngreso = COALESCE(@FechaIngreso, FechaIngreso),
          FechaEntrega = COALESCE(@FechaEntrega, FechaEntrega)
      OUTPUT INSERTED.Id_Orden, INSERTED.Id_Agenda, INSERTED.Diagnostico,
             INSERTED.Kilometraje, INSERTED.FechaIngreso, INSERTED.FechaEntrega, INSERTED.Estado
      WHERE Id_Orden = @id
    `);
  return result.recordset[0] || null;
};

const toggleEstado = async (id, estado) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id',     sql.Int, id)
    .input('Estado', sql.Bit, estado)
    .query(`
      UPDATE Orden_de_Trabajo
      SET Estado = @Estado
      OUTPUT INSERTED.Id_Orden, INSERTED.Estado
      WHERE Id_Orden = @id
    `);
  return result.recordset[0] || null;
};

const addServicio = async (id_orden, { Id_Servicio, precio_unitario, subtotal }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('Id_Orden',       sql.Int,            id_orden)
    .input('Id_Servicio',    sql.Int,            Id_Servicio)
    .input('precio_unitario',sql.Decimal(10, 2), precio_unitario)
    .input('subtotal',       sql.Decimal(10, 2), subtotal)
    .query(`
      INSERT INTO Orden_de_Trabajo_x_Servicios (Id_Orden, Id_Servicio, precio_unitario, subtotal)
      OUTPUT INSERTED.Id_Orden, INSERTED.Id_Servicio,
             INSERTED.precio_unitario, INSERTED.subtotal
      VALUES (@Id_Orden, @Id_Servicio, @precio_unitario, @subtotal)
    `);
  return result.recordset[0];
};

const addRepuesto = async (id_orden, { Id_Repuesto, cantidad, precio_unitario, subtotal }) => {
  const pool = getPool();
  const transaction = new sql.Transaction(pool);
  await transaction.begin();

  try {
    const insertReq = new sql.Request(transaction);
    const insertResult = await insertReq
      .input('Id_Orden',        sql.Int,            id_orden)
      .input('Id_Repuesto',     sql.Int,            Id_Repuesto)
      .input('cantidad',        sql.Int,            cantidad)
      .input('precio_unitario', sql.Decimal(10, 2), precio_unitario)
      .input('subtotal',        sql.Decimal(10, 2), subtotal)
      .query(`
        INSERT INTO Orden_de_Trabajo_x_Repuestos (Id_Orden, Id_Repuesto, cantidad, precio_unitario, subtotal)
        OUTPUT INSERTED.Id_Orden, INSERTED.Id_Repuesto, INSERTED.cantidad,
               INSERTED.precio_unitario, INSERTED.subtotal
        VALUES (@Id_Orden, @Id_Repuesto, @cantidad, @precio_unitario, @subtotal)
      `);

    const stockReq = new sql.Request(transaction);
    await stockReq
      .input('cantidad',    sql.Int, cantidad)
      .input('Id_Repuesto', sql.Int, Id_Repuesto)
      .query(`
        UPDATE Repuestos
        SET Stock = Stock - @cantidad
        WHERE Id_Repuesto = @Id_Repuesto
      `);

    await transaction.commit();
    return insertResult.recordset[0];
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

module.exports = { findAll, findById, update, toggleEstado, addServicio, addRepuesto };
