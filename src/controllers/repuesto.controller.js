const repuestoService = require('../services/repuesto.service');
const { createSchema, updateSchema } = require('../validators/repuesto.validator');
const { BadRequestError } = require('../errors/httpErrors');

const getAll = async (req, res, next) => {
  try {
    const repuestos = await repuestoService.getAll();
    res.json({ status: 'ok', data: repuestos });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const repuesto = await repuestoService.getById(Number(req.params.id));
    res.json({ status: 'ok', data: repuesto });
  } catch (err) {
    next(err);
  }
};

const getStock = async (req, res, next) => {
  try {
    const stock = await repuestoService.getStock();
    res.json({ status: 'ok', data: stock });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const repuesto = await repuestoService.create(value);
    res.status(201).json({ status: 'ok', data: repuesto });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { error, value } = updateSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const repuesto = await repuestoService.update(Number(req.params.id), value);
    res.json({ status: 'ok', data: repuesto });
  } catch (err) {
    next(err);
  }
};

const patchEstado = async (req, res, next) => {
  try {
    const { Estado } = req.body;
    if (Estado === undefined) throw new BadRequestError('El campo Estado es obligatorio');

    const repuesto = await repuestoService.toggleEstado(Number(req.params.id), Estado);
    res.json({ status: 'ok', data: repuesto });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, getStock, create, update, patchEstado };
