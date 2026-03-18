const Joi = require('joi');

const createSchema = Joi.object({
  Nombre:      Joi.string().max(80).required().messages({
    'any.required': 'El nombre es obligatorio',
    'string.max':   'El nombre no puede superar los 80 caracteres',
  }),
  Descripcion: Joi.string().max(200).optional().allow('', null),
  Precio:      Joi.number().precision(2).positive().required().messages({
    'any.required':    'El precio es obligatorio',
    'number.positive': 'El precio debe ser mayor a 0',
  }),
});

const updateSchema = Joi.object({
  Nombre:      Joi.string().max(80).optional(),
  Descripcion: Joi.string().max(200).optional().allow('', null),
  Precio:      Joi.number().precision(2).positive().optional(),
}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo para actualizar',
});

module.exports = { createSchema, updateSchema };
