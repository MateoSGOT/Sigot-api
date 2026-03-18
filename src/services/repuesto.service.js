const repuestoModel          = require('../models/repuesto.model');
const categoriaRepuestoModel = require('../models/categoriaRepuesto.model');
const { NotFoundError } = require('../errors/httpErrors');

const getAll = async () => {
  return repuestoModel.findAll();
};

const getById = async (id) => {
  const repuesto = await repuestoModel.findById(id);
  if (!repuesto) throw new NotFoundError(`Repuesto con ID ${id} no encontrado`);
  return repuesto;
};

const getStock = async () => {
  return repuestoModel.findStock();
};

const create = async (data) => {
  const categoria = await categoriaRepuestoModel.findById(data.Id_categoria);
  if (!categoria) throw new NotFoundError(`Categoría con ID ${data.Id_categoria} no encontrada`);

  return repuestoModel.create(data);
};

const update = async (id, data) => {
  await getById(id);
  const updated = await repuestoModel.update(id, data);
  if (!updated) throw new NotFoundError(`Repuesto con ID ${id} no encontrado`);
  return updated;
};

const toggleEstado = async (id, estado) => {
  await getById(id);
  const updated = await repuestoModel.toggleEstado(id, estado);
  if (!updated) throw new NotFoundError(`Repuesto con ID ${id} no encontrado`);
  return updated;
};

module.exports = { getAll, getById, getStock, create, update, toggleEstado };
