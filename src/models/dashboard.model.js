const { prisma } = require('../config/db');

const getRepuestos = async () => {
  const rows = await prisma.repuestos.findMany({
    where: { Estado: true },
    include: { categoria: { select: { Nombre: true } } },
    orderBy: { Stock: 'asc' },
  });
  return rows.map(({ categoria, ...r }) => ({ ...r, categoria: categoria.Nombre }));
};

const getCompras = async () => {
  const agg = await prisma.compras.aggregate({
    where: { Estado: true },
    _count: { Id_Compra: true },
    _sum:   { Total: true },
  });

  const ultimas = await prisma.compras.findMany({
    where: { Estado: true },
    include: { proveedor: { select: { nombre: true } } },
    orderBy: { Id_Compra: 'desc' },
    take: 5,
  });

  return {
    totalCompras:   agg._count.Id_Compra,
    totalInvertido: Number(agg._sum.Total) ?? 0,
    ultimas: ultimas.map(({ proveedor, ...c }) => ({ ...c, proveedor: proveedor.nombre })),
  };
};

const getServicios = async () => {
  const rows = await prisma.servicios.findMany({
    where: { Estado: true },
    include: { _count: { select: { ordenServicios: true } } },
  });
  return rows
    .map(({ _count, ...s }) => ({ ...s, vecesUsado: _count.ordenServicios }))
    .sort((a, b) => b.vecesUsado - a.vecesUsado);
};

const getEmpleados = async () => {
  const rows = await prisma.empleado.findMany({
    where: { Estado: true },
    include: { rol: { select: { Nombre: true } } },
    orderBy: { Nombre: 'asc' },
  });
  return rows.map(({ rol, Password, tipoDoc, ...e }) => ({ ...e, rol: rol.Nombre }));
};

module.exports = { getRepuestos, getCompras, getServicios, getEmpleados };
