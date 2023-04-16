// Creando la clase
class ProductManager {
    constructor(){
        this.products = [];
        this.id = 0
    }
    //Método para agregar productos y checkear que no estén repetidos
    addProduct(product){
        let pCheck = this.products.find(check => check.code === product.code);
        if (pCheck){
            return 'This product already exist'
        }
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock){
            return 'Filds missing'
        }
        this.id++;
        product.id = this.id;
        this.products.push(product);
        return 'Product added'
    }
    //Método para mostrar los productos agregados
    getProduct(){
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

//Ejecutando
const productManager = new ProductManager();

console.log(productManager.addProduct(product))
console.log(productManager.addProduct(product2))
console.log(productManager.getProduct())
console.log(productManager.getProductById(1))