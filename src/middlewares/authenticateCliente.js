const { verifyToken } = require('../utils/jwt');
const { UnauthorizedError, ForbiddenError } = require('../errors/httpErrors');

const authenticateCliente = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Token de acceso requerido'));
  }
  const token = authHeader.split(' ')[1];
  try {
    const user = verifyToken(token);
    if (user.tipo !== 'cliente') return next(new ForbiddenError('Acceso exclusivo para clientes'));
    req.cliente = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') return next(new UnauthorizedError('El token ha expirado'));
    return next(new UnauthorizedError('Token inválido'));
  }
};

module.exports = { authenticateCliente };
