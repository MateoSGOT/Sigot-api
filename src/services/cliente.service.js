const clienteModel = require('../models/cliente.model');
const { getPool, sql } = require('../config/db');
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
  const pool = getPool();
  const tipoResult = await pool.request()
    .input('Id_TipoDoc', sql.Int, data.Id_TipoDoc)
    .query('SELECT Id_TipoDoc FROM Tipo_Doc WHERE Id_TipoDoc = @Id_TipoDoc');
  if (!tipoResult.recordset[0]) throw new NotFoundError(`Tipo de documento con ID ${data.Id_TipoDoc} no encontrado`);

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
