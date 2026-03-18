const { prisma } = require('../config/db');

const _fmtList = ({ rol, tipoDoc, Password, ...e }) => ({
  ...e,
  Rol:           rol.Nombre,
  TipoDocumento: tipoDoc.Nombre,
});

const findAll = async () => {
  const rows = await prisma.empleado.findMany({
    where: { Estado: true },
    include: {
      rol:     { select: { Nombre: true } },
      tipoDoc: { select: { Nombre: true } },
    },
  });
  return rows.map(_fmtList);
};

const findById = async (id) => {
  const row = await prisma.empleado.findUnique({
    where: { id_empleado: id },
    include: {
      rol:     { select: { Nombre: true } },
      tipoDoc: { select: { Nombre: true } },
    },
  });
  return row ? _fmtList(row) : null;
};

const findByCorreo = async (correo, excludeId = null) => {
  const row = await prisma.empleado.findFirst({
    where: {
      Correo: correo,
      ...(excludeId ? { NOT: { id_empleado: excludeId } } : {}),
    },
    include: { rol: { select: { Nombre: true } } },
  });
  if (!row) return null;
  const { rol, tipoDoc, ...rest } = row;
  return { ...rest, Rol: rol.Nombre };
};

const findByDocumento = async (documento, excludeId = null) => {
  return prisma.empleado.findFirst({
    where: {
      Documento: documento,
      ...(excludeId ? { NOT: { id_empleado: excludeId } } : {}),
    },
    select: { id_empleado: true },
  });
};

const create = async ({ Documento, Nombre, Id_TipoDoc, Id_Rol, Correo, Password, Foto }) => {
  const row = await prisma.empleado.create({
    data: {
      Documento,
      Nombre,
      Id_TipoDoc,
      Id_Rol,
      Correo,
      Password,
      Foto: Foto || null,
    },
    include: {
      rol:     { select: { Nombre: true } },
      tipoDoc: { select: { Nombre: true } },
    },
  });
  return _fmtList(row);
};

const update = async (id, { Documento, Nombre, Id_TipoDoc, Id_Rol, Correo, Foto }) => {
  const data = {};
  if (Documento  != null) data.Documento  = Documento;
  if (Nombre     != null) data.Nombre     = Nombre;
  if (Id_TipoDoc != null) data.Id_TipoDoc = Id_TipoDoc;
  if (Id_Rol     != null) data.Id_Rol     = Id_Rol;
  if (Correo     != null) data.Correo     = Correo;
  if (Foto       !== undefined) data.Foto = Foto ?? null;
  try {
    const row = await prisma.empleado.update({
      where: { id_empleado: id },
      data,
      include: {
        rol:     { select: { Nombre: true } },
        tipoDoc: { select: { Nombre: true } },
      },
    });
    return _fmtList(row);
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

const toggleEstado = async (id, estado) => {
  try {
    return await prisma.empleado.update({
      where: { id_empleado: id },
      data: { Estado: Boolean(estado) },
      select: { id_empleado: true, Nombre: true, Correo: true, Estado: true },
    });
  } catch (e) {
    if (e.code === 'P2025') return null;
    throw e;
  }
};

module.exports = { findAll, findById, findByCorreo, findByDocumento, create, update, toggleEstado };
