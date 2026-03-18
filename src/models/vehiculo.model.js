const { prisma } = require('../config/db');

const _fmt = ({ cliente, marca, ...v }) => ({
  ...v,
  Cliente: cliente.Nombre,
  Marca:   marca.Nombre,
});

const _include = {
  cliente: { select: { Nombre: true } },
  marca:   { select: { Nombre: true } },
};

const findAll = async () => {
  const rows = await prisma.vehiculo.findMany({
    where: { Estado: true },
    include: _include,
    orderBy: { Placa: 'asc' },
  });
  return rows.map(_fmt);
};

const findById = async (id) => {
  const row = await prisma.vehiculo.findUnique({
    where: { Id_Vehiculo: id },
    include: _include,
  });
  return row ? _fmt(row) : null;
};

const findByPlaca = async (placa, excludeId = null) => {
  return prisma.vehiculo.findFirst({
    where: {
      Placa: placa,
      ...(excludeId ? { NOT: { Id_Vehiculo: excludeId } } : {}),
    },
    select: { Id_Vehiculo: true },
  });
};

const findByVIN = async (vin, excludeId = null) => {
  return prisma.vehiculo.findFirst({
    where: {
      VIN: vin,
      ...(excludeId ? { NOT: { Id_Vehiculo: excludeId } } : {}),
    },
    select: { Id_Vehiculo: true },
  });
};

const create = async ({ Placa, VIN, Id_Cliente, Id_Marca, Modelo, Año, Color, NumeroEjes }) => {
  const row = await prisma.vehiculo.create({
    data: {
      Placa,
      VIN:        VIN        || null,
      Id_Cliente,
      Id_Marca,
      Modelo,
      Año,
      Color:      Color      || null,
      NumeroEjes: NumeroEjes ?? null,
    },
    include: _include,
  });
  return _fmt(row);
};

const update = async (id, { Placa, VIN, Id_Cliente, Id_Marca, Modelo, Año, Color, NumeroEjes }) => {
  const data = {};
  if (Placa       != null) data.Placa       = Placa;
  if (VIN         != null) data.VIN         = VIN;
  if (Id_Cliente  != null) data.Id_Cliente  = Id_Cliente;
  if (Id_Marca    != null) data.Id_Marca    = Id_Marca;
  if (Modelo      != null) data.Modelo      = Modelo;
  if (Año         != null) data.Año         = Año;
  if (Color       != null) data.Color       = Color;
  if (NumeroEjes  != null) data.NumeroEjes  = NumeroEjes;
  try {
    const row = await prisma.vehiculo.update({
      where: { Id_Vehiculo: id },
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
    return await prisma.vehiculo.update({
      where: { Id_Vehiculo: id },
      data: { Estado: Boolean(estado) },
      select: { Id_Vehiculo: true, Estado: true },
    });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

module.exports = { findAll, findById, findByPlaca, findByVIN, create, update, toggleEstado };
