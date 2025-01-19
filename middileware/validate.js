import * as payloads from '../models/payloads.js';


/**
 *
 * @description payload validation
 * @param {object} payload - request body
 * @param {string} apiName - request endpoint
 * @return {object} promise with object
 */
const payload = (payload, apiName) => {
    return new Promise((resolve, reject) => {
        try {
            if (!payload || !Object.values(payload).length) return reject('Payload not provided');
            const schema = payloads[apiName];
            if (!schema) return reject('Invalid section');
            const result = schema.validate(payload);

            if (result.error) return reject(result.error.message.replace(/"/g, ''));
            else return resolve(result.value);
        } catch (exception) {
            return reject(exception);
        }
    });
};

export { payload }
