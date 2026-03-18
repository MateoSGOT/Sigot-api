const ordenModel    = require('../models/orden.model');
const servicioModel = require('../models/servicio.model');
const repuestoModel = require('../models/repuesto.model');
const { NotFoundError, BadRequestError } = require('../errors/httpErrors');

const getAll = async () => {
  return ordenModel.findAll();
};

const getById = async (id) => {
  const orden = await ordenModel.findById(id);
  if (!orden) throw new NotFoundError(`Orden con ID ${id} no encontrada`);
  return orden;
};

const update = async (id, data) => {
  await getById(id);
  const updated = await ordenModel.update(id, data);
  if (!updated) throw new NotFoundError(`Orden con ID ${id} no encontrada`);
  return updated;
};

const toggleEstado = async (id, estado) => {
  await getById(id);
  const updated = await ordenModel.toggleEstado(id, estado);
  if (!updated) throw new NotFoundError(`Orden con ID ${id} no encontrada`);
  return updated;
};

const addServicio = async (id, data) => {
  await getById(id);
  const servicio = await servicioModel.findById(data.Id_Servicio);
  if (!servicio) throw new NotFoundError(`Servicio con ID ${data.Id_Servicio} no encontrado`);
  const subtotal = parseFloat(data.precio_unitario.toFixed(2));
  return ordenModel.addServicio(id, { ...data, subtotal });
};

const addRepuesto = async (id, data) => {
  await getById(id);

  const repuesto = await repuestoModel.findById(data.Id_Repuesto);
  if (!repuesto || !repuesto.Estado) throw new NotFoundError(`Repuesto con ID ${data.Id_Repuesto} no encontrado`);
  if (repuesto.Stock < data.cantidad) {
    throw new BadRequestError(
      `Stock insuficiente. Disponible: ${repuesto.Stock}, solicitado: ${data.cantidad}`
    );
  }

  const subtotal = parseFloat((data.cantidad * data.precio_unitario).toFixed(2));
  return ordenModel.addRepuesto(id, { ...data, subtotal });
};

module.exports = { getAll, getById, update, toggleEstado, addServicio, addRepuesto };
