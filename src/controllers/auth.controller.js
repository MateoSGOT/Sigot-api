const authService = require('../services/auth.service');
const { loginSchema, registroSchema } = require('../validators/auth.validator');
const { BadRequestError } = require('../errors/httpErrors');

const login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const result = await authService.login(value.Correo, value.Password);
    res.json({ status: 'ok', ...result });
  } catch (err) {
    next(err);
  }
};

const registro = async (req, res, next) => {
  try {
    const { error, value } = registroSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const result = await authService.registro(value);
    res.status(201).json({ status: 'ok', ...result });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const result = await authService.logout();
    res.json({ status: 'ok', ...result });
  } catch (err) {
    next(err);
  }
};

const recuperarPassword = async (req, res, next) => {
  try {
    const { Correo } = req.body;
    if (!Correo) throw new BadRequestError('El correo es obligatorio');

    const result = await authService.recuperarPassword(Correo);
    res.json({ status: 'ok', ...result });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { Correo, Codigo, NuevaPassword } = req.body;
    if (!Correo)       throw new BadRequestError('El correo es obligatorio');
    if (!Codigo)       throw new BadRequestError('El código es obligatorio');
    if (!NuevaPassword) throw new BadRequestError('La nueva contraseña es obligatoria');
    if (NuevaPassword.length < 6) throw new BadRequestError('La contraseña debe tener al menos 6 caracteres');

    const result = await authService.resetPassword(Correo, Codigo, NuevaPassword);
    res.json({ status: 'ok', ...result });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, registro, logout, recuperarPassword, resetPassword };
