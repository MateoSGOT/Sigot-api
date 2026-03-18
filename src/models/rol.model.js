const { prisma } = require('../config/db');

const findAll = async () => {
  return prisma.rol.findMany({ orderBy: { Nombre: 'asc' } });
};

const findById = async (id) => {
  return prisma.rol.findUnique({ where: { Id_Rol: id } });
};

const findByNombre = async (nombre, excludeId = null) => {
  return prisma.rol.findFirst({
    where: {
      Nombre: nombre,
      ...(excludeId ? { NOT: { Id_Rol: excludeId } } : {}),
    },
    select: { Id_Rol: true },
  });
};

const create = async ({ Nombre, Descripcion }) => {
  return prisma.rol.create({
    data: { Nombre, Descripcion: Descripcion || null },
  });
};

const update = async (id, { Nombre, Descripcion }) => {
  const data = {};
  if (Nombre      != null) data.Nombre      = Nombre;
  if (Descripcion != null) data.Descripcion = Descripcion;
  try {
    return await prisma.rol.update({ where: { Id_Rol: id }, data });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

const toggleEstado = async (id, estado) => {
  try {
    return await prisma.rol.update({
      where: { Id_Rol: id },
      data: { Estado: Boolean(estado) },
      select: { Id_Rol: true, Estado: true },
    });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

module.exports = { findAll, findById, findByNombre, create, update, toggleEstado };
