const vehiculoModel = require('../models/vehiculo.model');
const clienteModel  = require('../models/cliente.model');
const { prisma } = require('../config/db');
const { NotFoundError, ConflictError, BadRequestError } = require('../errors/httpErrors');

const getAll = async () => {
  return vehiculoModel.findAll();
};

const getById = async (id) => {
  const vehiculo = await vehiculoModel.findById(id);
  if (!vehiculo) throw new NotFoundError(`Vehículo con ID ${id} no encontrado`);
  return vehiculo;
};

const create = async (data) => {
  const placaExiste = await vehiculoModel.findByPlaca(data.Placa);
  if (placaExiste) throw new ConflictError(`Ya existe un vehículo con la placa ${data.Placa}`);

  if (data.VIN) {
    const vinExiste = await vehiculoModel.findByVIN(data.VIN);
    if (vinExiste) throw new ConflictError(`Ya existe un vehículo con el VIN ${data.VIN}`);
  }

  const cliente = await clienteModel.findById(data.Id_Cliente);
  if (!cliente) throw new NotFoundError(`Cliente con ID ${data.Id_Cliente} no encontrado`);

  const marca = await prisma.marca.findFirst({ where: { Id_Marca: data.Id_Marca, Estado: true } });
  if (!marca) throw new NotFoundError(`Marca con ID ${data.Id_Marca} no encontrada`);

  return vehiculoModel.create(data);
};

const update = async (id, data) => {
  await getById(id);

  if (data.Placa) {
    const placaExiste = await vehiculoModel.findByPlaca(data.Placa, id);
    if (placaExiste) throw new ConflictError(`Ya existe un vehículo con la placa ${data.Placa}`);
  }

  if (data.VIN) {
    const vinExiste = await vehiculoModel.findByVIN(data.VIN, id);
    if (vinExiste) throw new ConflictError(`Ya existe un vehículo con el VIN ${data.VIN}`);
  }

  const updated = await vehiculoModel.update(id, data);
  if (!updated) throw new NotFoundError(`Vehículo con ID ${id} no encontrado`);
  return updated;
};

const toggleEstado = async (id, estado) => {
  if (typeof estado !== 'boolean' && estado !== 0 && estado !== 1) {
    throw new BadRequestError('El campo Estado debe ser 0 o 1');
  }
  await getById(id);
  const updated = await vehiculoModel.toggleEstado(id, estado);
  if (!updated) throw new NotFoundError(`Vehículo con ID ${id} no encontrado`);
  return updated;
};

module.exports = { getAll, getById, create, update, toggleEstado };
