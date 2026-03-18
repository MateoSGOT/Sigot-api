const novedadService = require('../services/novedad.service');
const { createSchema, updateSchema } = require('../validators/novedad.validator');
const { BadRequestError } = require('../errors/httpErrors');

const getAll = async (req, res, next) => {
  try {
    const novedades = await novedadService.getAll();
    res.json({ status: 'ok', data: novedades });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const novedad = await novedadService.getById(Number(req.params.id));
    res.json({ status: 'ok', data: novedad });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const novedad = await novedadService.create(value);
    res.status(201).json({ status: 'ok', data: novedad });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { error, value } = updateSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const novedad = await novedadService.update(Number(req.params.id), value);
    res.json({ status: 'ok', data: novedad });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update };
