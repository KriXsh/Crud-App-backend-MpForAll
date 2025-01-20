// models/payloads.js

import Joi from 'joi';

const forbiddenPrefixes = ['http', 'http://', 'https', 'https://', 'npm', 'module', '<', 'ahref', '<ahref', '<href', '>'];

const isNotHttpUrlOrModule = (value, helpers) => {
    if (forbiddenPrefixes.some(prefix => value.toLowerCase().startsWith(prefix))) {
        return helpers.message('HTTP URLs are not allowed or unexpected values');
    }
    return value;
};


const createUser = Joi.object({
    name: Joi.string().trim().min(1).max(30).required().messages({
        'string.base': 'name must be a string.',
        'string.empty': 'name cannot be empty.',
        'string.min': 'name must be at least 1 character long.',
        'string.max': 'name cannot exceed 30 characters.',
        'any.required': 'name is required.'
    }),
    email: Joi.string().email().min(5).max(50).custom(isNotHttpUrlOrModule).required().messages({
        'string.base': 'Email must be a string.',
        'string.email': 'Please provide a valid email address.',
        'string.min': 'Email must be at least 5 characters long.',
        'string.max': 'Email cannot exceed 50 characters.',
        'any.required': 'Email is required.',
        'string.custom': 'HTTP URLs are not allowed or unexpected values.'
    }),
    mobile: Joi.string().min(7).max(15).custom(isNotHttpUrlOrModule).required().messages({
        'string.base': 'Mobile number must be a string.',
        'string.min': 'Mobile number must be at least 7 characters long.',
        'string.max': 'Mobile number cannot exceed 15 characters.',
        'any.required': 'Mobile number is required.',
        'string.custom': 'HTTP URLs are not allowed or unexpected values.'
    }),
    role: Joi.string().default("user").messages({
        'string.base': 'Role must be a string.'
    }),
});

const userVerify = Joi.object({
    email: Joi.string().email().min(5).max(50).custom(isNotHttpUrlOrModule).required().messages({
        'string.base': 'Email must be a string.',
        'string.email': 'Please provide a valid email address.',
        'string.min': 'Email must be at least 5 characters long.',
        'string.max': 'Email cannot exceed 50 characters.',
        'any.required': 'Email is required.',
        'string.custom': 'HTTP URLs are not allowed or unexpected values.'
    }),
})


const updateUser =  Joi.object({
    email: Joi.string().email().min(5).max(50).custom(isNotHttpUrlOrModule).required().messages({
        'string.base': 'Email must be a string.',
        'string.email': 'Please provide a valid email address.',
        'string.min': 'Email must be at least 5 characters long.',
        'string.max': 'Email cannot exceed 50 characters.',
        'any.required': 'Email is required.',
        'string.custom': 'HTTP URLs are not allowed or unexpected values.'
    }),
    name: Joi.string().trim().min(1).max(30).required().messages({
        'string.base': 'name must be a string.',
        'string.empty': 'name cannot be empty.',
        'string.min': 'name must be at least 1 character long.',
        'string.max': 'name cannot exceed 30 characters.',
        'any.required': 'name is required.'
    }),
    mobile: Joi.string().min(7).max(15).custom(isNotHttpUrlOrModule).required().messages({
        'string.base': 'Mobile number must be a string.',
        'string.min': 'Mobile number must be at least 7 characters long.',
        'string.max': 'Mobile number cannot exceed 15 characters.',
        'any.required': 'Mobile number is required.',
        'string.custom': 'HTTP URLs are not allowed or unexpected values.'
    }),
})

const createProducts = Joi.object({
    productName: Joi.string().trim().min(1).max(30).required().messages({
        'string.base': 'name must be a string.',
        'string.empty': 'name cannot be empty.',
        'string.min': 'name must be at least 1 character long.',
        'string.max': 'name cannot exceed 30 characters.',
        'any.required': 'name is required.'
    }),
    amount: Joi.number().integer().positive().required().messages({
        'number.base': 'Amount must be a number.',
        'number.integer': 'Amount must be an integer.',
        'number.positive': 'Amount must be a positive number.',
        'any.required': 'Amount is required.'
    }),
    requestedBy: Joi.string().email().min(5).max(50).custom(isNotHttpUrlOrModule).required().messages({
        'string.base': 'Email must be a string.',
        'string.email': 'Please provide a valid email address.',
        'string.min': 'Email must be at least 5 characters long.',
        'string.max': 'Email cannot exceed 50 characters.',
        'any.required': 'Email is required.',
        'string.custom': 'HTTP URLs are not allowed or unexpected values.'
    }),
})

const updateProduct = Joi.object({
    productId : Joi.string().trim().min(10).max(10).required(),
    productName: Joi.string().trim().min(1).max(30).required().messages({
        'string.base': 'name must be a string.',
        'string.empty': 'name cannot be empty.',
        'string.min': 'name must be at least 1 character long.',
        'string.max': 'name cannot exceed 30 characters.',
        'any.required': 'name is required.'
    }),
    amount: Joi.number().integer().positive().required().messages({
        'number.base': 'Amount must be a number.',
        'number.integer': 'Amount must be an integer.',
        'number.positive': 'Amount must be a positive number.',
        'any.required': 'Amount is required.'
    }),
    requestedBy: Joi.string().email().min(5).max(50).custom(isNotHttpUrlOrModule).required().messages({
        'string.base': 'Email must be a string.',
        'string.email': 'Please provide a valid email address.',
        'string.min': 'Email must be at least 5 characters long.',
        'string.max': 'Email cannot exceed 50 characters.',
        'any.required': 'Email is required.',
        'string.custom': 'HTTP URLs are not allowed or unexpected values.'
    }),
})


export {
    createUser,
    userVerify,
    updateUser,
    createProducts,
    updateProduct
}