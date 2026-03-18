const categoriaRepuestoService = require('../services/categoriaRepuesto.service');
const { createSchema, updateSchema } = require('../validators/categoriaRepuesto.validator');
const { BadRequestError } = require('../errors/httpErrors');

const getAll = async (req, res, next) => {
  try {
    const categorias = await categoriaRepuestoService.getAll();
    res.json({ status: 'ok', data: categorias });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const categoria = await categoriaRepuestoService.getById(Number(req.params.id));
    res.json({ status: 'ok', data: categoria });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const categoria = await categoriaRepuestoService.create(value);
    res.status(201).json({ status: 'ok', data: categoria });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { error, value } = updateSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const categoria = await categoriaRepuestoService.update(Number(req.params.id), value);
    res.json({ status: 'ok', data: categoria });
  } catch (err) {
    next(err);
  }
};

const patchEstado = async (req, res, next) => {
  try {
    const { Estado } = req.body;
    if (Estado === undefined) throw new BadRequestError('El campo Estado es obligatorio');

    const categoria = await categoriaRepuestoService.toggleEstado(Number(req.params.id), Estado);
    res.json({ status: 'ok', data: categoria });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, patchEstado };
