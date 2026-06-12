const Joi = require('joi');

// Validation Schemas
const createPaymentSchema = Joi.object({
  orderId: Joi.string().required().messages({
    'string.empty': 'orderId cannot be empty',
    'any.required': 'orderId is required'
  }),
  userId: Joi.string().optional(),
  userEmail: Joi.string().email().optional().messages({
    'string.email': 'userEmail must be a valid email'
  }),
  phone: Joi.string()
    .pattern(/^(\+509|509)?[0-9]{8}$/)
    .required()
    .messages({
      'string.pattern.base': 'phone must be a valid Haiti phone number (+509XXXXXXXX)'
    }),
  amount: Joi.number().positive().required().messages({
    'number.positive': 'amount must be positive'
  }),
  currency: Joi.string().valid('HTG', 'USD', 'EUR').required().messages({
    'any.only': 'currency must be HTG, USD, or EUR'
  }),
  description: Joi.string().optional().max(255)
});

const verifyPaymentSchema = Joi.object({
  orderId: Joi.string().required(),
  paymentReference: Joi.string().required()
});

module.exports = {
  createPaymentSchema,
  verifyPaymentSchema
};
