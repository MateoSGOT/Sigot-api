const Joi = require('joi');

const createSchema = Joi.object({
  NombreRepuesto: Joi.string().max(120).required().messages({
    'any.required': 'El nombre del repuesto es obligatorio',
    'string.max':   'El nombre no puede superar los 120 caracteres',
  }),
  Stock: Joi.number().integer().min(0).default(0),
  Precio: Joi.number().precision(2).positive().required().messages({
    'any.required': 'El precio es obligatorio',
    'number.positive': 'El precio debe ser mayor a 0',
  }),
  Id_categoria: Joi.number().integer().positive().required().messages({
    'any.required': 'La categoría es obligatoria',
  }),
});

const updateSchema = Joi.object({
  NombreRepuesto: Joi.string().max(120).optional(),
  Stock:          Joi.number().integer().min(0).optional(),
  Precio:         Joi.number().precision(2).positive().optional(),
  Id_categoria:   Joi.number().integer().positive().optional(),
}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo para actualizar',
});

module.exports = { createSchema, updateSchema };
