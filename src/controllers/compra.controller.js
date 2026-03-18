const compraService = require('../services/compra.service');
const { createSchema } = require('../validators/compra.validator');
const { BadRequestError } = require('../errors/httpErrors');

const getAll = async (req, res, next) => {
  try {
    const compras = await compraService.getAll();
    res.json({ status: 'ok', data: compras });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const compra = await compraService.getById(Number(req.params.id));
    res.json({ status: 'ok', data: compra });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body, { abortEarly: false });
    if (error) throw new BadRequestError(error.details.map((d) => d.message).join(', '));

    const compra = await compraService.create(value);
    res.status(201).json({ status: 'ok', data: compra });
  } catch (err) {
    next(err);
  }
};

const patchEstado = async (req, res, next) => {
  try {
    const { Estado } = req.body;
    if (Estado === undefined) throw new BadRequestError('El campo Estado es obligatorio');

    const compra = await compraService.toggleEstado(Number(req.params.id), Estado);
    res.json({ status: 'ok', data: compra });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, patchEstado };
