import express from 'express'
import { productRouter } from './routes/products.router.js';
import { cartRouter } from './routes/carts.router.js';
import { viewsRouter } from './routes/views.router.js';
import { socketRouter } from './routes/socket.router.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import ProductManager from './productManager.js';

const productManager = new ProductManager('./src/products.json')
const app = express();
const PORT = 8080;
export const localHost = `http://localhost:${PORT}/`;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')
app.use(express.static("./src/public"))

const httpServer = app.listen(PORT, () => {
    console.log(`Example app listening on port ${localHost}`);
});
const socketServer = new Server(httpServer);
socketServer.on('connection', (socket)=>{
    socket.on('msg_front_to_back', async (data)=>{
        await productManager.addProduct(data)
        const products = await productManager.getProducts()
        socketServer.emit('arrayOfProducts', products )
    })
    socket.on('deleteProduct', async (id) => { 
        console.log(JSON.stringify(id));
        await productManager.deleteProduct(id);
        const products = await productManager.getProducts();
        socketServer.emit('arrayOfProducts', products )
    });
})

app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter) // <-- y que llegue a esta ruta
app.use("/products", viewsRouter)
app.use("/realtimeproducts", socketRouter)

app.get("*", async (req, res) => {
    return res.status(404).json({
        status: "Error",
        message: "no se encuentra la ruta",
    })
});
