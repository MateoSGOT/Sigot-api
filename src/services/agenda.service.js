const agendaModel   = require('../models/agenda.model');
const clienteModel  = require('../models/cliente.model');
const vehiculoModel = require('../models/vehiculo.model');
const empleadoModel = require('../models/empleado.model');
const { NotFoundError } = require('../errors/httpErrors');

const getAll = async () => {
  return agendaModel.findAll();
};

const getById = async (id) => {
  const agenda = await agendaModel.findById(id);
  if (!agenda) throw new NotFoundError(`Agenda con ID ${id} no encontrada`);
  return agenda;
};

const create = async (data) => {
  const cliente = await clienteModel.findById(data.Id_Cliente);
  if (!cliente) throw new NotFoundError(`Cliente con ID ${data.Id_Cliente} no encontrado`);

  const vehiculo = await vehiculoModel.findById(data.Id_Vehiculo);
  if (!vehiculo) throw new NotFoundError(`Vehículo con ID ${data.Id_Vehiculo} no encontrado`);

  const empleado = await empleadoModel.findById(data.id_empleado);
  if (!empleado) throw new NotFoundError(`Empleado con ID ${data.id_empleado} no encontrado`);

  return agendaModel.create(data);
};

const update = async (id, data) => {
  await getById(id);
  const updated = await agendaModel.update(id, data);
  if (!updated) throw new NotFoundError(`Agenda con ID ${id} no encontrada`);
  return updated;
};

const toggleEstado = async (id, estado) => {
  await getById(id);
  const updated = await agendaModel.toggleEstado(id, estado);
  if (!updated) throw new NotFoundError(`Agenda con ID ${id} no encontrada`);
  return updated;
};

const generarOrden = async (id, data) => {
  await getById(id);
  return agendaModel.createOrden(id, data);
};

module.exports = { getAll, getById, create, update, toggleEstado, generarOrden };
