const AppError = require('./AppError');

class BadRequestError extends AppError {
  constructor(message = 'Solicitud inválida') {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Acceso denegado') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflicto con el estado actual del recurso') {
    super(message, 409);
  }
}

module.exports = { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError };
