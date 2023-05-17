import express from 'express';
import ProductManager from '../productManager.js';

export const socketRouter = express.Router();
const productManager = new ProductManager('./src/products.json');

socketRouter.get("/", async (req, res) => {
    try {
        const limit = req.query.limit
        const products = await productManager.getProducts()
        if(!limit){
            return res.status(200).render('realtimeproducts', {products})
        }
        let limitProducts = products.slice(0, limit)
        res.status(200).render('realtimeproducts', {limitProducts})
    } catch (error) {
        res.status(500).json({message: 'error'})
    }
});