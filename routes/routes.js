/**
 * User and Admin API endpoints
 */

import { trackMaintenanceActivity } from '../middileware/routeTracking.js';
import { standardManageError } from '../controllers/failureHandler.js';
import { user, product } from '../services/index.js';

const handler = (app) => {
    app.all('*', (req, res, next) => {
        trackMaintenanceActivity(req, res, next);
    });
    
    //user endpoints
    app.post('/create/user',(req,res) => {
        user.createUser(req,res)
    })

    app.get('/get/all/users',(req,res) =>{
        user.getAllUser(req, res)
    })

    app.delete('/user/:id', (req, res)=> {
        user.deleteUser(req, res)
    })

    //product endpoints
    app.post('/create/product',(req,res) => {
        product.createProduct(req,res)
    })

    app.get('/get/all/products',(req,res) =>{
        product.getAllProduct(req, res)
    })

    app.put('/update/product/details', (req, res)=> {
        product.updateProduct(req, res)
    })

    app.delete('/product/:id', (req, res)=> {
        product.deleteProduct(req, res)
    })

    //filter api for users and product 
    app.get('/userfilterData', (req, res)=> {
        user.filterData(req,res)
    })
   
    app.all('*', (req, res) => {
        return standardManageError(req, res, `Endpoint - ${req.url} not found`, 'notImplemented');
    });
};

export { handler };
