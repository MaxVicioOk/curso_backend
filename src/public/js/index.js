const socket = io();

socket.on('arrayOfProducts', (products) => {
    const list = document.getElementById('card-list')
    console.log(products)//<-- este console.log me muestra que el array llega bien hasta acá
    let listMsg = ""
    products.forEach(p => {
        console.log(p)//<-- este console.log me muest
        listMsg += `<ul>
                    <li><img src=${p.thumbnail}></li>
                    <li>Nombre: ${p.title}</li>
                    <li>Descripción: ${p.description}</li>
                    <li>Precio: ${p.price}</li>
                    <li>Código: ${p.code}</li>
                    <li><button onclick="deleteProduct(${p.id})">Borrar</button></li>
                </ul>`
    });
    list.innerHTML = listMsg
})

const form = document.getElementById('form')
form.addEventListener('submit', e=> {
    e.preventDefault();
    
    const title = document.getElementById('form-title').value;
    const description = document.getElementById('form-desc').value;
    const price = document.getElementById('form-price').value;
    const code = document.getElementById('form-code').value;
    const stock = document.getElementById('form-stock').value;
    const thumbnail = document.getElementById('form-imgurl').value;

    const prod = {
        title,
        description,
        price: parseInt(price),
        code,
        stock: parseInt(stock),
        thumbnail
    }
    socket.emit('msg_front_to_back', prod)
    form.reset()
});


socket.on('msg_back_to_front', (data) => {
    console.log(JSON.stringify(data));
})

function deleteProduct(id) {
    socket.emit('deleteProduct', id);
}