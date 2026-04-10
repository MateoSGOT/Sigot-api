const clienteModel = require('../models/cliente.model');
const { prisma } = require('../config/db');
const { NotFoundError, BadRequestError } = require('../errors/httpErrors');

const getAll = async () => {
  return clienteModel.findAll();
};

const getById = async (id) => {
  const cliente = await clienteModel.findById(id);
  if (!cliente) throw new NotFoundError(`Cliente con ID ${id} no encontrado`);
  return cliente;
};

const create = async (data) => {
  const tipoDoc = await prisma.tipo_Doc.findFirst({ where: { Id_TipoDoc: data.Id_TipoDoc } });
  if (!tipoDoc) throw new NotFoundError(`Tipo de documento con ID ${data.Id_TipoDoc} no encontrado`);

  return clienteModel.create(data);
};

const update = async (id, data) => {
  await getById(id);
  const updated = await clienteModel.update(id, data);
  if (!updated) throw new NotFoundError(`Cliente con ID ${id} no encontrado`);
  return updated;
};

const toggleEstado = async (id, estado) => {
  if (typeof estado !== 'boolean' && estado !== 0 && estado !== 1) {
    throw new BadRequestError('El campo Estado debe ser 0 o 1');
  }
  await getById(id);
  const updated = await clienteModel.toggleEstado(id, estado);
  if (!updated) throw new NotFoundError(`Cliente con ID ${id} no encontrado`);
  return updated;
};

module.exports = { getAll, getById, create, update, toggleEstado };
