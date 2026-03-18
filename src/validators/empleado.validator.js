const Joi = require('joi');

const createSchema = Joi.object({
  Documento:  Joi.string().max(20).required().messages({
    'any.required': 'El documento es obligatorio',
    'string.max':   'El documento no puede superar los 20 caracteres',
  }),
  Nombre:     Joi.string().max(100).required().messages({
    'any.required': 'El nombre es obligatorio',
    'string.max':   'El nombre no puede superar los 100 caracteres',
  }),
  Id_TipoDoc: Joi.number().integer().positive().required().messages({
    'any.required': 'El tipo de documento es obligatorio',
  }),
  Id_Rol:     Joi.number().integer().positive().required().messages({
    'any.required': 'El rol es obligatorio',
  }),
  Correo:     Joi.string().email().max(120).required().messages({
    'any.required':  'El correo es obligatorio',
    'string.email':  'El correo no tiene un formato válido',
    'string.max':    'El correo no puede superar los 120 caracteres',
  }),
  Password:   Joi.string().min(6).max(255).required().messages({
    'any.required': 'La contraseña es obligatoria',
    'string.min':   'La contraseña debe tener al menos 6 caracteres',
  }),
  Foto:       Joi.string().max(255).optional().allow('', null),
});

const updateSchema = Joi.object({
  Documento:  Joi.string().max(20).optional(),
  Nombre:     Joi.string().max(100).optional(),
  Id_TipoDoc: Joi.number().integer().positive().optional(),
  Id_Rol:     Joi.number().integer().positive().optional(),
  Correo:     Joi.string().email().max(120).optional(),
  Foto:       Joi.string().max(255).optional().allow('', null),
}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo para actualizar',
});

module.exports = { createSchema, updateSchema };
