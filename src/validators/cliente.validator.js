const Joi = require('joi');

const createSchema = Joi.object({
  Documento: Joi.string().max(20).required().messages({ 'any.required': 'El documento es obligatorio' }),
  Nombre: Joi.string().max(100).required().messages({ 'any.required': 'El nombre es obligatorio' }),
  Id_TipoDoc: Joi.number().integer().required().messages({ 'any.required': 'El tipo de documento es obligatorio' }),
  Foto:     Joi.string().max(255).optional().allow('', null),
  Correo:   Joi.string().email().max(120).optional().allow('', null),
  Contacto: Joi.string().max(50).optional().allow('', null),
  Telefono: Joi.string().max(50).optional().allow('', null),
  Direccion: Joi.string().max(150).optional().allow('', null),
});

const updateSchema = Joi.object({
  Documento: Joi.string().max(20).optional(),
  Nombre:    Joi.string().max(100).optional(),
  Id_TipoDoc: Joi.number().integer().optional(),
  Foto:     Joi.string().max(255).optional().allow('', null),
  Correo:   Joi.string().email().max(120).optional().allow('', null),
  Contacto: Joi.string().max(50).optional().allow('', null),
  Telefono: Joi.string().max(50).optional().allow('', null),
  Direccion: Joi.string().max(150).optional().allow('', null),
}).min(1).messages({ 'object.min': 'Debes enviar al menos un campo para actualizar' });

module.exports = { createSchema, updateSchema };
