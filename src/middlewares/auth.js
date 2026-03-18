const { verifyToken } = require('../utils/jwt');
const { UnauthorizedError, ForbiddenError } = require('../errors/httpErrors');

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Token de acceso requerido'));
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('El token ha expirado'));
    }
    return next(new UnauthorizedError('Token inválido'));
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(new ForbiddenError('No tienes permisos para realizar esta acción'));
    }
    next();
  };
};

module.exports = { authenticate, authorize };
