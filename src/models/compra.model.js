const { prisma } = require('../config/db');

const _fmt = (c) => ({
  Id_Compra:      c.Id_Compra,
  Fecha:          c.Fecha_compra,
  id_proveedor:   c.id_proveedor,
  Proveedor:      c.proveedor?.nombre || null,
  Id_Repuesto:    c.detalles?.[0]?.Id_Repuesto ?? null,
  Repuesto:       c.detalles?.[0]?.repuesto?.NombreRepuesto ?? null,
  Cantidad:       c.detalles?.[0]?.cantidad ?? null,
  PrecioUnitario: c.detalles?.[0]?.valor_unidad ?? null,
  Total:          c.Total,
  Estado:         c.Estado,
  Anulada:        !c.Estado,
});

const _include = {
  proveedor: { select: { nombre: true } },
  detalles: { include: { repuesto: { select: { NombreRepuesto: true } } }, take: 1 },
};

const findAll = async () => {
  const rows = await prisma.compras.findMany({ include: _include, orderBy: { Id_Compra: 'desc' } });
  return rows.map(_fmt);
};

const findById = async (id) => {
  const row = await prisma.compras.findUnique({
    where: { Id_Compra: id },
    include: {
      proveedor: { select: { nombre: true } },
      detalles: { include: { repuesto: { select: { NombreRepuesto: true } } } },
    },
  });
  if (!row) return null;
  return {
    ..._fmt(row),
    detalles: row.detalles.map(({ repuesto, ...d }) => ({ ...d, NombreRepuesto: repuesto.NombreRepuesto })),
  };
};

const create = async ({ Id_Proveedor, Id_Repuesto, Cantidad, PrecioUnitario, Fecha }) => {
  const cant = Number(Cantidad);
  const precio = Number(PrecioUnitario);
  const subtotal = cant * precio;

  return prisma.$transaction(async (tx) => {
    const compra = await tx.compras.create({
      data: { Fecha_compra: new Date(Fecha), id_proveedor: Number(Id_Proveedor), Total: subtotal },
    });
    await tx.compras_Detalle.create({
      data: { Id_Compra: compra.Id_Compra, Id_Repuesto: Number(Id_Repuesto), cantidad: cant, valor_unidad: precio, subtotal },
    });
    await tx.repuestos.update({ where: { Id_Repuesto: Number(Id_Repuesto) }, data: { Stock: { increment: cant } } });
    return compra;
  });
};

const toggleEstado = async (id, estado) => {
  try {
    return await prisma.compras.update({
      where: { Id_Compra: id },
      data: { Estado: Boolean(estado) },
      select: { Id_Compra: true, Estado: true },
    });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

module.exports = { findAll, findById, create, toggleEstado };
