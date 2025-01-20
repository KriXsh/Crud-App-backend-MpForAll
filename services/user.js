
'use strict'

import { standardManageError, errorMapping } from '../controllers/failureHandler.js';
import { validate } from '../middileware/index.js';
import { db } from '../controllers/index.js';


/**
 * @description - this fucniton used to create a user 
 */

const createUser = async (req, res) => {
    try {
        const requestBody = req.body;
        const payload = await validate.payload(requestBody , 'createUser')
        const checkUser = await db.get('users', `email $eq ${payload.email}`);
        if (checkUser)
            return standardManageError(req, res, `User ${payload.email} already exists`, 'validate');
        const userId = await db.createNanoUserId();
        const userPayload = {
            ...payload,
            userId: userId,
            role: "user",
            isActive: true,
            createdAt: new Date()
        };
        console.log(userPayload);
        await db.insert(`users`, [userPayload])
            .then(result => console.log("Successfully inserted"))
            .catch(error => console.log("Error inserting"));
        return res.json({
            code: 200,
            message: "User has been created successfully"
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

const userVerify =  async (req, res) => {
    try {
        const requestBody = req.body;
        const payload = await validate.payload(requestBody , 'userVerify')
        const checkUser = await db.get('users', `email $eq ${payload.email}`);
        if (!checkUser)
            return  standardManageError(
                req, 
                res, 
                `User ${payload.email} doesn't exists.. please create user first`, 
                'notFound'
            );
        return res.json({
            code: 200,
            message: "User verifed successfully"
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
 * @description - this fucniton used get oll users details 
 */

const getAllUser = async (req, res) =>{
    try {
        const PAGE_SIZE = 50;
        const pageNumber = parseInt(req.query.pageNumber) || 1;
        const startIndex = (pageNumber - 1) * PAGE_SIZE;

        const { totalRecords, records } = await db.getFilterData('users', PAGE_SIZE, startIndex);
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
 * @description - this fucniton used to delete  users details 
 */
const deleteUser = async (req, res) =>{
    try {
        const id = req.params.id;
        const checkUser = await db.getDocById('users', id);
        if (!checkUser) {
            return standardManageError(
                req,
                res,
                `user not found`,
                'notFound'
            );
        } 
        await db.deleteDoc('users', id)
        return res.json({
            code: 200,
            message: "User deleted successfully",
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
 * @description - this fucniton used to filter users & product details 
 */

const filterData = async (req, res) => {
    try {
        const { email, userId, name, productName, mobile } = req.query;
        if (!email) {
            return res.status(400).json({
                code: 400,
                message: "Email is required for filtering.",
            });
        }
        const pipeline = [
            // Match users based on email or other filters
            {
                $match: {
                    email: { $regex: new RegExp(email, "i") }, // Case-insensitive email match
                    ...(userId ? { userId: parseInt(userId) } : {}),
                    ...(name ? { name: { $regex: new RegExp(name, "i") } } : {}),
                    ...(mobile ? { mobile: mobile } : {}),
                },
            },
            // Lookup products where 'requestedBy' matches the email
            {
                $lookup: {
                    from: "products",
                    let: { userEmail: "$email" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$requestedBy", "$$userEmail"], // Join based on email
                                },
                            },
                        },
                        ...(productName
                            ? [{ $match: { productName: { $regex: new RegExp(productName, "i") } } }]
                            : []),
                    ],
                    as: "products",
                },
            },
            // Add computed fields for transformation
            {
                $addFields: {
                    productCount: { $size: "$products" },
                },
            },
            // Optionally project specific fields
            {
                $project: {
                    _id: 0,
                    userId: 1,
                    name: 1,
                    email: 1,
                    mobile: 1,
                    productCount: 1,
                    products: {
                        productName: 1,
                        productId: 1,
                        price: 1,
                        createdAt: 1,
                    },
                },
            },
            // Sort results by creation date or other fields
            {
                $sort: { createdAt: -1 },
            },
        ];

        // Execute the aggregation pipeline
        const results = await db.aggregateFilter("users", pipeline);

        // Transform the results (if needed)
        const modifiedResults = results.map(user => ({
            ...user,
            products: user.products || [],
            productCount: user.productCount || 0,
        }));

        // Return the results
        return res.json({
            code: 200,
            message: "Data found successfully.",
            results: modifiedResults,
        });
    } catch (exception) {
        console.error(exception);
        return res.status(500).json({
            code: 500,
            message: "An error occurred while processing the request.",
            error: exception.message,
        });
    }
};



export{
    createUser,
    userVerify,
    getAllUser,
    deleteUser,
    filterData
}