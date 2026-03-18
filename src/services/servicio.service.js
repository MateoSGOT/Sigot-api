const servicioModel = require('../models/servicio.model');
const { NotFoundError, ConflictError } = require('../errors/httpErrors');

const getAll = async () => {
  return servicioModel.findAll();
};

const getById = async (id) => {
  const servicio = await servicioModel.findById(id);
  if (!servicio) throw new NotFoundError(`Servicio con ID ${id} no encontrado`);
  return servicio;
};

const create = async (data) => {
  const existe = await servicioModel.findByNombre(data.Nombre);
  if (existe) throw new ConflictError(`Ya existe un servicio con el nombre "${data.Nombre}"`);
  return servicioModel.create(data);
};

const update = async (id, data) => {
  await getById(id);
  if (data.Nombre) {
    const existe = await servicioModel.findByNombre(data.Nombre, id);
    if (existe) throw new ConflictError(`Ya existe un servicio con el nombre "${data.Nombre}"`);
  }
  const updated = await servicioModel.update(id, data);
  if (!updated) throw new NotFoundError(`Servicio con ID ${id} no encontrado`);
  return updated;
};

const toggleEstado = async (id, estado) => {
  await getById(id);
  const updated = await servicioModel.toggleEstado(id, estado);
  if (!updated) throw new NotFoundError(`Servicio con ID ${id} no encontrado`);
  return updated;
};

module.exports = { getAll, getById, create, update, toggleEstado };
