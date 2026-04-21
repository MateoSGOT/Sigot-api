const Joi = require('joi');

const createSchema = Joi.object({
  Id_Proveedor: Joi.number().integer().positive().required().messages({ 'any.required': 'El proveedor es obligatorio' }),
  Id_Repuesto:  Joi.number().integer().positive().required().messages({ 'any.required': 'El repuesto es obligatorio' }),
  Cantidad:     Joi.number().integer().min(1).required().messages({ 'any.required': 'La cantidad es obligatoria', 'number.min': 'La cantidad debe ser al menos 1' }),
  PrecioUnitario: Joi.number().precision(2).positive().required().messages({ 'any.required': 'El precio unitario es obligatorio' }),
  Fecha:        Joi.date().required().messages({ 'any.required': 'La fecha es obligatoria', 'date.base': 'La fecha debe ser válida' }),
});

module.exports = { createSchema };
