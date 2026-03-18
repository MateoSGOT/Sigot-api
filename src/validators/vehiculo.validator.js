const Joi = require('joi');

const createSchema = Joi.object({
  Placa: Joi.string().max(10).required().messages({
    'any.required': 'La placa es obligatoria',
  }),
  VIN: Joi.string().max(30).optional().allow('', null),
  Id_Cliente: Joi.number().integer().required().messages({
    'any.required': 'El cliente es obligatorio',
  }),
  Id_Marca: Joi.number().integer().required().messages({
    'any.required': 'La marca es obligatoria',
  }),
  Modelo: Joi.string().max(50).required().messages({
    'any.required': 'El modelo es obligatorio',
  }),
  Año: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).required().messages({
    'any.required': 'El año es obligatorio',
    'number.min': 'El año no es válido',
    'number.max': 'El año no puede ser mayor al año actual',
  }),
  Color:      Joi.string().max(30).optional().allow('', null),
  NumeroEjes: Joi.number().integer().min(1).optional().allow(null),
});

const updateSchema = Joi.object({
  Placa:      Joi.string().max(10).optional(),
  VIN:        Joi.string().max(30).optional().allow('', null),
  Id_Cliente: Joi.number().integer().optional(),
  Id_Marca:   Joi.number().integer().optional(),
  Modelo:     Joi.string().max(50).optional(),
  Año:        Joi.number().integer().min(1900).max(new Date().getFullYear() + 1).optional(),
  Color:      Joi.string().max(30).optional().allow('', null),
  NumeroEjes: Joi.number().integer().min(1).optional().allow(null),
}).min(1).messages({
  'object.min': 'Debes enviar al menos un campo para actualizar',
});

module.exports = { createSchema, updateSchema };
