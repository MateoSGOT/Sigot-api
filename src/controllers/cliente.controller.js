const clienteService = require('../services/cliente.service');
const { createSchema, updateSchema } = require('../validators/cliente.validator');
const { BadRequestError } = require('../errors/httpErrors');

const getAll = async (req, res, next) => {
  try {
    const clientes = await clienteService.getAll();
    res.json({ status: 'ok', data: clientes });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const cliente = await clienteService.getById(Number(req.params.id));
    res.json({ status: 'ok', data: cliente });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const cliente = await clienteService.create(value);
    res.status(201).json({ status: 'ok', data: cliente });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { error, value } = updateSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const cliente = await clienteService.update(Number(req.params.id), value);
    res.json({ status: 'ok', data: cliente });
  } catch (err) {
    next(err);
  }
};

const patchEstado = async (req, res, next) => {
  try {
    const { Estado } = req.body;
    if (Estado === undefined) throw new BadRequestError('El campo Estado es obligatorio');

    const cliente = await clienteService.toggleEstado(Number(req.params.id), Estado);
    res.json({ status: 'ok', data: cliente });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, patchEstado };
