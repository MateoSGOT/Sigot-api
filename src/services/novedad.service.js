const novedadModel  = require('../models/novedad.model');
const empleadoModel = require('../models/empleado.model');
const { NotFoundError } = require('../errors/httpErrors');

const getAll = async () => {
  return novedadModel.findAll();
};

const getById = async (id) => {
  const novedad = await novedadModel.findById(id);
  if (!novedad) throw new NotFoundError(`Novedad con ID ${id} no encontrada`);
  return novedad;
};

const create = async (data) => {
  const empleado = await empleadoModel.findById(data.id_empleado);
  if (!empleado) throw new NotFoundError(`Empleado con ID ${data.id_empleado} no encontrado`);

  return novedadModel.create(data);
};

const update = async (id, data) => {
  await getById(id);
  const updated = await novedadModel.update(id, data);
  if (!updated) throw new NotFoundError(`Novedad con ID ${id} no encontrada`);
  return updated;
};

module.exports = { getAll, getById, create, update };
