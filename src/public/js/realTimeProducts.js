const socket = io();//instancio el socket cliente

const addProductBtn = document.getElementById("addProductBtn");

const url = "http://localhost:8080/realtimeproducts";


addProductBtn.addEventListener("click", () => {

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;
    const thumbnails = document.getElementById("thumbnails").value;
    
    axios.post(url, {
        title,
        description,
        code,
        price,
        stock,
        category,
        thumbnails
    }).then(response => {
        console.log(response);
    }).catch(e => {
        console.log(e);
    });

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("code").value = "";
    document.getElementById("price").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("category").value = "";
    document.getElementById("thumbnails").value = "";

});


function deleteProduct(id) {
    axios.delete(url + "/" + id)
        .then(res => console.log(res))
        .catch(error => console.log(error));
};

socket.on("updateList", (products) => {

    let productCardContainer = document.getElementById("product-container");

    let data = "";

    products.forEach((elem) => {
        data += `

        <div id="product-card">
        <p id="product-id">ID: ${elem.id}</p>
        <p id="product-title">Nombre: ${elem.title}</p>
        <p id="product-price">Precio: ${elem.price}</p>
        <p id="product-stock">Stock: ${elem.stock}</p>
        <br>
        <button id="deleteProductBtn" onclick="deleteProduct(${elem.id})">Borrar Producto</button>
        </div>
    `;
    });

    productCardContainer.innerHTML = data;

});
