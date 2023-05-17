import express from 'express';
import ProductManager from '../productManager.js';
import { uploader } from '../utils.js';
import { localHost } from '../app.js';

export const productRouter = express.Router();
const productManager = new ProductManager('./src/products.json');

productRouter.get("/", async (req, res) => {
    try {
        const limit = req.query.limit
        const products = await productManager.getProducts()
        if(!limit){
            return res.status(200).json({
                status: "Success",
                message: "Products list",
                payload: products
            })
        }
        res.status(200).json({
            status: "Success",
            message: "Listado de productos",
            payload: products.slice(0, limit)
        })
    } catch (error) {
        res.status(500).json({message: 'error'})
    }
});
productRouter.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params
        const product = await productManager.getProductById(parseInt(pid))
        if(!product){
            return res.status(404).json({
                satus: 'Error',
                message: 'product not found'})
        }
        res.status(200).json({
            status: 'Success',
            message: 'finded product',
            payload: product})
    } catch (error) {
        res.status(400).json({
            status: 'Error',
            message: 'error'})
    }
});
productRouter.post("/", uploader.single('file'), async (req, res) => {
    const newProduct = req.body;
    newProduct.thumbnail = localHost + req.file.filename
    const messageReturned = await productManager.addProduct(newProduct)
    if (messageReturned !== 'Product added')
        return res.status(400).json({
            status: 'Error',
            message: messageReturned
        })
    newProduct.id = await productManager.readID()
    return res.status(201).json({
        status: 'Success',
        message: messageReturned,
        payload: newProduct
    })
})
productRouter.put("/:pid", async (req, res) => {
    const updateParams = req.body;
    const pid = parseInt(req.params.pid);
    const updateMessage = await productManager.updateProduct(pid, updateParams)
    if (updateMessage !== 'Product updated')
        return res.status(400).json({
            status: 'Error',
            message: updateMessage
        })
    const updateProduct = await productManager.getProductById(pid)
    return res.status(202).json({
        status: 'Success',
        message: updateMessage,
        payload: updateProduct
    })
})
productRouter.delete("/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid);
    const productToDelete = await productManager.getProductById(pid)
    const deleteMessage = await productManager.deleteProduct(pid);
    if (deleteMessage !== 'Product deleted')
        return res.status(400).json({
            status: 'Error',
            message: deleteMessage
        })
    return res.status(202).json({
        status: 'Success',
        message: deleteMessage,
        payload: productToDelete
        })
})