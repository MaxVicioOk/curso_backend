import express from 'express'
import ProductManager from './index.js';

const productManager = new ProductManager('./src/products.json')
const app = express();
const PORT = 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => {
    console.log(`Example app listening on port http://localhost:${PORT}`);
});

//CUANDO HACEN UN PEDIDO EJECUTO ALGUNAS DE ESTAS FUNCIONES
app.get("/products", async (req, res) => {
    try {
        const limit = req.query.limit
        const products = await productManager.getProducts()
        if(!limit){
            return res.status(200).json(products)
        }
        res.status(200).json(products.slice(0, limit))
    } catch (error) {
        res.status(500).json({message: 'error'})
    }
});
app.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params
        const product = await productManager.getProductById(parseInt(pid))
        if(!product){
            return res.status(404).json({error: 'product not found'})
        }
        res.status(200).json(product)
    } catch (error) {
        res.status(400).json({message: 'error'})
    }
    
});