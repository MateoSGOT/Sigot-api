const { prisma } = require('../config/db');

const _fmt = ({ empleado, ...n }) => ({ ...n, empleado: empleado.Nombre });

const _include = { empleado: { select: { Nombre: true } } };

const findAll = async () => {
  const rows = await prisma.novedades.findMany({
    include: _include,
    orderBy: { Id_Novedad: 'desc' },
  });
  return rows.map(_fmt);
};

const findById = async (id) => {
  const row = await prisma.novedades.findUnique({
    where: { Id_Novedad: id },
    include: _include,
  });
  return row ? _fmt(row) : null;
};

const create = async ({ id_empleado, Descripcion, Fecha_Novedad, FechaRealizacion }) => {
  const row = await prisma.novedades.create({
    data: {
      id_empleado,
      Descripcion:      Descripcion      || null,
      Fecha_Novedad:    Fecha_Novedad    ? new Date(Fecha_Novedad)    : null,
      FechaRealizacion: FechaRealizacion ? new Date(FechaRealizacion) : null,
    },
    include: _include,
  });
  return _fmt(row);
};

const update = async (id, { id_empleado, Descripcion, Fecha_Novedad, FechaRealizacion }) => {
  const data = {};
  if (id_empleado      != null) data.id_empleado      = id_empleado;
  if (Descripcion      != null) data.Descripcion      = Descripcion;
  if (Fecha_Novedad    != null) data.Fecha_Novedad    = new Date(Fecha_Novedad);
  if (FechaRealizacion != null) data.FechaRealizacion = new Date(FechaRealizacion);
  try {
    const row = await prisma.novedades.update({
      where: { Id_Novedad: id },
      data,
      include: _include,
    });
    return _fmt(row);
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

module.exports = { findAll, findById, create, update };
