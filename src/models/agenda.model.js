const { getPool, sql } = require('../config/db');

const findAll = async () => {
  const pool = getPool();
  const result = await pool.request()
    .query(`
      SELECT a.Id_Agenda, a.Id_Cliente, c.Nombre AS cliente,
             a.Id_Vehiculo, v.Placa AS vehiculo,
             a.id_empleado, e.Nombre AS empleado,
             a.FechaAgendamiento, a.Hora, a.Estado
      FROM Agenda a
      JOIN Cliente  c ON c.Id_Cliente  = a.Id_Cliente
      JOIN Vehiculo v ON v.Id_Vehiculo = a.Id_Vehiculo
      JOIN Empleado e ON e.id_empleado = a.id_empleado
      WHERE a.Estado = 1
      ORDER BY a.FechaAgendamiento, a.Hora
    `);
  return result.recordset;
};

const findById = async (id) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query(`
      SELECT a.Id_Agenda, a.Id_Cliente, c.Nombre AS cliente,
             a.Id_Vehiculo, v.Placa AS vehiculo,
             a.id_empleado, e.Nombre AS empleado,
             a.FechaAgendamiento, a.Hora, a.Estado
      FROM Agenda a
      JOIN Cliente  c ON c.Id_Cliente  = a.Id_Cliente
      JOIN Vehiculo v ON v.Id_Vehiculo = a.Id_Vehiculo
      JOIN Empleado e ON e.id_empleado = a.id_empleado
      WHERE a.Id_Agenda = @id
    `);
  return result.recordset[0] || null;
};

const create = async ({ Id_Cliente, Id_Vehiculo, id_empleado, FechaAgendamiento, Hora }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('Id_Cliente',        sql.Int,          Id_Cliente)
    .input('Id_Vehiculo',       sql.Int,          Id_Vehiculo)
    .input('id_empleado',       sql.Int,          id_empleado)
    .input('FechaAgendamiento', sql.Date,         FechaAgendamiento)
    .input('Hora',              sql.VarChar(8),   Hora)
    .query(`
      INSERT INTO Agenda (Id_Cliente, Id_Vehiculo, id_empleado, FechaAgendamiento, Hora, Estado)
      OUTPUT INSERTED.Id_Agenda, INSERTED.Id_Cliente, INSERTED.Id_Vehiculo,
             INSERTED.id_empleado, INSERTED.FechaAgendamiento, INSERTED.Hora, INSERTED.Estado
      VALUES (@Id_Cliente, @Id_Vehiculo, @id_empleado, @FechaAgendamiento, @Hora, 1)
    `);
  return result.recordset[0];
};

const update = async (id, { Id_Cliente, Id_Vehiculo, id_empleado, FechaAgendamiento, Hora }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id',                sql.Int,         id)
    .input('Id_Cliente',        sql.Int,         Id_Cliente        ?? null)
    .input('Id_Vehiculo',       sql.Int,         Id_Vehiculo       ?? null)
    .input('id_empleado',       sql.Int,         id_empleado       ?? null)
    .input('FechaAgendamiento', sql.Date,        FechaAgendamiento || null)
    .input('Hora',              sql.VarChar(8),  Hora              || null)
    .query(`
      UPDATE Agenda
      SET Id_Cliente        = COALESCE(@Id_Cliente,        Id_Cliente),
          Id_Vehiculo       = COALESCE(@Id_Vehiculo,       Id_Vehiculo),
          id_empleado       = COALESCE(@id_empleado,       id_empleado),
          FechaAgendamiento = COALESCE(@FechaAgendamiento, FechaAgendamiento),
          Hora              = COALESCE(@Hora,              Hora)
      OUTPUT INSERTED.Id_Agenda, INSERTED.Id_Cliente, INSERTED.Id_Vehiculo,
             INSERTED.id_empleado, INSERTED.FechaAgendamiento, INSERTED.Hora, INSERTED.Estado
      WHERE Id_Agenda = @id
    `);
  return result.recordset[0] || null;
};

const toggleEstado = async (id, estado) => {
  const pool = getPool();
  const result = await pool.request()
    .input('id',     sql.Int, id)
    .input('Estado', sql.Bit, estado)
    .query(`
      UPDATE Agenda
      SET Estado = @Estado
      OUTPUT INSERTED.Id_Agenda, INSERTED.Estado
      WHERE Id_Agenda = @id
    `);
  return result.recordset[0] || null;
};

const createOrden = async (id_agenda, { Diagnostico, Kilometraje, FechaIngreso, FechaEntrega }) => {
  const pool = getPool();
  const result = await pool.request()
    .input('Id_Agenda',    sql.Int,          id_agenda)
    .input('Diagnostico',  sql.VarChar(500), Diagnostico  || null)
    .input('Kilometraje',  sql.Int,          Kilometraje  ?? null)
    .input('FechaIngreso', sql.Date,         FechaIngreso || null)
    .input('FechaEntrega', sql.Date,         FechaEntrega || null)
    .query(`
      INSERT INTO Orden_de_Trabajo (Id_Agenda, Diagnostico, Kilometraje, FechaIngreso, FechaEntrega, Estado)
      OUTPUT INSERTED.Id_Orden, INSERTED.Id_Agenda, INSERTED.Diagnostico,
             INSERTED.Kilometraje, INSERTED.FechaIngreso, INSERTED.FechaEntrega, INSERTED.Estado
      VALUES (@Id_Agenda, @Diagnostico, @Kilometraje, @FechaIngreso, @FechaEntrega, 1)
    `);
  return result.recordset[0];
};

module.exports = { findAll, findById, create, update, toggleEstado, createOrden };
