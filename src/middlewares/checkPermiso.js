const { prisma } = require('../config/db');
const { ForbiddenError } = require('../errors/httpErrors');

const checkPermiso = (nombrePermiso) => {
  return async (req, res, next) => {
    try {
      const idRol = req.user?.Id_Rol;
      if (!idRol) return next(new ForbiddenError('No tienes permiso para acceder a este recurso'));

      const permiso = await prisma.permisos.findFirst({
        where: { Nombre: nombrePermiso },
        select: { Id_Permiso: true },
      });

      if (!permiso) return next(new ForbiddenError('No tienes permiso para acceder a este recurso'));

      const asignado = await prisma.roles_x_Permisos.findUnique({
        where: {
          Id_Rol_Id_Permiso: {
            Id_Rol: idRol,
            Id_Permiso: permiso.Id_Permiso,
          },
        },
      });

      if (!asignado) return next(new ForbiddenError('No tienes permiso para acceder a este recurso'));

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { checkPermiso };
