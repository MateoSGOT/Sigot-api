const { prisma } = require('../config/db');

const _include = {
  cliente:  { select: { Nombre: true } },
  vehiculo: { select: { Placa:  true } },
  empleado: { select: { Nombre: true } },
};

const _fmt = ({ cliente, vehiculo, empleado, ...a }) => ({
  ...a,
  cliente:  cliente.Nombre,
  vehiculo: vehiculo.Placa,
  empleado: empleado.Nombre,
});

const findAll = async () => {
  const rows = await prisma.agenda.findMany({
    where: { Estado: true },
    include: _include,
    orderBy: [{ FechaAgendamiento: 'asc' }, { Hora: 'asc' }],
  });
  return rows.map(_fmt);
};

const findById = async (id) => {
  const row = await prisma.agenda.findUnique({
    where: { Id_Agenda: id },
    include: _include,
  });
  return row ? _fmt(row) : null;
};

const create = async ({ Id_Cliente, Id_Vehiculo, id_empleado, FechaAgendamiento, Hora }) => {
  const row = await prisma.agenda.create({
    data: {
      Id_Cliente,
      Id_Vehiculo,
      id_empleado,
      FechaAgendamiento: new Date(FechaAgendamiento),
      Hora,
    },
    include: _include,
  });
  return _fmt(row);
};

const update = async (id, { Id_Cliente, Id_Vehiculo, id_empleado, FechaAgendamiento, Hora }) => {
  const data = {};
  if (Id_Cliente        != null) data.Id_Cliente        = Id_Cliente;
  if (Id_Vehiculo       != null) data.Id_Vehiculo       = Id_Vehiculo;
  if (id_empleado       != null) data.id_empleado       = id_empleado;
  if (FechaAgendamiento != null) data.FechaAgendamiento = new Date(FechaAgendamiento);
  if (Hora              != null) data.Hora              = Hora;
  try {
    const row = await prisma.agenda.update({
      where: { Id_Agenda: id },
      data,
      include: _include,
    });
    return _fmt(row);
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

const toggleEstado = async (id, estado) => {
  try {
    return await prisma.agenda.update({
      where: { Id_Agenda: id },
      data: { Estado: Boolean(estado) },
      select: { Id_Agenda: true, Estado: true },
    });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

const createOrden = async (id_agenda, { Diagnostico, Kilometraje, FechaIngreso, FechaEntrega }) => {
  return prisma.orden_de_Trabajo.create({
    data: {
      Id_Agenda:    id_agenda,
      Diagnostico:  Diagnostico  || null,
      Kilometraje:  Kilometraje  ?? null,
      FechaIngreso: FechaIngreso ? new Date(FechaIngreso) : null,
      FechaEntrega: FechaEntrega ? new Date(FechaEntrega) : null,
    },
  });
};

module.exports = { findAll, findById, create, update, toggleEstado, createOrden };
