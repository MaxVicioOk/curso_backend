import fs from 'fs'

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
}
export default CartManager;