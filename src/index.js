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
            throw new Error(error.message)
        }
    }
    // Leer el JSON de ID de forma asíncrona
    async readID(){
        try {
            if (fs.existsSync("id.json")){
                return JSON.parse(await fs.promises.readFile("id.json", "utf-8"))
            }
            await fs.promises.writeFile("id.json", JSON.stringify(0))
            return 0
        } catch (error) {
            throw new Error(error.message)
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
            if (!product.title ?? !product.description ?? !product.price ?? !product.thumbnail ?? !product.code ?? !product.stock){
                return 'Filds missing'
            }
            let id = await this.readID()
            id++;
            product.id = id;
            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products))
            await fs.promises.writeFile("id.json", JSON.stringify(id))
            return 'Product added'
        } catch (error) {
            throw new Error(error.message)
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
            throw new Error(error.message)
        }
    }
    // Metodo para actualizar un producto
    async updateProduct(id, prodMod){
        try {
            let products = await this.getProducts();
            const prodToMod = products.find((prod) => prod.id === id);
            if (!prodToMod) return 'Product not found'
            if (prodMod.title) prodToMod.title = prodMod.title;
            if (prodMod.description) prodToMod.description = prodMod.description;
            if (prodMod.price) prodToMod.price = prodMod.price;
            if (prodMod.thumbnail) prodToMod.thumbnail = prodMod.thumbnail;
            if (prodMod.code) prodToMod.code = prodMod.code;
            if (prodMod.stock) prodToMod.stock = prodMod.stock;
            const updatedProduct = {id, ...prodToMod};
            const i = products.indexOf(prodToMod);
            products.splice(i, 1, updatedProduct)
            await fs.promises.writeFile(this.path, JSON.stringify(products))
            return "Product updated"
        } catch (error) {
            throw new Error(error.message)
        }
    }
    // Metodo para borrar un producto por ID
    async deleteProduct(id){
        try {
            let products = await this.getProducts();
            const i = products.findIndex((e) => e.id === id)
            if (i == -1) return "The product doesn't existe"
            products.splice(i, 1)
            await fs.promises.writeFile(this.path, JSON.stringify(products))
            return "Product deleted"
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

//Productos a agregar
const product = {
    title: "Las Galles",
    description: "Galletitas",
    price: 270,
    thumbnail: "https://www.clarin.com/img/2020/09/07/hGBJSRQ0d_340x340__1.jpg",
    code: "aA000aA",
    stock: 88,
}
const product2 = {
    title: "Chocolatoso",
    description: "Chocolate",
    price: 470,
    thumbnail: "https://img.freepik.com/foto-gratis/arreglo-plano-deliciosas-tabletas-chocolate_23-2149349242.jpg?w=2000",
    code: "aB001bA",
    stock: 47,
}
const modProduct = {
    price: 320,
    stock: 12,
}

//Ejecutando
const productManager = new ProductManager("products.json");

const asyncFn = async () => {
console.log(await productManager.getProducts())
console.log(await productManager.addProduct(product))
console.log(await productManager.addProduct(product))
console.log(await productManager.addProduct(product2))
console.log(await productManager.getProducts())
console.log(await productManager.getProductById(1))
console.log(await productManager.getProductById(3))
console.log(await productManager.updateProduct(2, modProduct))
console.log(await productManager.getProducts())
console.log(await productManager.deleteProduct(JSON.parse(fs.readFileSync("id.json", "utf-8"))))
console.log(await productManager.getProducts())
}
    
export default ProductManager;