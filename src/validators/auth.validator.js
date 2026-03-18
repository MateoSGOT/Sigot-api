const Joi = require('joi');

const loginSchema = Joi.object({
  Correo: Joi.string().email().required().messages({
    'string.email': 'El correo no tiene un formato válido',
    'any.required': 'El correo es obligatorio',
  }),
  Password: Joi.string().required().messages({
    'any.required': 'La contraseña es obligatoria',
  }),
});

const registroSchema = Joi.object({
  Documento: Joi.string().max(20).required().messages({
    'any.required': 'El documento es obligatorio',
  }),
  Nombre: Joi.string().max(100).required().messages({
    'any.required': 'El nombre es obligatorio',
  }),
  Id_TipoDoc: Joi.number().integer().required().messages({
    'any.required': 'El tipo de documento es obligatorio',
  }),
  Id_Rol: Joi.number().integer().required().messages({
    'any.required': 'El rol es obligatorio',
  }),
  Correo: Joi.string().email().max(120).required().messages({
    'string.email': 'El correo no tiene un formato válido',
    'any.required': 'El correo es obligatorio',
  }),
  Password: Joi.string().min(8).required().messages({
    'string.min': 'La contraseña debe tener al menos 8 caracteres',
    'any.required': 'La contraseña es obligatoria',
  }),
  Foto: Joi.string().max(255).optional().allow('', null),
});

module.exports = { loginSchema, registroSchema };
