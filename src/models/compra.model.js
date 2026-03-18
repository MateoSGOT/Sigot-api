const { prisma } = require('../config/db');

const _fmtCompra = ({ proveedor: p, ...c }) => ({ ...c, proveedor: p.nombre });

const findAll = async () => {
  const rows = await prisma.compras.findMany({
    where: { Estado: true },
    include: { proveedor: { select: { nombre: true } } },
    orderBy: { Id_Compra: 'desc' },
  });
  return rows.map(_fmtCompra);
};

const findById = async (id) => {
  const row = await prisma.compras.findUnique({
    where: { Id_Compra: id },
    include: {
      proveedor: { select: { nombre: true } },
      detalles: {
        include: { repuesto: { select: { NombreRepuesto: true } } },
      },
    },
  });
  if (!row) return null;

  const { proveedor: p, detalles, ...compra } = row;
  return {
    ...compra,
    proveedor: p.nombre,
    detalles: detalles.map(({ repuesto, ...d }) => ({
      ...d,
      NombreRepuesto: repuesto.NombreRepuesto,
    })),
  };
};

const create = async ({ Fecha_compra, id_proveedor, Total, detalles }) => {
  return prisma.$transaction(async (tx) => {
    const compra = await tx.compras.create({
      data: { Fecha_compra: new Date(Fecha_compra), id_proveedor, Total },
    });

    for (const det of detalles) {
      await tx.compras_Detalle.create({
        data: {
          Id_Compra:    compra.Id_Compra,
          Id_Repuesto:  det.Id_Repuesto,
          cantidad:     det.cantidad,
          valor_unidad: det.valor_unidad,
          subtotal:     det.subtotal,
        },
      });

      await tx.repuestos.update({
        where: { Id_Repuesto: det.Id_Repuesto },
        data:  { Stock: { increment: det.cantidad } },
      });
    }

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
