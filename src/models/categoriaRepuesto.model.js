const { prisma } = require('../config/db');

const findAll = async () => {
  return prisma.categoriaRepuestos.findMany({ where: { Estado: true } });
};

const findById = async (id) => {
  return prisma.categoriaRepuestos.findUnique({ where: { Id_categoria: id } });
};

const findByNombre = async (nombre, excludeId = null) => {
  return prisma.categoriaRepuestos.findFirst({
    where: {
      Nombre: nombre,
      ...(excludeId ? { NOT: { Id_categoria: excludeId } } : {}),
    },
    select: { Id_categoria: true },
  });
};

const create = async ({ Nombre, Descripcion }) => {
  return prisma.categoriaRepuestos.create({
    data: { Nombre, Descripcion: Descripcion || null },
  });
};

const update = async (id, { Nombre, Descripcion }) => {
  const data = {};
  if (Nombre      != null) data.Nombre      = Nombre;
  if (Descripcion != null) data.Descripcion = Descripcion;
  try {
    return await prisma.categoriaRepuestos.update({
      where: { Id_categoria: id },
      data,
    });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

const toggleEstado = async (id, estado) => {
  try {
    return await prisma.categoriaRepuestos.update({
      where: { Id_categoria: id },
      data: { Estado: Boolean(estado) },
      select: { Id_categoria: true, Nombre: true, Estado: true },
    });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

module.exports = { findAll, findById, findByNombre, create, update, toggleEstado };
