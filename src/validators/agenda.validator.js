const Joi = require('joi');

const timePattern = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;

const createSchema = Joi.object({
  Id_Cliente:        Joi.number().integer().positive().required().messages({
    'any.required': 'El cliente es obligatorio',
  }),
  Id_Vehiculo:       Joi.number().integer().positive().required().messages({
    'any.required': 'El vehículo es obligatorio',
  }),
  id_empleado:       Joi.number().integer().positive().required().messages({
    'any.required': 'El empleado es obligatorio',
  }),
  FechaAgendamiento: Joi.date().required().messages({
    'any.required': 'La fecha de agendamiento es obligatoria',
    'date.base':    'La fecha de agendamiento debe ser una fecha válida',
  }),
  Hora: Joi.string().pattern(timePattern).required().messages({
    'any.required':   'La hora es obligatoria',
    'string.pattern.base': 'La hora debe tener formato HH:MM o HH:MM:SS',
  }),
});

const updateSchema = Joi.object({
  Id_Cliente:        Joi.number().integer().positive().optional(),
  Id_Vehiculo:       Joi.number().integer().positive().optional(),
  id_empleado:       Joi.number().integer().positive().optional(),
  FechaAgendamiento: Joi.date().optional(),
  Hora:              Joi.string().pattern(timePattern).optional().messages({
    'string.pattern.base': 'La hora debe tener formato HH:MM o HH:MM:SS',
  }),
}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo para actualizar',
});

const ordenSchema = Joi.object({
  FechaIngreso: Joi.date().optional().allow(null),
  FechaEntrega: Joi.date().optional().allow(null),
  Diagnostico:  Joi.string().max(500).optional().allow('', null),
  Kilometraje:  Joi.number().integer().min(0).optional().allow(null),
});

module.exports = { createSchema, updateSchema, ordenSchema };
