const rolModel = require('../models/rol.model');
const { NotFoundError, ConflictError, BadRequestError } = require('../errors/httpErrors');

const getAll = async () => {
  return rolModel.findAll();
};

const getById = async (id) => {
  const rol = await rolModel.findById(id);
  if (!rol) throw new NotFoundError(`Rol con ID ${id} no encontrado`);
  return rol;
};

const create = async (data) => {
  const existe = await rolModel.findByNombre(data.Nombre);
  if (existe) throw new ConflictError(`Ya existe un rol con el nombre "${data.Nombre}"`);
  return rolModel.create(data);
};

const update = async (id, data) => {
  await getById(id);
  if (data.Nombre) {
    const existe = await rolModel.findByNombre(data.Nombre, id);
    if (existe) throw new ConflictError(`Ya existe un rol con el nombre "${data.Nombre}"`);
  }
  const updated = await rolModel.update(id, data);
  if (!updated) throw new NotFoundError(`Rol con ID ${id} no encontrado`);
  return updated;
};

const toggleEstado = async (id, estado) => {
  if (estado === undefined) throw new BadRequestError('El campo Estado es obligatorio');
  await getById(id);
  const updated = await rolModel.toggleEstado(id, estado);
  if (!updated) throw new NotFoundError(`Rol con ID ${id} no encontrado`);
  return updated;
};

module.exports = { getAll, getById, create, update, toggleEstado };
