const agendaService = require('../services/agenda.service');
const { createSchema, updateSchema, ordenSchema } = require('../validators/agenda.validator');
const { BadRequestError } = require('../errors/httpErrors');

const getAll = async (req, res, next) => {
  try {
    const agendas = await agendaService.getAll();
    res.json({ status: 'ok', data: agendas });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const agenda = await agendaService.getById(Number(req.params.id));
    res.json({ status: 'ok', data: agenda });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { error, value } = createSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const agenda = await agendaService.create(value);
    res.status(201).json({ status: 'ok', data: agenda });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { error, value } = updateSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const agenda = await agendaService.update(Number(req.params.id), value);
    res.json({ status: 'ok', data: agenda });
  } catch (err) {
    next(err);
  }
};

const patchEstado = async (req, res, next) => {
  try {
    const { Estado } = req.body;
    if (Estado === undefined) throw new BadRequestError('El campo Estado es obligatorio');

    const agenda = await agendaService.toggleEstado(Number(req.params.id), Estado);
    res.json({ status: 'ok', data: agenda });
  } catch (err) {
    next(err);
  }
};

const generarOrden = async (req, res, next) => {
  try {
    const { error, value } = ordenSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);

    const orden = await agendaService.generarOrden(Number(req.params.id), value);
    res.status(201).json({ status: 'ok', data: orden });
  } catch (err) {
    next(err);
  }
};

const upsertSimple = async (req, res, next) => {
  try {
    const agendaId = req.params.id ? Number(req.params.id) : null;
    const agenda = await agendaService.upsertSimple(req.body, agendaId);
    const status = agendaId ? 200 : 201;
    res.status(status).json({ status: 'ok', data: agenda });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, patchEstado, generarOrden, upsertSimple };
