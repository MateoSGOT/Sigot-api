const Joi = require('joi');

const createSchema = Joi.object({
  id_empleado:      Joi.number().integer().positive().required().messages({
    'any.required': 'El empleado es obligatorio',
  }),
  Descripcion:      Joi.string().max(500).optional().allow('', null),
  Fecha_Novedad:    Joi.date().optional().allow(null),
  FechaRealizacion: Joi.date().optional().allow(null),
});

const updateSchema = Joi.object({
  id_empleado:      Joi.number().integer().positive().optional(),
  Descripcion:      Joi.string().max(500).optional().allow('', null),
  Fecha_Novedad:    Joi.date().optional().allow(null),
  FechaRealizacion: Joi.date().optional().allow(null),
}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo para actualizar',
});

module.exports = { createSchema, updateSchema };
