import fs from 'fs'

// Creando la clase
class ProductManager {
    constructor(path){
        this.path = path
    }
    //Leer el JSON de productos de forma asíncrona
    async getProducts(){
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
    // Leer el JSON de ID de forma asíncrona
    async readID(){
        try {
            if (fs.existsSync("./src/id.json")){
                return JSON.parse(await fs.promises.readFile("./src/id.json", "utf-8"))
            }
            await fs.promises.writeFile("./src/id.json", JSON.stringify(0))
            return 0
        } catch (error) {
            return error.message
        }
    }
    //Método para agregar productos y checkear que no estén repetidos
    async addProduct(product){
        try {
            let products = await this.getProducts();
            let pCheck = products.find(check => check.code === product.code);
            if (pCheck){
                return 'This product already exist'
            }
            if (!product.title ?? !product.description ?? !product.price ?? !product.code ?? !product.stock){
                return 'Filds missing'
            }
            let id = await this.readID()
            id++;
            product.status = true
            product.id = id;
            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 4))
            await fs.promises.writeFile("./src/id.json", JSON.stringify(id))
            return 'Product added'
        } catch (error) {
            return error.message
        }
        
    }
    //Método para buscar un producto por ID
    async getProductById(id){
        try {
            let products = await this.getProducts();
            let catched = products.find((check) => check.id === id);
            if (!catched){
                return null
            }
            return catched
        } catch (error) {
            return error.message
        }
    }
    // Metodo para actualizar un producto
    async updateProduct(id, {title, description, price, thumbnail, code, stock, status}) {
        try {
            let products = await this.getProducts();
            const prodToMod = products.find((prod) => prod.id === id);
            if (!prodToMod) return 'Product not found'
            if (title) prodToMod.title = title;
            if (description) prodToMod.description = description;
            if (price) prodToMod.price = price;
            if (thumbnail) prodToMod.thumbnail = thumbnail;
            if (code) prodToMod.code = code;
            if (stock) prodToMod.stock = stock;
            if (status) prodToMod.status = status;
            const updatedProduct = {id, ...prodToMod};
            const i = products.indexOf(prodToMod);
            products.splice(i, 1, updatedProduct)
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 4))
            return "Product updated"
        } catch (error) {
            return error.message
        }
    }
    // Metodo para borrar un producto por ID
    async deleteProduct(id){
        try {
            let products = await this.getProducts();
            const i = products.findIndex((e) => e.id === id)
            if (i == -1) return "The product doesn't existe"
            products.splice(i, 1)
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 4))
            return "Product deleted"
        } catch (error) {
            return error.message
        }
    }
}

export default ProductManager;