import express from 'express';
import ProductManager from '../productManager.js';

export const viewsRouter = express.Router();
const productManager = new ProductManager('./src/products.json');

viewsRouter.get("/", async (req, res) => {
    try {
        const limit = req.query.limit
        const products = await productManager.getProducts()
        if(!limit){
            return res.status(200).render('home', {products})
        }
        let limitProducts = products.slice(0, limit)
        res.status(200).render('home', {limitProducts})
    } catch (error) {
        res.status(500).json({message: 'error'})
    }
});
viewsRouter.get ("/add", (req, res) => {
    return res.render('add')
})