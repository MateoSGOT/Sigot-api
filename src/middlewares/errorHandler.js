const AppError = require('../errors/AppError');

// Números de error de SQL Server que corresponden a errores del cliente (400)
const SQL_CLIENT_ERRORS = {
  2627: 'Ya existe un registro con ese valor único (duplicado)',
  2601: 'Ya existe un registro con ese valor único (duplicado)',
  547:  'El valor enviado no existe en una tabla relacionada (FK inválida)',
  515:  'Un campo obligatorio recibió un valor nulo',
  8152: 'El valor excede la longitud máxima permitida para ese campo',
};

const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';

  // Error operacional conocido (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(isDev && { stack: err.stack }),
    });
  }

  // Error de validación de Joi
  if (err.isJoi) {
    return res.status(400).json({
      status: 'error',
      message: err.details[0].message,
    });
  }

  // Errores de SQL Server que son culpa del cliente
  if (err.number && SQL_CLIENT_ERRORS[err.number]) {
    return res.status(400).json({
      status: 'error',
      message: SQL_CLIENT_ERRORS[err.number],
      ...(isDev && { detail: err.message }),
    });
  }

  // Error inesperado (bug, error de programación)
  console.error('ERROR NO CONTROLADO:', err);
  return res.status(500).json({
    status: 'error',
    message: isDev ? err.message : 'Error interno del servidor',
    ...(isDev && { stack: err.stack }),
  });
};

module.exports = errorHandler;
