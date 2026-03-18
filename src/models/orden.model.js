const { prisma } = require('../config/db');

const _includeOrden = {
  agenda: {
    include: {
      cliente:  { select: { Nombre: true } },
      vehiculo: { select: { Placa:  true } },
      empleado: { select: { Nombre: true } },
    },
  },
};

const _fmtOrden = ({ agenda, ...o }) => ({
  ...o,
  Id_Agenda: o.Id_Agenda,
  cliente:  agenda.cliente.Nombre,
  vehiculo: agenda.vehiculo.Placa,
  empleado: agenda.empleado.Nombre,
});

const findAll = async () => {
  const rows = await prisma.orden_de_Trabajo.findMany({
    where: { Estado: true },
    include: _includeOrden,
    orderBy: { Id_Orden: 'desc' },
  });
  return rows.map(_fmtOrden);
};

const findById = async (id) => {
  const row = await prisma.orden_de_Trabajo.findUnique({
    where: { Id_Orden: id },
    include: {
      ..._includeOrden,
      servicios: {
        include: { servicio: { select: { Nombre: true } } },
      },
      repuestos: {
        include: { repuesto: { select: { NombreRepuesto: true } } },
      },
    },
  });
  if (!row) return null;

  const { agenda, servicios, repuestos, ...orden } = row;
  return {
    ...orden,
    cliente:  agenda.cliente.Nombre,
    vehiculo: agenda.vehiculo.Placa,
    empleado: agenda.empleado.Nombre,
    servicios: servicios.map(({ servicio, ...xs }) => ({
      ...xs,
      servicio: servicio.Nombre,
    })),
    repuestos: repuestos.map(({ repuesto, ...xr }) => ({
      ...xr,
      repuesto: repuesto.NombreRepuesto,
    })),
  };
};

const update = async (id, { Diagnostico, Kilometraje, FechaIngreso, FechaEntrega }) => {
  const data = {};
  if (Diagnostico  != null) data.Diagnostico  = Diagnostico;
  if (Kilometraje  != null) data.Kilometraje  = Kilometraje;
  if (FechaIngreso != null) data.FechaIngreso = new Date(FechaIngreso);
  if (FechaEntrega != null) data.FechaEntrega = new Date(FechaEntrega);
  try {
    return await prisma.orden_de_Trabajo.update({ where: { Id_Orden: id }, data });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

const toggleEstado = async (id, estado) => {
  try {
    return await prisma.orden_de_Trabajo.update({
      where: { Id_Orden: id },
      data: { Estado: Boolean(estado) },
      select: { Id_Orden: true, Estado: true },
    });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

const addServicio = async (id_orden, { Id_Servicio, precio_unitario, subtotal }) => {
  return prisma.orden_de_Trabajo_x_Servicios.create({
    data: { Id_Orden: id_orden, Id_Servicio, precio_unitario, subtotal },
  });
};

const addRepuesto = async (id_orden, { Id_Repuesto, cantidad, precio_unitario, subtotal }) => {
  return prisma.$transaction(async (tx) => {
    const row = await tx.orden_de_Trabajo_x_Repuestos.create({
      data: { Id_Orden: id_orden, Id_Repuesto, cantidad, precio_unitario, subtotal },
    });
    await tx.repuestos.update({
      where: { Id_Repuesto },
      data:  { Stock: { decrement: cantidad } },
    });
    return row;
  });
};

module.exports = { findAll, findById, update, toggleEstado, addServicio, addRepuesto };
