const compraModel     = require('../models/compra.model');
const proveedorModel  = require('../models/proveedor.model');
const repuestoModel   = require('../models/repuesto.model');
const { NotFoundError } = require('../errors/httpErrors');

const getAll = async () => {
  return compraModel.findAll();
};

const getById = async (id) => {
  const compra = await compraModel.findById(id);
  if (!compra) throw new NotFoundError(`Compra con ID ${id} no encontrada`);
  return compra;
};

const create = async ({ Id_Proveedor, Id_Repuesto, Cantidad, PrecioUnitario, Fecha }) => {
  const proveedor = await proveedorModel.findById(Number(Id_Proveedor));
  if (!proveedor) throw new NotFoundError(`Proveedor con ID ${Id_Proveedor} no encontrado`);

  const repuesto = await repuestoModel.findById(Number(Id_Repuesto));
  if (!repuesto) throw new NotFoundError(`Repuesto con ID ${Id_Repuesto} no encontrado`);

  return compraModel.create({ Id_Proveedor, Id_Repuesto, Cantidad, PrecioUnitario, Fecha });
};

const toggleEstado = async (id, estado) => {
  await getById(id);
  const updated = await compraModel.toggleEstado(id, estado);
  if (!updated) throw new NotFoundError(`Compra con ID ${id} no encontrada`);
  return updated;
};

module.exports = { getAll, getById, create, toggleEstado };
