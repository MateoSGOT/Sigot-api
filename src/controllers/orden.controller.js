const ordenService = require('../services/orden.service');
const { updateSchema, addServicioSchema, addRepuestoSchema } = require('../validators/orden.validator');
const { BadRequestError } = require('../errors/httpErrors');

const getAll = async (req, res, next) => {
  try {
    const ordenes = await ordenService.getAll();
    res.json({ status: 'ok', data: ordenes });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const orden = await ordenService.getById(Number(req.params.id));
    res.json({ status: 'ok', data: orden });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const { error, value } = updateSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);
    const orden = await ordenService.update(Number(req.params.id), value);
    res.json({ status: 'ok', data: orden });
  } catch (err) { next(err); }
};

const patchEstado = async (req, res, next) => {
  try {
    const { Estado } = req.body;
    if (Estado === undefined) throw new BadRequestError('El campo Estado es obligatorio');
    const orden = await ordenService.toggleEstado(Number(req.params.id), Estado);
    res.json({ status: 'ok', data: orden });
  } catch (err) { next(err); }
};

const patchFlujo = async (req, res, next) => {
  try {
    const { EstadoFlujo } = req.body;
    if (!EstadoFlujo) throw new BadRequestError('El campo EstadoFlujo es obligatorio');
    const orden = await ordenService.cambiarFlujo(Number(req.params.id), EstadoFlujo);
    res.json({ status: 'ok', data: orden });
  } catch (err) { next(err); }
};

const patchManoDeObra = async (req, res, next) => {
  try {
    const { ManoDeObra } = req.body;
    if (ManoDeObra === undefined) throw new BadRequestError('El campo ManoDeObra es obligatorio');
    const orden = await ordenService.actualizarManoDeObra(Number(req.params.id), ManoDeObra);
    res.json({ status: 'ok', data: orden });
  } catch (err) { next(err); }
};

const addServicio = async (req, res, next) => {
  try {
    const { error, value } = addServicioSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);
    const detalle = await ordenService.addServicio(Number(req.params.id), value);
    res.status(201).json({ status: 'ok', data: detalle });
  } catch (err) { next(err); }
};

const addServicioLibre = async (req, res, next) => {
  try {
    const { nombre, precio_unitario } = req.body;
    if (!nombre || precio_unitario == null) throw new BadRequestError('nombre y precio_unitario son obligatorios');
    const detalle = await ordenService.addServicioLibre(Number(req.params.id), { nombre, precio_unitario: Number(precio_unitario) });
    res.status(201).json({ status: 'ok', data: detalle });
  } catch (err) { next(err); }
};

const deleteServicio = async (req, res, next) => {
  try {
    await ordenService.deleteServicio(Number(req.params.id), Number(req.params.servicioId));
    res.json({ status: 'ok', message: 'Servicio eliminado' });
  } catch (err) { next(err); }
};

const addRepuesto = async (req, res, next) => {
  try {
    const { error, value } = addRepuestoSchema.validate(req.body);
    if (error) throw new BadRequestError(error.details[0].message);
    const detalle = await ordenService.addRepuesto(Number(req.params.id), value);
    res.status(201).json({ status: 'ok', data: detalle });
  } catch (err) { next(err); }
};

const addRepuestoLibre = async (req, res, next) => {
  try {
    const { nombre, cantidad, precio_unitario } = req.body;
    if (!nombre || !cantidad || precio_unitario == null) throw new BadRequestError('nombre, cantidad y precio_unitario son obligatorios');
    const detalle = await ordenService.addRepuestoLibre(Number(req.params.id), { nombre, cantidad: Number(cantidad), precio_unitario: Number(precio_unitario) });
    res.status(201).json({ status: 'ok', data: detalle });
  } catch (err) { next(err); }
};

const deleteRepuesto = async (req, res, next) => {
  try {
    await ordenService.deleteRepuesto(Number(req.params.id), Number(req.params.repuestoId));
    res.json({ status: 'ok', message: 'Repuesto eliminado' });
  } catch (err) { next(err); }
};

module.exports = {
  getAll, getById, update, patchEstado, patchFlujo, patchManoDeObra,
  addServicio, addServicioLibre, deleteServicio,
  addRepuesto, addRepuestoLibre, deleteRepuesto,
};
