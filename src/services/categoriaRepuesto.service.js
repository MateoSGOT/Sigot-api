const categoriaRepuestoModel = require('../models/categoriaRepuesto.model');
const { NotFoundError, ConflictError } = require('../errors/httpErrors');

const getAll = async () => {
  return categoriaRepuestoModel.findAll();
};

const getById = async (id) => {
  const categoria = await categoriaRepuestoModel.findById(id);
  if (!categoria) throw new NotFoundError(`Categoría con ID ${id} no encontrada`);
  return categoria;
};

const create = async (data) => {
  const existe = await categoriaRepuestoModel.findByNombre(data.Nombre);
  if (existe) throw new ConflictError(`Ya existe una categoría con el nombre "${data.Nombre}"`);
  return categoriaRepuestoModel.create(data);
};

const update = async (id, data) => {
  await getById(id);
  if (data.Nombre) {
    const existe = await categoriaRepuestoModel.findByNombre(data.Nombre, id);
    if (existe) throw new ConflictError(`Ya existe una categoría con el nombre "${data.Nombre}"`);
  }
  const updated = await categoriaRepuestoModel.update(id, data);
  if (!updated) throw new NotFoundError(`Categoría con ID ${id} no encontrada`);
  return updated;
};

const toggleEstado = async (id, estado) => {
  await getById(id);
  const updated = await categoriaRepuestoModel.toggleEstado(id, estado);
  if (!updated) throw new NotFoundError(`Categoría con ID ${id} no encontrada`);
  return updated;
};

module.exports = { getAll, getById, create, update, toggleEstado };
