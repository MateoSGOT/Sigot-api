const compraService = require('../services/compra.service');
const { createSchema } = require('../validators/compra.validator');
const { BadRequestError } = require('../errors/httpErrors');

const getAll = async (req, res, next) => {
  try { res.json({ status: 'ok', data: await compraService.getAll() }); } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try { res.json({ status: 'ok', data: await compraService.getById(Number(req.params.id)) }); } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body, { abortEarly: false });
    if (error) throw new BadRequestError(error.details.map(d => d.message).join(', '));
    const compra = await compraService.create(value);
    res.status(201).json({ status: 'ok', data: compra });
  } catch (err) { next(err); }
};

const patchEstado = async (req, res, next) => {
  try {
    const { Estado } = req.body;
    if (Estado === undefined) throw new BadRequestError('El campo Estado es obligatorio');
    res.json({ status: 'ok', data: await compraService.toggleEstado(Number(req.params.id), Estado) });
  } catch (err) { next(err); }
};

const anular = async (req, res, next) => {
  try {
    res.json({ status: 'ok', data: await compraService.toggleEstado(Number(req.params.id), false) });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, patchEstado, anular };
