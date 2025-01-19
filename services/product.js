'use strict'

import { standardManageError, errorMapping } from '../controllers/failureHandler.js';
import { validate } from '../middileware/index.js';
import { db, utils } from '../controllers/index.js';



/**
 * @description - this fucniton used to create a product  
 */

const createProduct = async (req, res) => {
    try {
        const requestBody = req.body;
        const payload = await validate.payload(requestBody , 'createProducts')
        const productPayload = {
            ...payload,
            productId : utils.qrCodeId(10), // for uniquie product Id
            createdAt: new Date()

        };
        console.log(productPayload);
        await db.insert(`products`, [productPayload])
            .then(result => console.log("Successfully inserted"))
            .catch(error => console.log("Error inserting"));
        return res.json({
            code: 200,
            message: "products has been created successfully"
        });

    } catch (exception) {
        console.log(exception);
        const errorMessage = errorMapping[exception.code] ||
            exception.message ||
            'An unexpected error occurred. Please try again later.';
        const errorType = exception.message ? 'exception' : 'validate';
        return standardManageError(req, res, errorMessage, errorType);

    }
}

/**
 * @description - this fucniton used to get all users details 
 */

const getAllProduct = async (req, res) =>{
    try {
        const PAGE_SIZE = 50;
        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const startIndex = (pageNumber - 1) * PAGE_SIZE;

        const { totalRecords, records } = await db.getFilterData('products', PAGE_SIZE, startIndex);
        console.log({ totalRecords, records });
        const code = records.length > 0 ? 200 : 404;
        const message = records.length > 0 ? 'Records found successfully' : 'No records found';
        const response = {
            pageNumber,
            pageSize: PAGE_SIZE,
            totalRecords,
            records,
        };
        return res.json({ code, message, result: response })

    } catch (exception) {
        console.log(exception);
        const errorMessage = errorMapping[exception.code] ||
            exception.message ||
            'An unexpected error occurred. Please try again later.';
        const errorType = exception.message ? 'exception' : 'validate';
        return standardManageError(req, res, errorMessage, errorType);
        
    }
}


/**
 * @description - this fucniton used to update the product info
 */

const updateProduct = async (req, res) =>{
    try {
        const requestBody= req.body;
        const payload = await validate.payload(requestBody, 'updateProduct')
        const checkProduct = await db.get('products', `productId $eq ${payload.productId}`)
        if(!checkProduct) return standardManageError(req, res, `Error: No product found`, 'notFound');
        const dbPayload = {
            ...payload,
            updateAt: new Date(),
        }
        await db.update('products', `productId $eq ${payload.productId}`, dbPayload);
        return res.json({
            code: 200,
            message: "products update successfully",
        });        
    } catch (exception) {
        console.log(exception);
        const errorMessage = errorMapping[exception.code] ||
            exception.message ||
            'An unexpected error occurred. Please try again later.';
        const errorType = exception.message ? 'exception' : 'validate';
        return standardManageError(req, res, errorMessage, errorType);        
    }
}


/**
 * @description - this fucniton used to delete the product 
 */

const deleteProduct = async (req, res) =>{
    try {
        const id = req.params.id;
        const checkUser = await db.getDocById('products', id);
        if (!checkUser) {
            return standardManageError(
                req,
                res,
                `product not found`,
                'notFound'
            );
        } 
        await db.deleteDoc('products', id)
        return res.json({
            code: 200,
            message: "product deleted successfully",
        });        
    } catch (exception) {
        console.log(exception);
        const errorMessage = errorMapping[exception.code] ||
            exception.message ||
            'An unexpected error occurred. Please try again later.';
        const errorType = exception.message ? 'exception' : 'validate';
        return standardManageError(req, res, errorMessage, errorType);        
    }
}


export{
    createProduct,
    getAllProduct,
    updateProduct,
    deleteProduct
}