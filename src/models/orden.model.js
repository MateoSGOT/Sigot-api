const { prisma } = require('../config/db');

const FLUJO_TO_NUM = { 'Pendiente': 1, 'En proceso': 2, 'Realizado': 3 };
const NUM_TO_FLUJO = { 1: 'Pendiente', 2: 'En proceso', 3: 'Realizado' };

const _includeOrden = {
  agenda: {
    include: {
      cliente:  { select: { Nombre: true } },
      vehiculo: { select: { Placa:  true } },
      empleado: { select: { Nombre: true } },
    },
  },
};

const _fmtOrden = ({ agenda, ...o }) => {
  const estadoNum = o.Estado ? (FLUJO_TO_NUM[o.EstadoFlujo] ?? 1) : 0;
  return {
    ...o,
    Estado:      estadoNum,
    EstadoFlujo: o.EstadoFlujo,
    mano_de_obra: o.ManoDeObra != null ? Number(o.ManoDeObra) : null,
    cliente:  agenda.cliente.Nombre,
    vehiculo: agenda.vehiculo.Placa,
    empleado: agenda.empleado.Nombre,
  };
};

const findAll = async () => {
  const rows = await prisma.orden_de_Trabajo.findMany({ include: _includeOrden, orderBy: { Id_Orden: 'desc' } });
  return rows.map(_fmtOrden);
};

const findById = async (id) => {
  const row = await prisma.orden_de_Trabajo.findUnique({
    where: { Id_Orden: id },
    include: {
      ..._includeOrden,
      servicios: { include: { servicio: { select: { Nombre: true } } } },
      repuestos:  { include: { repuesto: { select: { NombreRepuesto: true } } } },
    },
  });
  if (!row) return null;
  const { agenda, servicios, repuestos, ...orden } = row;
  const estadoNum = orden.Estado ? (FLUJO_TO_NUM[orden.EstadoFlujo] ?? 1) : 0;
  return {
    ...orden,
    Estado:      estadoNum,
    EstadoFlujo: orden.EstadoFlujo,
    mano_de_obra: orden.ManoDeObra != null ? Number(orden.ManoDeObra) : null,
    cliente:  agenda.cliente.Nombre,
    vehiculo: agenda.vehiculo.Placa,
    empleado: agenda.empleado.Nombre,
    servicios: servicios.map(({ servicio, ...xs }) => ({ ...xs, servicio: servicio.Nombre, precio_unitario: Number(xs.precio_unitario), subtotal: Number(xs.subtotal) })),
    repuestos:  repuestos.map(({ repuesto, ...xr }) => ({ ...xr, repuesto: repuesto.NombreRepuesto, precio_unitario: Number(xr.precio_unitario), subtotal: Number(xr.subtotal) })),
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

const toggleEstado = async (id, estadoNum) => {
  try {
    const num = Number(estadoNum);
    const boolEstado = num !== 0;
    const flujo = NUM_TO_FLUJO[num] || 'Pendiente';
    return await prisma.orden_de_Trabajo.update({
      where: { Id_Orden: id },
      data: { Estado: boolEstado, EstadoFlujo: boolEstado ? flujo : 'Pendiente' },
      select: { Id_Orden: true, Estado: true, EstadoFlujo: true },
    });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

const cambiarFlujo = async (id, estadoFlujo) => {
  try {
    return await prisma.orden_de_Trabajo.update({
      where: { Id_Orden: id },
      data: { EstadoFlujo: estadoFlujo },
      select: { Id_Orden: true, EstadoFlujo: true },
    });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

const actualizarManoDeObra = async (id, manoDeObra) => {
  try {
    return await prisma.orden_de_Trabajo.update({
      where: { Id_Orden: id },
      data: { ManoDeObra: manoDeObra },
      select: { Id_Orden: true, ManoDeObra: true },
    });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

const addServicio = async (id_orden, { Id_Servicio, precio_unitario, subtotal }) => {
  const precio = Number(precio_unitario);
  const sub = subtotal != null ? Number(subtotal) : precio;
  return prisma.orden_de_Trabajo_x_Servicios.create({
    data: { Id_Orden: id_orden, Id_Servicio: Number(Id_Servicio), precio_unitario: precio, subtotal: sub },
  });
};

const deleteServicio = async (id_orden, id_servicio) => {
  try {
    return await prisma.orden_de_Trabajo_x_Servicios.delete({
      where: { Id_Orden_Id_Servicio: { Id_Orden: id_orden, Id_Servicio: id_servicio } },
    });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

const addRepuesto = async (id_orden, { Id_Repuesto, cantidad, precio_unitario, subtotal }) => {
  const cant = Number(cantidad);
  const precio = Number(precio_unitario);
  const sub = subtotal != null ? Number(subtotal) : cant * precio;
  return prisma.$transaction(async (tx) => {
    const row = await tx.orden_de_Trabajo_x_Repuestos.create({
      data: { Id_Orden: id_orden, Id_Repuesto: Number(Id_Repuesto), cantidad: cant, precio_unitario: precio, subtotal: sub },
    });
    await tx.repuestos.update({ where: { Id_Repuesto: Number(Id_Repuesto) }, data: { Stock: { decrement: cant } } });
    return row;
  });
};

const deleteRepuesto = async (id_orden, id_repuesto) => {
  try {
    return await prisma.$transaction(async (tx) => {
      const row = await tx.orden_de_Trabajo_x_Repuestos.delete({
        where: { Id_Orden_Id_Repuesto: { Id_Orden: id_orden, Id_Repuesto: id_repuesto } },
      });
      await tx.repuestos.update({ where: { Id_Repuesto: id_repuesto }, data: { Stock: { increment: row.cantidad } } });
      return row;
    });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

module.exports = {
  findAll, findById, update, toggleEstado,
  cambiarFlujo, actualizarManoDeObra,
  addServicio, deleteServicio,
  addRepuesto, deleteRepuesto,
};
