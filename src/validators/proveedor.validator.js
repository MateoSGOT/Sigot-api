const Joi = require('joi');

const createSchema = Joi.object({
  Documento:     Joi.string().max(20).required().messages({
    'any.required': 'El documento es obligatorio',
    'string.max':   'El documento no puede superar los 20 caracteres',
  }),
  TipoProveedor: Joi.string().valid('Juridico', 'Natural').required().messages({
    'any.required': 'El tipo de proveedor es obligatorio',
    'any.only':     'El tipo de proveedor debe ser "Juridico" o "Natural"',
  }),
  nombre:    Joi.string().max(120).required().messages({
    'any.required': 'El nombre es obligatorio',
    'string.max':   'El nombre no puede superar los 120 caracteres',
  }),
  correo:    Joi.string().email().max(120).optional().allow('', null),
  contacto:  Joi.string().max(20).optional().allow('', null),
  ciudad:    Joi.string().max(60).optional().allow('', null),
  direccion: Joi.string().max(150).optional().allow('', null),
  detalles:  Joi.string().max(200).optional().allow('', null),
});

const updateSchema = Joi.object({
  Documento:     Joi.string().max(20).optional(),
  TipoProveedor: Joi.string().valid('Juridico', 'Natural').optional().messages({
    'any.only': 'El tipo de proveedor debe ser "Juridico" o "Natural"',
  }),
  nombre:    Joi.string().max(120).optional(),
  correo:    Joi.string().email().max(120).optional().allow('', null),
  contacto:  Joi.string().max(20).optional().allow('', null),
  ciudad:    Joi.string().max(60).optional().allow('', null),
  direccion: Joi.string().max(150).optional().allow('', null),
  detalles:  Joi.string().max(200).optional().allow('', null),
}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo para actualizar',
});

module.exports = { createSchema, updateSchema };
