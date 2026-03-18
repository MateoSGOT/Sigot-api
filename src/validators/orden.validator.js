const Joi = require('joi');

const updateSchema = Joi.object({
  Diagnostico:  Joi.string().max(500).optional().allow('', null),
  Kilometraje:  Joi.number().integer().min(0).optional().allow(null),
  FechaIngreso: Joi.date().optional().allow(null),
  FechaEntrega: Joi.date().optional().allow(null),
}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo para actualizar',
});

const addServicioSchema = Joi.object({
  Id_Servicio:     Joi.number().integer().positive().required().messages({
    'any.required': 'El Id_Servicio es obligatorio',
  }),
  precio_unitario: Joi.number().precision(2).positive().required().messages({
    'any.required':    'El precio_unitario es obligatorio',
    'number.positive': 'El precio_unitario debe ser mayor a 0',
  }),
});

const addRepuestoSchema = Joi.object({
  Id_Repuesto:     Joi.number().integer().positive().required().messages({
    'any.required': 'El Id_Repuesto es obligatorio',
  }),
  cantidad:        Joi.number().integer().min(1).required().messages({
    'any.required': 'La cantidad es obligatoria',
    'number.min':   'La cantidad debe ser al menos 1',
  }),
  precio_unitario: Joi.number().precision(2).positive().required().messages({
    'any.required':    'El precio_unitario es obligatorio',
    'number.positive': 'El precio_unitario debe ser mayor a 0',
  }),
});

module.exports = { updateSchema, addServicioSchema, addRepuestoSchema };
