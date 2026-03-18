const { prisma } = require('../config/db');

const findAll = async () => {
  return prisma.proveedor.findMany({ where: { Estado: true } });
};

const findById = async (id) => {
  return prisma.proveedor.findUnique({ where: { id_proveedor: id } });
};

const create = async ({ Documento, TipoProveedor, nombre, correo, contacto, ciudad, direccion, detalles }) => {
  return prisma.proveedor.create({
    data: {
      Documento,
      TipoProveedor,
      nombre,
      correo:    correo    || null,
      contacto:  contacto  || null,
      ciudad:    ciudad    || null,
      direccion: direccion || null,
      detalles:  detalles  || null,
    },
  });
};

const update = async (id, { Documento, TipoProveedor, nombre, correo, contacto, ciudad, direccion, detalles }) => {
  const data = {};
  if (Documento     != null) data.Documento     = Documento;
  if (TipoProveedor != null) data.TipoProveedor = TipoProveedor;
  if (nombre        != null) data.nombre        = nombre;
  if (correo        != null) data.correo        = correo;
  if (contacto      != null) data.contacto      = contacto;
  if (ciudad        != null) data.ciudad        = ciudad;
  if (direccion     != null) data.direccion     = direccion;
  if (detalles      != null) data.detalles      = detalles;
  try {
    return await prisma.proveedor.update({ where: { id_proveedor: id }, data });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

const toggleEstado = async (id, estado) => {
  try {
    return await prisma.proveedor.update({
      where: { id_proveedor: id },
      data: { Estado: Boolean(estado) },
      select: { id_proveedor: true, nombre: true, Estado: true },
    });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

module.exports = { findAll, findById, create, update, toggleEstado };
