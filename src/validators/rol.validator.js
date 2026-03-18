const Joi = require('joi');

const createSchema = Joi.object({
  Nombre: Joi.string().max(50).required().messages({
    'any.required': 'El nombre del rol es obligatorio',
    'string.max':   'El nombre no puede superar los 50 caracteres',
  }),
  Descripcion: Joi.string().max(200).optional().allow('', null),
});

const updateSchema = Joi.object({
  Nombre:      Joi.string().max(50).optional(),
  Descripcion: Joi.string().max(200).optional().allow('', null),
}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo para actualizar',
});

module.exports = { createSchema, updateSchema };
