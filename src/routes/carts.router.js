import express from 'express';
import CartManager from '../cartManager.js';

export const cartRouter = express.Router();
const cartManager = new CartManager('./src/carts.json');

cartRouter.post('/', async (req, res) => {
    try {
        const addNewCart = await cartManager.addCart();
        if (!addNewCart)
            return res.status(400).json({
                status: 'Error',
                message: addNewCart
        })
        return res.status(201).json({
            status: 'Success',
            message: 'cart added successfully',
            payload: addNewCart
        })
    } catch (error) {
        return error.message;
    }
})
cartRouter.get('/:cid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const allCarts = await cartManager.getCarts();
        const cartFound = allCarts.find((cart) => cart.id == cid);
        if(!cartFound)
            return res.status(404).json({
                status: "Error",
                message: "Sorry, no cart found",
                payload: {},
            })
        return res.status(200).json({
            status: 'Success',
            message: 'Cart found',
            payload: cartFound
        })
    } catch (error) {
        return error.message
    }
})
cartRouter.get('/:cid/products', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const allCarts = await cartManager.getCarts();
        const cartFound = allCarts.find((cart) => cart.id == cid);
        if(!cartFound)
            return res.status(404).json({
                status: "Error",
                message: "Sorry, no cart found",
                payload: {},
            })
        return res.status(200).json({
            status: 'Success',
            message: 'Cart found',
            payload: cartFound.products
        })
    } catch (error) {
        return error.message
    }
})
cartRouter.put('/:cid/products/:pid', async (req, res) =>{
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const modCart = await cartManager.addProductToCart(cid, pid);
    if (!modCart)
        return res.status(500).json({
            status: "Error",
            message: "Not added",
            payload: {},
        })
    return res.status(200).json({
        status: 'Success',
        message: "Added to cart",
        payload: modCart
    })
})