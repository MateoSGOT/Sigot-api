const { prisma } = require('../config/db');

const findAll = async () => {
  return prisma.servicios.findMany({ where: { Estado: true } });
};

const findById = async (id) => {
  return prisma.servicios.findUnique({ where: { Id_Servicio: id } });
};

const findByNombre = async (nombre, excludeId = null) => {
  return prisma.servicios.findFirst({
    where: {
      Nombre: nombre,
      ...(excludeId ? { NOT: { Id_Servicio: excludeId } } : {}),
    },
    select: { Id_Servicio: true },
  });
};

const create = async ({ Nombre, Descripcion, Precio }) => {
  return prisma.servicios.create({
    data: { Nombre, Descripcion: Descripcion || null, Precio },
  });
};

const update = async (id, { Nombre, Descripcion, Precio }) => {
  const data = {};
  if (Nombre      != null) data.Nombre      = Nombre;
  if (Descripcion != null) data.Descripcion = Descripcion;
  if (Precio      != null) data.Precio      = Precio;
  try {
    return await prisma.servicios.update({ where: { Id_Servicio: id }, data });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

const toggleEstado = async (id, estado) => {
  try {
    return await prisma.servicios.update({
      where: { Id_Servicio: id },
      data: { Estado: Boolean(estado) },
      select: { Id_Servicio: true, Nombre: true, Estado: true },
    });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

module.exports = { findAll, findById, findByNombre, create, update, toggleEstado };
