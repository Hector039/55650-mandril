const urlToAdd = "http://localhost:8080/api/carts/addproduct/";

const productId = document.getElementById("product-id").innerText;
const productStock = document.getElementById("stock").innerText;
const addToCart = document.getElementById("addToCart");

let add = document.getElementById("add");
let rest = document.getElementById("rest");
let element = document.getElementById("quantity");
let counter = 1;

add.onclick = function () {
    if(counter < parseInt(productStock)){
        counter++;
        element.textContent = counter;
    }
};

rest.onclick = function () {
    if (counter > 1) {
        counter--;
        element.textContent = counter;
    }
};

addToCart.addEventListener("click", async () => {
    await axios.post(urlToAdd + productId, {
        quantity: counter,
    })
        .then(function (response) {
            console.log(response.data.msg);
            Toastify({
                text: "Se añadió el producto.",
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        })
        .catch(function (error) {
            console.log(error);
        });
});

