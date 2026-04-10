const { prisma } = require('../config/db');

const _fmt = ({ categoria, ...r }) => ({ ...r, Categoria: categoria.Nombre });

const _include = { categoria: { select: { Nombre: true } } };

const findAll = async () => {
  const rows = await prisma.repuestos.findMany({
    where: { Estado: true },
    include: _include,
  });
  return rows.map(_fmt);
};

const findByNombre = async (nombre) => {
  return prisma.repuestos.findFirst({
    where: { NombreRepuesto: nombre, Estado: true },
    select: { Id_Repuesto: true, Stock: true },
  });
};

const findById = async (id) => {
  const row = await prisma.repuestos.findUnique({
    where: { Id_Repuesto: id },
    include: _include,
  });
  return row ? _fmt(row) : null;
};

const findStock = async () => {
  const rows = await prisma.repuestos.findMany({
    where: { Estado: true },
    include: _include,
    orderBy: { Stock: 'asc' },
  });
  return rows.map(_fmt);
};

const create = async ({ NombreRepuesto, Stock, Precio, Id_categoria }) => {
  const row = await prisma.repuestos.create({
    data: {
      NombreRepuesto,
      Stock:       Stock ?? 0,
      Precio,
      Id_categoria,
    },
    include: _include,
  });
  return _fmt(row);
};

const update = async (id, { NombreRepuesto, Stock, Precio, Id_categoria }) => {
  const data = {};
  if (NombreRepuesto != null) data.NombreRepuesto = NombreRepuesto;
  if (Stock         != null) data.Stock          = Stock;
  if (Precio        != null) data.Precio         = Precio;
  if (Id_categoria  != null) data.Id_categoria   = Id_categoria;
  try {
    const row = await prisma.repuestos.update({
      where: { Id_Repuesto: id },
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
    return await prisma.repuestos.update({
      where: { Id_Repuesto: id },
      data: { Estado: Boolean(estado) },
      select: { Id_Repuesto: true, NombreRepuesto: true, Stock: true, Estado: true },
    });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

module.exports = { findAll, findById, findByNombre, findStock, create, update, toggleEstado };
