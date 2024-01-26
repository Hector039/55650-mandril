const urlToAdd = "http://localhost:8080/api/carts/addproduct/";

const productId = document.getElementById("product-id").innerText;
const addToCart = document.getElementById("addToCart");

let add = document.getElementById("add");
let rest = document.getElementById("rest");
let element = document.getElementById("quantity");
let counter = 1;

add.onclick = function () {
    counter++;
    element.textContent = counter;
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
        })
        .catch(function (error) {
            console.log(error);
        });
});

