const proveedorService = require('../services/proveedor.service');
const { createSchema, updateSchema } = require('../validators/proveedor.validator');
const { BadRequestError } = require('../errors/httpErrors');

const getAll = async (req, res, next) => {
  try {
    const proveedores = await proveedorService.getAll();
    res.json({ status: 'ok', data: proveedores });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const proveedor = await proveedorService.getById(Number(req.params.id));
    res.json({ status: 'ok', data: proveedor });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const proveedor = await proveedorService.create(value);
    res.status(201).json({ status: 'ok', data: proveedor });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { error, value } = updateSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const proveedor = await proveedorService.update(Number(req.params.id), value);
    res.json({ status: 'ok', data: proveedor });
  } catch (err) {
    next(err);
  }
};

const patchEstado = async (req, res, next) => {
  try {
    const { Estado } = req.body;
    if (Estado === undefined) throw new BadRequestError('El campo Estado es obligatorio');

    const proveedor = await proveedorService.toggleEstado(Number(req.params.id), Estado);
    res.json({ status: 'ok', data: proveedor });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, patchEstado };
