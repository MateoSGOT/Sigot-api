const { prisma } = require('../config/db');

const _fmt = ({ tipoDoc, ...c }) => ({ ...c, TipoDoc: tipoDoc.Nombre, Telefono: c.Contacto });

const findAll = async () => {
  const rows = await prisma.cliente.findMany({
    include: { tipoDoc: { select: { Nombre: true } } },
    orderBy: { Nombre: 'asc' },
  });
  return rows.map(_fmt);
};

const findById = async (id) => {
  const row = await prisma.cliente.findUnique({
    where: { Id_Cliente: id },
    include: { tipoDoc: { select: { Nombre: true } } },
  });
  return row ? _fmt(row) : null;
};

const create = async ({ Documento, Nombre, Id_TipoDoc, Foto, Correo, Contacto, Telefono }) => {
  const row = await prisma.cliente.create({
    data: { Documento, Nombre, Id_TipoDoc, Foto: Foto || null, Correo: Correo || null, Contacto: Contacto || Telefono || null },
    include: { tipoDoc: { select: { Nombre: true } } },
  });
  return _fmt(row);
};

const update = async (id, { Documento, Nombre, Id_TipoDoc, Foto, Correo, Contacto, Telefono }) => {
  const data = {};
  if (Documento  != null) data.Documento  = Documento;
  if (Nombre     != null) data.Nombre     = Nombre;
  if (Id_TipoDoc != null) data.Id_TipoDoc = Id_TipoDoc;
  if (Foto       != null) data.Foto       = Foto;
  if (Correo     != null) data.Correo     = Correo;
  const contacto = Contacto ?? Telefono;
  if (contacto   != null) data.Contacto   = contacto;
  try {
    const row = await prisma.cliente.update({
      where: { Id_Cliente: id },
      data,
      include: { tipoDoc: { select: { Nombre: true } } },
    });
    return _fmt(row);
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

const toggleEstado = async (id, estado) => {
  try {
    return await prisma.cliente.update({
      where: { Id_Cliente: id },
      data: { Estado: Boolean(estado) },
      select: { Id_Cliente: true, Estado: true },
    });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

module.exports = { findAll, findById, create, update, toggleEstado };
