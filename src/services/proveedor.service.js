const proveedorModel = require('../models/proveedor.model');
const { NotFoundError } = require('../errors/httpErrors');

const getAll = async () => {
  return proveedorModel.findAll();
};

const getById = async (id) => {
  const proveedor = await proveedorModel.findById(id);
  if (!proveedor) throw new NotFoundError(`Proveedor con ID ${id} no encontrado`);
  return proveedor;
};

const create = async (data) => {
  return proveedorModel.create(data);
};

const update = async (id, data) => {
  await getById(id);
  const updated = await proveedorModel.update(id, data);
  if (!updated) throw new NotFoundError(`Proveedor con ID ${id} no encontrado`);
  return updated;
};

const toggleEstado = async (id, estado) => {
  await getById(id);
  const updated = await proveedorModel.toggleEstado(id, estado);
  if (!updated) throw new NotFoundError(`Proveedor con ID ${id} no encontrado`);
  return updated;
};

module.exports = { getAll, getById, create, update, toggleEstado };
