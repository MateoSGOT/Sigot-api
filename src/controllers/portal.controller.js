const { prisma } = require('../config/db');
const { NotFoundError } = require('../errors/httpErrors');

const _fmtVehiculo = ({ cliente, marca, ...v }) => ({
  ...v,
  Anio:    v.Año ?? v.Anio,
  Cliente: cliente.Nombre,
  Marca:   marca.Nombre,
});

const _includeVehiculo = {
  cliente: { select: { Nombre: true } },
  marca:   { select: { Nombre: true } },
};

const FLUJO_TO_NUM = { 'Pendiente': 2, 'En proceso': 3, 'Realizado': 0 };

const _fmtOrden = ({ agenda, ...o }) => ({
  ...o,
  Estado:      o.Estado ? (FLUJO_TO_NUM[o.EstadoFlujo] ?? 2) : 4,
  EstadoFlujo: o.EstadoFlujo,
  mano_de_obra: o.ManoDeObra != null ? Number(o.ManoDeObra) : null,
  Id_Vehiculo: agenda.Id_Vehiculo,
  Placa:       agenda.vehiculo.Placa,
  Vehiculo:    agenda.vehiculo.Placa,
  Cliente:     agenda.cliente.Nombre,
  Empleado:    agenda.empleado.Nombre,
  FechaAgendamiento: agenda.FechaAgendamiento,
});

const getVehiculos = async (req, res, next) => {
  try {
    const rows = await prisma.vehiculo.findMany({
      where: { Id_Cliente: req.cliente.id_cliente, Estado: true },
      include: _includeVehiculo,
      orderBy: { Placa: 'asc' },
    });
    res.json({ status: 'ok', data: rows.map(_fmtVehiculo) });
  } catch (err) { next(err); }
};

const getOrdenes = async (req, res, next) => {
  try {
    const rows = await prisma.orden_de_Trabajo.findMany({
      where: {
        agenda: { vehiculo: { Id_Cliente: req.cliente.id_cliente } },
      },
      include: {
        agenda: {
          include: {
            vehiculo: { select: { Placa: true, Id_Vehiculo: true } },
            cliente:  { select: { Nombre: true } },
            empleado: { select: { Nombre: true } },
          },
        },
      },
      orderBy: { Id_Orden: 'desc' },
    });
    res.json({ status: 'ok', data: rows.map(_fmtOrden) });
  } catch (err) { next(err); }
};

const getOrdenById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const row = await prisma.orden_de_Trabajo.findUnique({
      where: { Id_Orden: id },
      include: {
        agenda: {
          include: {
            vehiculo: { select: { Placa: true, Id_Vehiculo: true } },
            cliente:  { select: { Nombre: true, Id_Cliente: true } },
            empleado: { select: { Nombre: true } },
          },
        },
        servicios: { include: { servicio: { select: { Nombre: true } } } },
        repuestos:  { include: { repuesto: { select: { NombreRepuesto: true } } } },
      },
    });
    if (!row) return next(new NotFoundError('Orden no encontrada'));
    if (row.agenda.cliente.Id_Cliente !== req.cliente.id_cliente) {
      return res.status(403).json({ status: 'error', message: 'Sin acceso a esta orden' });
    }
    const { agenda, servicios, repuestos, ...o } = row;
    const estadoNum = o.Estado ? (FLUJO_TO_NUM[o.EstadoFlujo] ?? 2) : 4;
    res.json({
      status: 'ok',
      data: {
        ...o,
        Estado:      estadoNum,
        mano_de_obra: o.ManoDeObra != null ? Number(o.ManoDeObra) : null,
        Id_Vehiculo: agenda.Id_Vehiculo,
        Placa:       agenda.vehiculo.Placa,
        Vehiculo:    agenda.vehiculo.Placa,
        Cliente:     agenda.cliente.Nombre,
        Empleado:    agenda.empleado.Nombre,
        FechaAgendamiento: agenda.FechaAgendamiento,
        servicios: servicios.map(({ servicio, ...xs }) => ({
          ...xs,
          Nombre: servicio.Nombre,
          precio_unitario: Number(xs.precio_unitario),
          subtotal: Number(xs.subtotal),
        })),
        repuestos: repuestos.map(({ repuesto, ...xr }) => ({
          ...xr,
          Nombre: repuesto.NombreRepuesto,
          precio_unitario: Number(xr.precio_unitario),
          subtotal: Number(xr.subtotal),
        })),
      },
    });
  } catch (err) { next(err); }
};

const updatePerfil = async (req, res, next) => {
  try {
    const { Correo, Contacto, Telefono } = req.body;
    const data = {};
    if (Correo   != null) data.Correo   = Correo;
    if (Contacto != null) data.Contacto = Contacto;
    if (Telefono != null) data.Contacto = Telefono;
    const row = await prisma.cliente.update({
      where: { Id_Cliente: req.cliente.id_cliente },
      data,
      include: { tipoDoc: { select: { Nombre: true } } },
    });
    const { tipoDoc, ...c } = row;
    res.json({ status: 'ok', data: { ...c, TipoDocumento: tipoDoc?.Nombre || null, Telefono: c.Contacto || null } });
  } catch (err) { next(err); }
};

module.exports = { getVehiculos, getOrdenes, getOrdenById, updatePerfil };
