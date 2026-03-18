const Joi = require('joi');

const detalleSchema = Joi.object({
  Id_Repuesto:  Joi.number().integer().positive().required().messages({
    'any.required': 'El Id_Repuesto de cada detalle es obligatorio',
  }),
  cantidad:     Joi.number().integer().min(1).required().messages({
    'any.required': 'La cantidad de cada detalle es obligatoria',
    'number.min':   'La cantidad debe ser al menos 1',
  }),
  valor_unidad: Joi.number().precision(2).positive().required().messages({
    'any.required': 'El valor_unidad de cada detalle es obligatorio',
    'number.positive': 'El valor_unidad debe ser positivo',
  }),
});

const createSchema = Joi.object({
  Fecha_compra: Joi.date().required().messages({
    'any.required': 'La fecha de compra es obligatoria',
    'date.base':    'La fecha de compra debe ser una fecha válida',
  }),
  id_proveedor: Joi.number().integer().positive().required().messages({
    'any.required': 'El proveedor es obligatorio',
  }),
  detalles: Joi.array().items(detalleSchema).min(1).required().messages({
    'any.required':  'Los detalles de la compra son obligatorios',
    'array.min':     'Debes incluir al menos un detalle',
  }),
});

module.exports = { createSchema };
