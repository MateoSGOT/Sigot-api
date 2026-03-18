const empleadoService = require('../services/empleado.service');
const { createSchema, updateSchema } = require('../validators/empleado.validator');
const { BadRequestError, ForbiddenError } = require('../errors/httpErrors');

const getAll = async (req, res, next) => {
  try {
    const empleados = await empleadoService.getAll();
    res.json({ status: 'ok', data: empleados });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const empleado = await empleadoService.getById(Number(req.params.id));
    res.json({ status: 'ok', data: empleado });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const empleado = await empleadoService.create(value);
    res.status(201).json({ status: 'ok', data: empleado });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const existente = await empleadoService.getById(Number(req.params.id));
    if (existente.Id_Rol === 1) {
      throw new ForbiddenError('No se puede modificar un empleado Administrador');
    }

    const { error, value } = updateSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const empleado = await empleadoService.update(Number(req.params.id), value);
    res.json({ status: 'ok', data: empleado });
  } catch (err) {
    next(err);
  }
};

const patchEstado = async (req, res, next) => {
  try {
    const existente = await empleadoService.getById(Number(req.params.id));
    if (existente.Id_Rol === 1) {
      throw new ForbiddenError('No se puede modificar un empleado Administrador');
    }

    const { Estado } = req.body;
    if (Estado === undefined) throw new BadRequestError('El campo Estado es obligatorio');

    const empleado = await empleadoService.toggleEstado(Number(req.params.id), Estado);
    res.json({ status: 'ok', data: empleado });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, patchEstado };
