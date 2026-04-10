const agendaModel   = require('../models/agenda.model');
const clienteModel  = require('../models/cliente.model');
const vehiculoModel = require('../models/vehiculo.model');
const empleadoModel = require('../models/empleado.model');
const { prisma }    = require('../config/db');
const { NotFoundError } = require('../errors/httpErrors');

const getAll = async () => {
  return agendaModel.findAll();
};

const getById = async (id) => {
  const agenda = await agendaModel.findById(id);
  if (!agenda) throw new NotFoundError(`Agenda con ID ${id} no encontrada`);
  return agenda;
};

const create = async (data) => {
  const cliente = await clienteModel.findById(data.Id_Cliente);
  if (!cliente) throw new NotFoundError(`Cliente con ID ${data.Id_Cliente} no encontrado`);

  const vehiculo = await vehiculoModel.findById(data.Id_Vehiculo);
  if (!vehiculo) throw new NotFoundError(`Vehículo con ID ${data.Id_Vehiculo} no encontrado`);

  const empleado = await empleadoModel.findById(data.id_empleado);
  if (!empleado) throw new NotFoundError(`Empleado con ID ${data.id_empleado} no encontrado`);

  return agendaModel.create(data);
};

const update = async (id, data) => {
  await getById(id);
  const updated = await agendaModel.update(id, data);
  if (!updated) throw new NotFoundError(`Agenda con ID ${id} no encontrada`);
  return updated;
};

const toggleEstado = async (id, estado) => {
  await getById(id);
  const updated = await agendaModel.toggleEstado(id, estado);
  if (!updated) throw new NotFoundError(`Agenda con ID ${id} no encontrada`);
  return updated;
};

const generarOrden = async (id, data) => {
  await getById(id);
  return agendaModel.createOrden(id, data);
};

// Crea o actualiza agenda usando nombres/placa en lugar de IDs
const upsertSimple = async (data, agendaId = null) => {
  const { clienteNombre, vehiculoPlaca, vehiculoNombre, empleadoNombre, FechaAgendamiento, Hora, Estado } = data;

  // Buscar o crear cliente por nombre
  let cliente = await prisma.cliente.findFirst({ where: { Nombre: clienteNombre } });
  if (!cliente) {
    cliente = await prisma.cliente.create({
      data: { Nombre: clienteNombre, Documento: '0000', Id_TipoDoc: 1 },
    });
  }

  // Buscar o crear vehículo por placa
  let vehiculo = await prisma.vehiculo.findFirst({ where: { Placa: vehiculoPlaca } });
  if (!vehiculo) {
    const marca = await prisma.marca.findFirst();
    vehiculo = await prisma.vehiculo.create({
      data: {
        Placa:      vehiculoPlaca,
        Id_Cliente: cliente.Id_Cliente,
        Id_Marca:   marca?.Id_Marca ?? 1,
        Modelo:     vehiculoNombre || vehiculoPlaca,
        Año:        new Date().getFullYear(),
      },
    });
  }

  // Buscar empleado por nombre (si no se encuentra usa el primero disponible)
  let empleado = await prisma.empleado.findFirst({ where: { Nombre: empleadoNombre } });
  if (!empleado) empleado = await prisma.empleado.findFirst();

  const agendaData = {
    Id_Cliente:        cliente.Id_Cliente,
    Id_Vehiculo:       vehiculo.Id_Vehiculo,
    id_empleado:       empleado.id_empleado,
    FechaAgendamiento: new Date(FechaAgendamiento),
    Hora,
    ...(Estado !== undefined ? { Estado: Boolean(Estado) } : {}),
  };

  if (agendaId) {
    return agendaModel.update(agendaId, agendaData);
  }
  return agendaModel.create(agendaData);
};

module.exports = { getAll, getById, create, update, toggleEstado, generarOrden, upsertSimple };
