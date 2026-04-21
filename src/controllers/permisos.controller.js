const { prisma } = require('../config/db');

const MODULE_MAP = {
  'Clientes':    'CLIENTES',
  'Vehículos':   'VEHICULOS',
  'Empleados':   'EMPLEADOS',
  'Repuestos':   'REPUESTOS',
  'Proveedores': 'PROVEEDORES',
  'Compras':     'COMPRAS',
  'Servicios':   'SERVICIOS',
  'Agenda':      'AGENDA',
  'Órdenes':     'ORDENES',
  'Novedades':   'NOVEDADES',
  'Roles':       'ROLES',
};

const ACTION_SUFFIXES = {
  Ver:      ['LISTAR', 'CONSULTAR'],
  Crear:    ['REGISTRAR'],
  Editar:   ['EDITAR'],
  Eliminar: ['CAMBIAR_ESTADO', 'ANULAR'],
};

const MATRIX_PREFIXES = Object.values(MODULE_MAP);

const getAll = async (req, res, next) => {
  try {
    const data = await prisma.permisos.findMany({ orderBy: { Nombre: 'asc' } });
    res.json({ status: 'ok', data: data.map(p => ({ ...p, Estado: 1 })) });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { Nombre, Descripcion } = req.body;
    const data = await prisma.permisos.create({ data: { Nombre, Descripcion } });
    res.status(201).json({ status: 'ok', data: { ...data, Estado: 1 } });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { Nombre, Descripcion } = req.body;
    const data = await prisma.permisos.update({ where: { Id_Permiso: id }, data: { Nombre, Descripcion } });
    res.json({ status: 'ok', data: { ...data, Estado: 1 } });
  } catch (err) { next(err); }
};

const toggleEstado = async (req, res, next) => {
  res.json({ status: 'ok', data: { message: 'Estado no aplica para permisos del sistema' } });
};

const getByRol = async (req, res, next) => {
  try {
    const id_rol = Number(req.params.id_rol);
    const rolPermisos = await prisma.roles_x_Permisos.findMany({
      where: { Id_Rol: id_rol },
      include: { permiso: true },
    });
    const assigned = new Set(rolPermisos.map(rp => rp.permiso.Nombre));

    const result = Object.entries(MODULE_MAP).map(([modulo, prefix]) => {
      const row = { Modulo: modulo };
      for (const [action, suffixes] of Object.entries(ACTION_SUFFIXES)) {
        row[action] = suffixes.some(s => assigned.has(`${prefix}.${s}`)) ? 1 : 0;
      }
      return row;
    });

    res.json({ status: 'ok', data: result });
  } catch (err) { next(err); }
};

const saveByRol = async (req, res, next) => {
  try {
    const id_rol = Number(req.params.id_rol);
    const entries = req.body;

    const desiredNames = new Set();
    for (const entry of entries) {
      const prefix = MODULE_MAP[entry.Modulo];
      if (!prefix) continue;
      if (entry.Ver)      ACTION_SUFFIXES.Ver.forEach(s => desiredNames.add(`${prefix}.${s}`));
      if (entry.Crear)    ACTION_SUFFIXES.Crear.forEach(s => desiredNames.add(`${prefix}.${s}`));
      if (entry.Editar)   ACTION_SUFFIXES.Editar.forEach(s => desiredNames.add(`${prefix}.${s}`));
      if (entry.Eliminar) ACTION_SUFFIXES.Eliminar.forEach(s => desiredNames.add(`${prefix}.${s}`));
    }

    const allPermisos = await prisma.permisos.findMany();
    const desiredIds = allPermisos
      .filter(p => desiredNames.has(p.Nombre))
      .map(p => p.Id_Permiso);

    const matrixPermisoIds = allPermisos
      .filter(p => MATRIX_PREFIXES.some(prefix => p.Nombre.startsWith(prefix + '.')))
      .map(p => p.Id_Permiso);

    await prisma.roles_x_Permisos.deleteMany({
      where: { Id_Rol: id_rol, Id_Permiso: { in: matrixPermisoIds } },
    });

    if (desiredIds.length > 0) {
      await prisma.roles_x_Permisos.createMany({
        data: desiredIds.map(Id_Permiso => ({ Id_Rol: id_rol, Id_Permiso })),
        skipDuplicates: true,
      });
    }

    res.json({ status: 'ok', data: { message: 'Permisos actualizados correctamente' } });
  } catch (err) { next(err); }
};

module.exports = { getAll, create, update, toggleEstado, getByRol, saveByRol };
