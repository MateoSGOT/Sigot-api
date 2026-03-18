const empleadoModel = require('../models/empleado.model');
const { getPool, sql } = require('../config/db');
const { NotFoundError, ConflictError } = require('../errors/httpErrors');
const bcrypt = require('bcryptjs');

const getAll = async () => {
  return empleadoModel.findAll();
};

const getById = async (id) => {
  const empleado = await empleadoModel.findById(id);
  if (!empleado) throw new NotFoundError(`Empleado con ID ${id} no encontrado`);
  return empleado;
};

const create = async (data) => {
  const correoExiste = await empleadoModel.findByCorreo(data.Correo);
  if (correoExiste) throw new ConflictError(`Ya existe un empleado con el correo "${data.Correo}"`);

  const docExiste = await empleadoModel.findByDocumento(data.Documento);
  if (docExiste) throw new ConflictError(`Ya existe un empleado con el documento "${data.Documento}"`);

  const pool = getPool();

  const rolResult = await pool.request()
    .input('Id_Rol', sql.Int, data.Id_Rol)
    .query('SELECT Id_Rol FROM Rol WHERE Id_Rol = @Id_Rol AND Estado = 1');
  if (!rolResult.recordset[0]) throw new NotFoundError(`Rol con ID ${data.Id_Rol} no encontrado`);

  const tipoResult = await pool.request()
    .input('Id_TipoDoc', sql.Int, data.Id_TipoDoc)
    .query('SELECT Id_TipoDoc FROM Tipo_Doc WHERE Id_TipoDoc = @Id_TipoDoc');
  if (!tipoResult.recordset[0]) throw new NotFoundError(`Tipo de documento con ID ${data.Id_TipoDoc} no encontrado`);

  const hashedPassword = await bcrypt.hash(data.Password, 10);
  return empleadoModel.create({ ...data, Password: hashedPassword });
};

const update = async (id, data) => {
  await getById(id);

  if (data.Correo) {
    const existe = await empleadoModel.findByCorreo(data.Correo, id);
    if (existe) throw new ConflictError(`Ya existe un empleado con el correo "${data.Correo}"`);
  }

  if (data.Documento) {
    const existe = await empleadoModel.findByDocumento(data.Documento, id);
    if (existe) throw new ConflictError(`Ya existe un empleado con el documento "${data.Documento}"`);
  }

  const updated = await empleadoModel.update(id, data);
  if (!updated) throw new NotFoundError(`Empleado con ID ${id} no encontrado`);
  return updated;
};

const toggleEstado = async (id, estado) => {
  await getById(id);
  const updated = await empleadoModel.toggleEstado(id, estado);
  if (!updated) throw new NotFoundError(`Empleado con ID ${id} no encontrado`);
  return updated;
};

module.exports = { getAll, getById, create, update, toggleEstado };
