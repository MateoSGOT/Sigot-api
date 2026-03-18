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

const create = async ({ Fecha_compra, id_proveedor, detalles }) => {
  const proveedor = await proveedorModel.findById(id_proveedor);
  if (!proveedor) throw new NotFoundError(`Proveedor con ID ${id_proveedor} no encontrado`);

  for (const det of detalles) {
    const repuesto = await repuestoModel.findById(det.Id_Repuesto);
    if (!repuesto) throw new NotFoundError(`Repuesto con ID ${det.Id_Repuesto} no encontrado`);
  }

  // Calcular subtotal por línea y total general
  const detallesConSubtotal = detalles.map((det) => ({
    ...det,
    subtotal: parseFloat((det.cantidad * det.valor_unidad).toFixed(2)),
  }));

  const Total = parseFloat(
    detallesConSubtotal.reduce((acc, det) => acc + det.subtotal, 0).toFixed(2)
  );

  return compraModel.create({ Fecha_compra, id_proveedor, Total, detalles: detallesConSubtotal });
};

const toggleEstado = async (id, estado) => {
  await getById(id);
  const updated = await compraModel.toggleEstado(id, estado);
  if (!updated) throw new NotFoundError(`Compra con ID ${id} no encontrada`);
  return updated;
};

module.exports = { getAll, getById, create, toggleEstado };
