import express from 'express'
import { productRouter } from './routes/products.router.js';
import { cartRouter } from './routes/carts.router.js';

const app = express();
const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

app.listen(PORT, () => {
    console.log(`Example app listening on port http://localhost:${PORT}`);
});

app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)

app.get("*", async (req, res) => {
    return res.status(404).json({
        status: "Error",
        message: "no se encuentra la ruta",
    })
});
