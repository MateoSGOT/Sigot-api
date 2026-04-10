const ordenModel    = require('../models/orden.model');
const servicioModel = require('../models/servicio.model');
const repuestoModel = require('../models/repuesto.model');
const { NotFoundError, BadRequestError } = require('../errors/httpErrors');

const FLUJO_VALIDOS = ['Pendiente', 'En proceso', 'Realizado', 'Inactivo'];

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

const cambiarFlujo = async (id, estadoFlujo) => {
  if (!FLUJO_VALIDOS.includes(estadoFlujo)) {
    throw new BadRequestError(`EstadoFlujo inválido. Valores permitidos: ${FLUJO_VALIDOS.join(', ')}`);
  }
  await getById(id);
  const updated = await ordenModel.cambiarFlujo(id, estadoFlujo);
  if (!updated) throw new NotFoundError(`Orden con ID ${id} no encontrada`);
  return updated;
};

const actualizarManoDeObra = async (id, manoDeObra) => {
  await getById(id);
  const updated = await ordenModel.actualizarManoDeObra(id, manoDeObra);
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

const addServicioLibre = async (id, { nombre, precio_unitario }) => {
  await getById(id);
  let servicio = await servicioModel.findByNombre(nombre);
  if (!servicio) {
    servicio = await servicioModel.create({ Nombre: nombre, Precio: precio_unitario, Descripcion: null });
  }
  const subtotal = parseFloat(Number(precio_unitario).toFixed(2));
  return ordenModel.addServicio(id, { Id_Servicio: servicio.Id_Servicio, precio_unitario: subtotal, subtotal });
};

const deleteServicio = async (id, id_servicio) => {
  await getById(id);
  const deleted = await ordenModel.deleteServicio(id, id_servicio);
  if (!deleted) throw new NotFoundError(`Servicio no encontrado en la orden`);
  return deleted;
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

const addRepuestoLibre = async (id, { nombre, cantidad, precio_unitario }) => {
  await getById(id);
  let repuesto = await repuestoModel.findByNombre(nombre);
  if (!repuesto) {
    const created = await repuestoModel.create({
      NombreRepuesto: nombre,
      Stock: 999,
      Precio: precio_unitario,
      Id_categoria: 1,
    });
    repuesto = { Id_Repuesto: created.Id_Repuesto, Stock: 999 };
  }
  const subtotal = parseFloat((cantidad * precio_unitario).toFixed(2));
  return ordenModel.addRepuesto(id, { Id_Repuesto: repuesto.Id_Repuesto, cantidad, precio_unitario, subtotal });
};

const deleteRepuesto = async (id, id_repuesto) => {
  await getById(id);
  const deleted = await ordenModel.deleteRepuesto(id, id_repuesto);
  if (!deleted) throw new NotFoundError(`Repuesto no encontrado en la orden`);
  return deleted;
};

module.exports = {
  getAll, getById, update, toggleEstado,
  cambiarFlujo, actualizarManoDeObra,
  addServicio, addServicioLibre, deleteServicio,
  addRepuesto, addRepuestoLibre, deleteRepuesto,
};
