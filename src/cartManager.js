import fs from 'fs'
import ProductManager from './productManager.js'
const productManager = new ProductManager('./src/products.json')

class CartManager {
    constructor(path){
        this.path = path
    }
    async getCarts(){
        try {
            if (fs.existsSync(this.path)){
                return JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
            }
            await fs.promises.writeFile(this.path, JSON.stringify([]))
            return []
        } catch (error) {
            return error.message
        }
    }
    async readCartID(){
        try {
            if (fs.existsSync("./src/idCarts.json")){
                return JSON.parse(await fs.promises.readFile("./src/idCarts.json", "utf-8"))
            }
            await fs.promises.writeFile("./src/idCarts.json", JSON.stringify(0))
            return 0
        } catch (error) {
            return error.message
        }
    }
    async addCart(){
        try {
            let carts = await this.getCarts()
            let idCarts = await this.readCartID()
            idCarts++;
            const newCart = {
                id: idCarts,
                products: []
            };
            carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 4))
            await fs.promises.writeFile("./src/idCarts.json", JSON.stringify(idCarts))
            return newCart
        } catch (error) {
            return error.message
        }
    }
    async getProductInCart(cartOfProduct, idProduct) {
        const productInCart = cartOfProduct.products.find((product) => product.id == idProduct);
        if (!productInCart)
            return null;
        return productInCart
    }
    async addProductToCart(idCart, idProduct) {
        //busco el carro a modificar
        const allCarts = await this.getCarts()
        const cartToModify = allCarts.find(c => c.id === idCart)
        if (!cartToModify)
            return 'Cart does not exist'
        //Busco que el producto exista
        const allProducts = await productManager.getProducts();
        const productToAdd = allProducts.find((product) => product.id == idProduct);
        if (!productToAdd)
            return "Product does't exist"
        //si el producto no existe en el carro, lo agrego
        const checkProductInCart = await this.getProductInCart(cartToModify, idProduct);
        if (!checkProductInCart){
            const productData = {
                id: productToAdd.id,
                quantity: 1
            }
            cartToModify.products.push(productData)
            const i = allCarts.indexOf(cartToModify);
            allCarts[i] = cartToModify;
            await fs.promises.writeFile(this.path, JSON.stringify(allCarts, null, 4))
            return cartToModify;
        }
        //si el producto ya existe en el carro, modifico la cantidad
        const i = cartToModify.products.indexOf(checkProductInCart);
        const productData = {
            id: checkProductInCart.id,
            quantity: checkProductInCart.quantity + 1
        };
        cartToModify.products[i] = productData
        const iCart = allCarts.indexOf(cartToModify)
        allCarts[iCart] = cartToModify
        await fs.promises.writeFile(this.path, JSON.stringify(allCarts, null, 4))
        return cartToModify;
    }
}
export default CartManager;