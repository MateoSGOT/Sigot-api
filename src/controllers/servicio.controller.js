const servicioService = require('../services/servicio.service');
const { createSchema, updateSchema } = require('../validators/servicio.validator');
const { BadRequestError } = require('../errors/httpErrors');

const getAll = async (req, res, next) => {
  try {
    const servicios = await servicioService.getAll();
    res.json({ status: 'ok', data: servicios });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const servicio = await servicioService.getById(Number(req.params.id));
    res.json({ status: 'ok', data: servicio });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const servicio = await servicioService.create(value);
    res.status(201).json({ status: 'ok', data: servicio });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { error, value } = updateSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const servicio = await servicioService.update(Number(req.params.id), value);
    res.json({ status: 'ok', data: servicio });
  } catch (err) {
    next(err);
  }
};

const patchEstado = async (req, res, next) => {
  try {
    const { Estado } = req.body;
    if (Estado === undefined) throw new BadRequestError('El campo Estado es obligatorio');

    const servicio = await servicioService.toggleEstado(Number(req.params.id), Estado);
    res.json({ status: 'ok', data: servicio });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, patchEstado };
