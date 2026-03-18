const { getPool, sql } = require('../config/db');

const getRepuestos = async () => {
  const pool = getPool();
  const result = await pool.request()
    .query(`
      SELECT r.Id_Repuesto, r.NombreRepuesto, r.Stock, r.Precio,
             c.Nombre AS categoria
      FROM Repuestos r
      JOIN CategoriaRepuestos c ON c.Id_categoria = r.Id_categoria
      WHERE r.Estado = 1
      ORDER BY r.Stock ASC
    `);
  return result.recordset;
};

const getCompras = async () => {
  const pool = getPool();

  const resumenResult = await pool.request()
    .query(`
      SELECT COUNT(*)        AS totalCompras,
             SUM(Total)      AS totalInvertido
      FROM Compras
      WHERE Estado = 1
    `);

  const ultimasResult = await pool.request()
    .query(`
      SELECT TOP 5
             c.Id_Compra, c.Fecha_compra, p.nombre AS proveedor,
             c.Total
      FROM Compras c
      JOIN proveedor p ON p.id_proveedor = c.id_proveedor
      WHERE c.Estado = 1
      ORDER BY c.Id_Compra DESC
    `);

  return {
    totalCompras:   resumenResult.recordset[0].totalCompras,
    totalInvertido: resumenResult.recordset[0].totalInvertido ?? 0,
    ultimas:        ultimasResult.recordset,
  };
};

const getServicios = async () => {
  const pool = getPool();
  const result = await pool.request()
    .query(`
      SELECT s.Id_Servicio, s.Nombre, s.Precio,
             COUNT(xs.Id_Orden) AS vecesUsado
      FROM Servicios s
      LEFT JOIN Orden_de_Trabajo_x_Servicios xs ON xs.Id_Servicio = s.Id_Servicio
      WHERE s.Estado = 1
      GROUP BY s.Id_Servicio, s.Nombre, s.Precio
      ORDER BY vecesUsado DESC
    `);
  return result.recordset;
};

const getEmpleados = async () => {
  const pool = getPool();
  const result = await pool.request()
    .query(`
      SELECT e.id_empleado, e.Nombre, e.Correo, e.Foto,
             r.Nombre AS rol
      FROM Empleado e
      JOIN Rol r ON r.Id_Rol = e.Id_Rol
      WHERE e.Estado = 1
      ORDER BY e.Nombre
    `);
  return result.recordset;
};

module.exports = { getRepuestos, getCompras, getServicios, getEmpleados };
