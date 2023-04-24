const fs = require("fs")

// Creando la clase
class ProductManager {
    constructor(path){
        this.path = path
        this.products = JSON.parse(fs.readFileSync(this.path, "utf-8")) ?? [];
        this.id = JSON.parse(fs.readFileSync("id.json", "utf-8")) ?? 0
    }
    //Método para agregar productos y checkear que no estén repetidos
    addProduct(product){
        let pCheck = this.products.find(check => check.code === product.code);
        if (pCheck){
            return 'This product already exist'
        }
        if (!product.title ?? !product.description ?? !product.price ?? !product.thumbnail ?? !product.code ?? !product.stock){
            return 'Filds missing'
        }
        this.id++;
        product.id = this.id;
        this.products.push(product);
        fs.writeFileSync(this.path, JSON.stringify(this.products))
        fs.writeFileSync("id.json", JSON.stringify(this.id))
        return 'Product added'
    }
    //Método para mostrar los productos agregados
    getProducts(){
        return this.products;
    }
    //Método para buscar un producto por ID
    getProductById(id){
        let catched = this.products.find(check => check.id === id);
        if (!catched){
            return 'Product not found'
        }
        return catched
    }

    updateProduct(id, prodMod){
        const prodToMod = this.products.find((prod) => prod.id === id);
        if (!prodToMod) return 'Product not found'
        if (prodMod.title) prodToMod.title = prodMod.title;
        if (prodMod.description) prodToMod.description = prodMod.description;
        if (prodMod.price) prodToMod.price = prodMod.price;
        if (prodMod.thumbnail) prodToMod.thumbnail = prodMod.thumbnail;
        if (prodMod.code) prodToMod.code = prodMod.code;
        if (prodMod.stock) prodToMod.stock = prodMod.stock;
        const updatedProduct = {id, ...prodToMod};
        const i = this.products.indexOf(prodToMod);
        this.products.splice(i, 1, updatedProduct)
        fs.writeFileSync(this.path, JSON.stringify(this.products))
        return "Product updated"
    }
    deleteProduct(id){
        const i = this.products.findIndex((e) => e.id === id)
        if (i == -1) return "The product doesn't existe"
        this.products.splice(i, 1)
        fs.writeFileSync(this.path, JSON.stringify(this.products))
        return "Product deleted"
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

console.log(productManager.getProducts())
console.log(productManager.addProduct(product))
console.log(productManager.addProduct(product))
console.log(productManager.addProduct(product2))
console.log(productManager.getProducts())
console.log(productManager.getProductById(1))
console.log(productManager.getProductById(3))
console.log(productManager.updateProduct(2, modProduct))
console.log(productManager.getProducts())
console.log(productManager.deleteProduct(JSON.parse(fs.readFileSync("id.json", "utf-8"))))
console.log(productManager.getProducts())